import { valueIsSignal } from "../../signal";

export const valueIsArray = (value: any) => Array.isArray(value);

export const valueIsHtmlNode = (value: any): boolean =>
  !isNaN(value?.nodeId) && value?.nodeId > 0;

export const valueIsChild = (value: any): boolean =>
  valueIsHtmlNode(value) || typeof value === "string";

export const valueIsSignalChild = (value: any): boolean =>
  valueIsSignal(value) && valueIsChild(value.value);

export const valueIsNonSignalChild = (value: any): boolean =>
  !valueIsSignalChild(value) && valueIsChild(value);

export const valueIsMaybeSignalChild = (value: any): boolean =>
  valueIsChild(value) || valueIsSignalChild(value);

export const valueIsChildrenSignal = (value: any) =>
  valueIsSignal(value) &&
  (valueIsChild(value.value) ||
    (valueIsArray(value.value) &&
      value.value.every((child: any) => valueIsChild(child))));

export const valueIsChildren = (value: any) =>
  valueIsNonSignalChild(value) ||
  (valueIsArray(value) &&
    value.every((item: any) => valueIsMaybeSignalChild(item)));

export const valueIsChildrenProp = (value: any) =>
  valueIsChildrenSignal(value) || valueIsChildren(value);
