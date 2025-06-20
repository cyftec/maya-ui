import { valueIsNonSignal, valueIsSignal } from "@cyftech/signal";

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

export const validChildren = (value: any): boolean =>
  valueIsArray(value) && value.every((item: any) => validChild(item));

export const validChildOrChildren = (value: any): boolean =>
  validChild(value) || validChildren(value);

export const validNonSignalChild = (value: any): boolean =>
  valueIsNonSignal(value) && validChild(value.value);

export const validSignalChild = (value: any): boolean =>
  valueIsSignal(value) && validChild(value.value);

export const validNonSignalChildOrChildren = (value: any): boolean =>
  valueIsNonSignal(value) && validChildOrChildren(value.value);

export const validSignalChildOrChildren = (value: any): boolean =>
  valueIsSignal(value) && validChildOrChildren(value.value);

export const validPlainChildren = (value: any): boolean =>
  valueIsArray(value) &&
  value.every(
    (item: any) =>
      validChild(item) || validNonSignalChild(item) || validSignalChild(item)
  );

export const validPlainChildOrChildren = (value: any): boolean =>
  !valueIsSignal(value) &&
  (validChild(value) ||
    validNonSignalChildOrChildren(value) ||
    validPlainChildren(value));

/**
 * The variable is named as "validCh.." instead of something like
 * "valueIsCh.." because an incoming 'string' value can be validated as
 * Children but not necessariy meant to be of Children type. Hence the name.
 */
export const validChildrenProp = (value: any): boolean =>
  validPlainChildOrChildren(value) || validSignalChildOrChildren(value);
