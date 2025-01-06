import { valueIsSignal } from "@cyftech/signal";

export const valueIsArray = (value: any): boolean => Array.isArray(value);

export const valueIsMHtmlElement = (value: any): boolean =>
  !isNaN(value?.elementId) && value?.elementId > 0;

export const valueIsChild = (value: any): boolean =>
  /**
   * if value is MHtmlElementGetter, never check with valueIsMHtmlElement(value())
   * becaue value() will trigger idGen.getNewId() and it will mess up
   * entire build and mount processes.
   */
  typeof value === "string" || typeof value === "function";

export const valueIsSignalChild = (value: any): boolean =>
  valueIsSignal(value) && valueIsChild(value.value);

export const valueIsNonSignalChild = (value: any): boolean =>
  !valueIsSignalChild(value) && valueIsChild(value);

export const valueIsMaybeSignalChild = (value: any): boolean =>
  valueIsChild(value) || valueIsSignalChild(value);

export const valueIsChildrenSignal = (value: any): boolean =>
  valueIsSignal(value) &&
  (valueIsChild(value.value) ||
    (valueIsArray(value.value) &&
      value.value.every((item: any) => valueIsChild(item))));

export const valueIsPlainChildren = (value: any): boolean =>
  valueIsNonSignalChild(value) ||
  (valueIsArray(value) &&
    value.every((item: any) => valueIsMaybeSignalChild(item)));

export const valueIsChildren = (value: any): boolean =>
  valueIsChildrenSignal(value) || valueIsPlainChildren(value);
