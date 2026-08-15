import type { AttributeValue } from "../types";
import {
  decodeHTMLEntities,
  decodeJSUnicode,
  decodeURIComponentSafe,
} from "./decoders";

const baseSanitizer = (
  input: string,
  dangerousPatterns: RegExp[],
  errorMsg: string,
) => {
  let decoded = input;
  decoded = decodeHTMLEntities(decoded);
  decoded = decodeURIComponentSafe(decoded);
  decoded = decodeJSUnicode(decoded);
  const decodedInput = decoded.trim().toLowerCase();

  for (const dangerousPattern of dangerousPatterns) {
    if (dangerousPattern.test(decodedInput)) {
      throw errorMsg;
    }
  }
  return input;
};

export const sanitizeHref = (input: string) =>
  baseSanitizer(
    input,
    [/^javascript\s*:/i, /^data\s*:/i, /^vbscript\s*:/i, /^file\s*:/i],
    `The href attribute value starting with one of "javascript:", "data:", "vbscript:" or "file:" is not allowed.`,
  );

export const isStrictAssetPath = (url: unknown): boolean => {
  if (typeof url !== "string") return false;

  // Reject spaces, quotes, control chars, query strings (?), hashes (#), schemes (:), and parentheses
  if (/[\x00-\x20\s\'"()?:#]/.test(url)) return false;

  // Reject protocol-relative and backslash-prefixed paths (//, \\, /\, \/)
  if (/^[\/\\][\/\\]/.test(url)) return false;

  // Strictly allow only standard path characters: letters, numbers, /, ., _, -
  return /^[a-zA-Z0-9_\-\.\/]+$/.test(url);
};

export const sanitizeStyle = (input: string) => {
  const sanitizedInput = baseSanitizer(
    input,
    [
      /expression\s*\(/i,
      /javascript\s*:/i,
      /data\s*:/i,
      /vbscript\s*:/i,
      /file\s*:/i,
    ],
    `The style attribute value starting with one of "expression(..", "javascript:", "data:", "vbscript:" or "file:" is not allowed.`,
  );

  const url =
    /url\s*\(/i.test(sanitizedInput) &&
    sanitizedInput.split("url(").pop()?.split(")").shift()?.slice(1, -1);

  if (url && !isStrictAssetPath(url))
    throw `Only relative import is allowed in "url(..".`;

  return input;
};

export const sanitizeAttributeValue = (
  attribKey: string,
  attribValue: AttributeValue,
): AttributeValue => {
  if (attribKey === "href") {
    if (typeof attribValue === "boolean")
      throw `The value of 'href' attribute should not be a boolean`;
    return sanitizeHref(attribValue || "");
  }
  if (attribKey === "style") {
    if (typeof attribValue === "boolean")
      throw `The value of 'style' attribute should not be a boolean`;
    return sanitizeStyle(attribValue || "");
  }

  return attribValue;
};
