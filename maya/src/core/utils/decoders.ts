// Decode HTML entities safely
let nonDomTextareaElement: HTMLTextAreaElement;
export const decodeHTMLEntities = (stringWithEntities: string) => {
  if (!nonDomTextareaElement) {
    nonDomTextareaElement = document.createElement("textarea");
  }
  nonDomTextareaElement.innerHTML = stringWithEntities;
  return nonDomTextareaElement.value;
};

// Decode URI safely
export const decodeURIComponentSafe = (str: string) => {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
};

// Unescape common JS unicode and hex
export const decodeJSUnicode = (str: string) => {
  return str
    .replace(/\\u[\dA-Fa-f]{4}/g, (m) =>
      String.fromCharCode(parseInt(m.slice(2), 16))
    )
    .replace(/\\x[\dA-Fa-f]{2}/g, (m) =>
      String.fromCharCode(parseInt(m.slice(2), 16))
    );
};
