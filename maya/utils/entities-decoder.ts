let nonDomTextareaElement: HTMLTextAreaElement;

export const decodeEntity = (stringWithEntities: string) => {
  if (!nonDomTextareaElement) {
    nonDomTextareaElement = document.createElement("textarea");
  }
  nonDomTextareaElement.innerHTML = stringWithEntities;
  return nonDomTextareaElement.value;
};
