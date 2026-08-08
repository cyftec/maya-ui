import { valueIsDeadSignal, valueIsLiveSignal } from "@cyftec/signal";

export const valueIsArray = (value: any): boolean => Array.isArray(value);

export const valueIsMayaNode = (value: any): boolean =>
  !isNaN(value?.nodeID) && value?.nodeID > 0;

export const validMayaNodeGetter = (value: any) =>
  typeof value === "function" && value.isMayaNodeGetter === true;

export const validPlainChild = (value: any): boolean =>
  /**
   * if value is MayaNodeGetter, never check with valueIsMayaNode(value())
   * becaue value() will trigger idGen.getNewId() and it will mess up
   * entire build and mount processes.
   */
  value === undefined ||
  typeof value === "string" ||
  validMayaNodeGetter(value);

export const validPlainChildren = (value: any): boolean =>
  valueIsArray(value) && value.every((item: any) => validPlainChild(item));

export const validPlainChildOrChildren = (value: any): boolean =>
  validPlainChild(value) || validPlainChildren(value);

export const validDeadSignalChild = (value: any): boolean =>
  valueIsDeadSignal(value) && validPlainChild(value.value);

export const validLiveSignalChild = (value: any): boolean =>
  valueIsLiveSignal(value) && validPlainChild(value.value);

export const validChildren = (value: any): boolean =>
  valueIsArray(value) &&
  value.every(
    (item: any) =>
      validPlainChild(item) ||
      validDeadSignalChild(item) ||
      validLiveSignalChild(item),
  );

export const validDeadSignalChildOrChildren = (value: any): boolean =>
  valueIsDeadSignal(value) && validPlainChildOrChildren(value.value);

export const validLiveSignalChildOrChildren = (value: any): boolean =>
  valueIsLiveSignal(value) && validPlainChildOrChildren(value.value);

export const validNonLiveChildOrChildren = (value: any): boolean =>
  !valueIsLiveSignal(value) &&
  (validPlainChild(value) ||
    validDeadSignalChildOrChildren(value) ||
    validChildren(value));

/**
 * The variable is named as "validCh.." instead of something like
 * "valueIsCh.." because an incoming 'string' value can be validated as
 * Children but not necessariy meant to be of Children type. Hence the name.
 */
export const validChildrenProp = (value: any): boolean =>
  validNonLiveChildOrChildren(value) || validLiveSignalChildOrChildren(value);
