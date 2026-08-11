import { valueIsSignal } from "@cyftec/signals";

export const valueIsArray = (value: any): boolean => Array.isArray(value);

export const valueIsMayaNode = (value: any): boolean =>
  !isNaN(value?.nodeID) && value?.nodeID > 0;

export const validMayaNodeGetter = (value: any) =>
  typeof value === "function" && value.isMayaNodeGetter === true;

export const validChild = (value: any): boolean =>
  /**
   * if value is MayaNodeGetter, never check with valueIsMayaNode(value())
   * becaue value() will trigger idGen.getNewId() and it will mess up
   * entire build and mount processes.
   */
  value === undefined ||
  typeof value === "string" ||
  validMayaNodeGetter(value);

export const validChildArray = (value: any): boolean =>
  valueIsArray(value) && value.every((item: any) => validChild(item));

export const validChildOrChildArray = (value: any): boolean =>
  !valueIsSignal(value) && (validChild(value) || validChildArray(value));

export const validChildSignal = (value: any): boolean =>
  valueIsSignal(value) && validChild(value.value);

export const validArrayOfChildOrChildSignal = (value: any): boolean =>
  valueIsArray(value) &&
  value.every((item: any) => validChild(item) || validChildSignal(item));

export const validChildOrArrayOfChildOrChildSignal = (value: any): boolean =>
  !valueIsSignal(value) &&
  (validChild(value) || validArrayOfChildOrChildSignal(value));

export const validSignalOfChildOrChildArray = (value: any): boolean =>
  valueIsSignal(value) && validChildOrChildArray(value.value);

/**
 * The variable is named as "validCh.." instead of something like
 * "valueIsCh.." because an incoming 'string' value can be validated as
 * Children but not necessariy meant to be of Children type. Hence the name.
 */
export const validChildrenProp = (value: any): boolean =>
  validChildOrArrayOfChildOrChildSignal(value) ||
  validSignalOfChildOrChildArray(value);
