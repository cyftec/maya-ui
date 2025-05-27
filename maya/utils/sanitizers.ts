import type { AttributeValue } from "../index.types";
import {
  decodeHTMLEntities,
  decodeJSUnicode,
  decodeURIComponentSafe,
} from "./decoders";

const baseSanitizer = (
  input: string,
  dangerousPatterns: RegExp[],
  errorMsg: string
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
    `The href attribute value starting with one of "javascript:", "data:", "vbscript:" or "file:" is not allowed.`
  );

export const sanitizeStyle = (input: string) =>
  baseSanitizer(
    input,
    [
      /url\s*\(/i,
      /expression\s*\(/i,
      /javascript\s*:/i,
      /data\s*:/i,
      /vbscript\s*:/i,
      /file\s*:/i,
    ],
    `The style attribute value starting with one of "url(..", "expression(..", "javascript:", "data:", "vbscript:" or "file:" is not allowed.`
  );

export const sanitizeAttributeValue = (
  attribKey: string,
  attribValue: AttributeValue
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
