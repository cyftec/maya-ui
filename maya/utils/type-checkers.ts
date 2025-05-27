import {
  valueIsNonSignalString,
  valueIsNonSignalStringArray,
  valueIsSignal,
} from "@cyftech/signal";

export const valueIsArray = (value: any): boolean => Array.isArray(value);

export const valueIsMHtmlElement = (value: any): boolean =>
  !isNaN(value?.elementId) && value?.elementId > 0;

export const validChild = (value: any): boolean =>
  /**
   * if value is MHtmlElementGetter, never check with valueIsMHtmlElement(value())
   * becaue value() will trigger idGen.getNewId() and it will mess up
   * entire build and mount processes.
   */
  value === undefined ||
  typeof value === "string" ||
  (typeof value === "function" && value.isElementGetter);

export const validSignalChild = (value: any): boolean =>
  valueIsSignal(value) && validChild(value.value);

export const validMaybeSignalChild = (value: any): boolean =>
  validChild(value) || validSignalChild(value);

export const validChildrenSignal = (value: any): boolean => {
  return (
    valueIsSignal(value) &&
    (validChild(value.value) ||
      (valueIsArray(value.value) &&
        value.value.every((item: any) => validChild(item))))
  );
};

export const validPlainChildren = (value: any): boolean => {
  return (
    !valueIsSignal(value) &&
    (valueIsNonSignalString(value) ||
      valueIsNonSignalStringArray(value) ||
      validChild(value) ||
      (valueIsArray(value) &&
        value.every((item: any) => validMaybeSignalChild(item))))
  );
};

/**
 * The variable is named as "valid"Children and not something affirmative like
 * "valueIs"Children because an incoming 'string' value can be validated
 * as Children but not necessariy meant to be a child. Hence the below name.
 */
export const validChildren = (value: any): boolean => {
  return validChildrenSignal(value) || validPlainChildren(value);
};
