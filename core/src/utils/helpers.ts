import { valueIsSignal } from "../imported/index";

export const valueIsArray = (value: any) => Array.isArray(value);

export const valueIsHtmlNode = (value: any): boolean =>
  !isNaN(value?.nodeId) && value?.nodeId > 0;

export const valueIsTextNode = (value: any): boolean =>
  !isNaN(value?.nodeId) && value?.nodeId === 0;

export const valueIsNode = (value: any): boolean => !isNaN(value?.nodeId);

export const valueIsSignalNode = (value: any): boolean =>
  valueIsSignal(value) && !isNaN(value.value?.nodeId);

export const valueIsChildrenSignal = (value: any) => {
  if (valueIsSignal(value)) {
    const children = value.value;
    if (valueIsNode(children)) return true;
    if (
      valueIsArray(children) &&
      value.every((child: any) => valueIsNode(child))
    )
      return true;
  }
  return false;
};

export const valueIsChildren = (value: any) => {
  if (valueIsNode(value) || valueIsSignalNode(value)) return true;
  if (
    valueIsArray(value) &&
    value.every((item: any) => valueIsNode(item) || valueIsSignalNode(item))
  )
    return true;
  return false;
};

export const valueIsChildrenProp = (value: any) => {
  if (valueIsChildrenSignal(value)) return true;
  if (valueIsChildren(value)) return true;

  return false;
};
