
    
    // ../maya/utils/constants.ts
var customEventKeys = ["onmount", "onunmount"];
var htmlEventKeys = [
  "onerror",
  "onload",
  "onresize",
  "onblur",
  "onchange",
  "oncontextmenu",
  "onfocus",
  "oninput",
  "oninvalid",
  "onreset",
  "onselect",
  "onsubmit",
  "onkeydown",
  "onkeypress",
  "onkeyup",
  "onclick",
  "ondblclick",
  "ondrag",
  "ondragend",
  "ondragenter",
  "ondragleave",
  "ondragover",
  "ondragstart",
  "ondrop",
  "onmousedown",
  "onmousemove",
  "onmouseout",
  "onmouseover",
  "onmouseup",
  "onscroll",
  "onabort",
  "oncanplay",
  "oncanplaythrough",
  "ondurationchange",
  "onemptied",
  "onended",
  "onerror",
  "onloadeddata",
  "onloadedmetadata",
  "onloadstart",
  "onpause",
  "onplay",
  "onplaying",
  "onprogress",
  "onratechange",
  "onseeked",
  "onseeking",
  "onstalled",
  "onsuspend",
  "ontimeupdate",
  "onvolumechange",
  "onwaiting"
];
var eventKeys = [...htmlEventKeys, ...customEventKeys];
var htmlTagNames = [
  "a",
  "abbr",
  "acronym",
  "address",
  "applet",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "basefont",
  "bdi",
  "bdo",
  "big",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "meta",
  "meter",
  "nav",
  "noframes",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
];
// ../maya/utils/decoders.ts
var nonDomTextareaElement;
var decodeHTMLEntities = (stringWithEntities) => {
  if (!nonDomTextareaElement) {
    nonDomTextareaElement = document.createElement("textarea");
  }
  nonDomTextareaElement.innerHTML = stringWithEntities;
  return nonDomTextareaElement.value;
};
var decodeURIComponentSafe = (str) => {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
};
var decodeJSUnicode = (str) => {
  return str.replace(/\\u[\dA-Fa-f]{4}/g, (m) => String.fromCharCode(parseInt(m.slice(2), 16))).replace(/\\x[\dA-Fa-f]{2}/g, (m) => String.fromCharCode(parseInt(m.slice(2), 16)));
};
// ../maya/utils/id-generator.ts
var idGenerator = () => {
  let _id = 0;
  return {
    getNewId: () => ++_id,
    resetIdCounter: () => _id = 0
  };
};
var idGen = idGenerator();
// ../maya/utils/phase-helpers.ts
var phase = {
  currentIs: (p) => window._currentAppPhase === p,
  start: (p) => {
    window._currentAppPhase = p;
    console.log(`Current phase is ${p}`);
  }
};
// ../maya/utils/sanitizers.ts
var baseSanitizer = (input, dangerousPatterns, errorMsg) => {
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
var sanitizeHref = (input) => baseSanitizer(input, [/^javascript\s*:/i, /^data\s*:/i, /^vbscript\s*:/i, /^file\s*:/i], `The href attribute value starting with one of "javascript:", "data:", "vbscript:" or "file:" is not allowed.`);
var sanitizeStyle = (input) => baseSanitizer(input, [
  /url\s*\(/i,
  /expression\s*\(/i,
  /javascript\s*:/i,
  /data\s*:/i,
  /vbscript\s*:/i,
  /file\s*:/i
], `The style attribute value starting with one of "url(..", "expression(..", "javascript:", "data:", "vbscript:" or "file:" is not allowed.`);
var sanitizeAttributeValue = (attribKey, attribValue) => {
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
// ../node_modules/.bun/@cyftec+immut@0.1.0/node_modules/@cyftec/immut/src/misc.ts
var sortObjectByKeys = (obj) => {
  const sortedEntries = Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0]));
  sortedEntries.forEach(([key, value], index) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      sortedEntries[index] = [key, sortObjectByKeys(value)];
    }
  });
  return Object.fromEntries(sortedEntries);
};
var isPlainObject = (value) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  return Object.prototype.toString.call(value) === "[object Object]";
};
var immut = (value) => {
  if (Array.isArray(value)) {
    const copiedArr = [...value];
    const newArr = [];
    copiedArr.forEach((item) => {
      newArr.push(immut(item));
    });
    return newArr;
  }
  if (isPlainObject(value)) {
    const copiedObj = { ...value };
    const newObj = {};
    Object.keys(copiedObj).forEach((key) => {
      newObj[key] = immut(copiedObj[key]);
    });
    return Object.freeze(newObj);
  }
  return value;
};
var newVal = (oldVal) => {
  if (Array.isArray(oldVal)) {
    const copiedArr = [...oldVal];
    const newArr = [];
    copiedArr.forEach((item) => {
      newArr.push(newVal(item));
    });
    return newArr;
  }
  if (isPlainObject(oldVal)) {
    const copiedObj = { ...oldVal };
    const newObj = {};
    Object.keys(copiedObj).forEach((key) => {
      newObj[key] = newVal(copiedObj[key]);
    });
    return newObj;
  }
  const value = oldVal;
  return value;
};
var indexedArray = (list, uniqueKey = "index") => list.map((item, i) => ({
  [uniqueKey]: i,
  value: item
}));

// ../node_modules/.bun/@cyftec+immut@0.1.0/node_modules/@cyftec/immut/src/equal.ts
var areObjectsEqual = (obj1, obj2) => {
  const sortedObj1 = sortObjectByKeys(obj1);
  const sortedObj2 = sortObjectByKeys(obj2);
  const keys1 = Object.keys(sortedObj1);
  const keys2 = Object.keys(sortedObj2);
  if (keys1.length !== keys2.length)
    return false;
  for (const key of keys1) {
    if (!keys2.includes(key) || !areValuesEqual(sortedObj1[key], sortedObj2[key])) {
      return false;
    }
  }
  return true;
};
var areArraysEqual = (array1, array2) => {
  if (array1.length !== array2.length)
    return false;
  if (array1.length === 0)
    return true;
  for (let i = 0;i < array1.length; i++) {
    if (!areValuesEqual(array1[i], array2[i]))
      return false;
  }
  return true;
};
var areValuesEqual = (value1, value2) => {
  if (typeof value1 !== typeof value2)
    return false;
  if (Array.isArray(value1)) {
    return areArraysEqual(value1, value2);
  }
  if (value1 === null || value2 === null) {
    return value1 === value2;
  }
  if (typeof value1 === "object" && !(value1 instanceof Set)) {
    return areObjectsEqual(value1, value2);
  }
  if (typeof value1 === "bigint" || typeof value1 === "number" || typeof value1 === "string" || typeof value1 === "boolean") {
    return value1 === value2;
  }
  return value1 === value2;
};

// ../node_modules/.bun/@cyftec+immut@0.1.0/node_modules/@cyftec/immut/src/diff.ts
var getArrayMutations = (oldDsitinctItemsArray, newDsitinctItemsArray, idKey) => {
  const indexKey = "index";
  const oldIndexedArr = indexedArray(newVal(oldDsitinctItemsArray), indexKey);
  const newIndexedArr = indexedArray(newVal(newDsitinctItemsArray), indexKey);
  return newIndexedArr.map((newIndexedItem) => {
    let type = "add";
    let oldIndex = -1;
    const value = newIndexedItem.value;
    oldIndexedArr.some((oldIndexedItem, i) => {
      type = areValuesEqual(oldIndexedItem.value, newIndexedItem.value) ? oldIndexedItem[indexKey] === newIndexedItem[indexKey] ? "idle" : "shuffle" : idKey && oldIndexedItem.value[idKey] !== undefined && oldIndexedItem.value[idKey] === newIndexedItem.value[idKey] ? "update" : "add";
      if (type !== "add") {
        oldIndex = oldIndexedItem[indexKey];
        oldIndexedArr.splice(i, 1);
        return true;
      }
      return false;
    });
    return {
      type,
      oldIndex,
      value
    };
  });
};
// ../node_modules/.bun/@cyftec+signal@0.2.3/node_modules/@cyftec/signal/src/_core/signal/signal-methods-objects/array.ts
var getArraySignalIntrinsicMutatingMethodsObject = (valueSetter) => {
  const signalUpdator = (mutatorMethod) => valueSetter((oldValue) => {
    const newValue = Array.from(oldValue);
    mutatorMethod(newValue);
    return newValue;
  });
  return {
    copyWithin: (...args) => signalUpdator((newValue) => newValue.copyWithin(...args)),
    fill: (...args) => signalUpdator((newValue) => newValue.fill(...args)),
    pop: (...args) => signalUpdator((newValue) => newValue.pop(...args)),
    push: (...args) => signalUpdator((newValue) => newValue.push(...args)),
    reverse: (...args) => signalUpdator((newValue) => newValue.reverse(...args)),
    shift: (...args) => signalUpdator((newValue) => newValue.shift(...args)),
    sort: (...args) => signalUpdator((newValue) => newValue.sort(...args)),
    splice: (...args) => signalUpdator((newValue) => newValue.splice(...args)),
    unshift: (...args) => signalUpdator((newValue) => newValue.unshift(...args))
  };
};
var getArraySignalCustomMutatingMethodsObject = (valueSetter) => ({
  keep: (...args) => valueSetter((oldValue) => {
    return oldValue.filter(...args);
  }),
  remove: (...args) => {
    const predicate = args[0];
    const negativeLogicPredicate = (...predicateArgs) => !predicate(...predicateArgs);
    args[0] = negativeLogicPredicate;
    valueSetter((oldValue) => {
      return oldValue.filter(...args);
    });
  }
});
var getArraySignalMutatingMethodsObject = (valueSetter) => ({
  ...getArraySignalIntrinsicMutatingMethodsObject(valueSetter),
  ...getArraySignalCustomMutatingMethodsObject(valueSetter)
});
var getArraySignalIntrinsicNonMutatingMethodsObject = (baseArraySignal) => {
  return {
    at: (...args) => derive(() => baseArraySignal.value.at(...args)),
    concat: (...args) => derive(() => baseArraySignal.value.concat(...args)),
    every: (...args) => derive(() => baseArraySignal.value.every(...args)),
    filter: (...args) => derive(() => baseArraySignal.value.filter(...args)),
    find: (...args) => derive(() => baseArraySignal.value.find(...args)),
    findIndex: (...args) => derive(() => baseArraySignal.value.findIndex(...args)),
    findLast: (...args) => derive(() => baseArraySignal.value.findLast(...args)),
    findLastIndex: (...args) => derive(() => baseArraySignal.value.findLastIndex(...args)),
    length: () => derive(() => baseArraySignal.value.length),
    map: (mapFn) => derive(() => baseArraySignal.value.map(mapFn)),
    reduce: (reducerFn, initialValue) => derive(() => baseArraySignal.value.reduce(reducerFn, initialValue)),
    reduceRight: (reducerFn, initialValue) => derive(() => baseArraySignal.value.reduceRight(reducerFn, initialValue)),
    some: (...args) => derive(() => baseArraySignal.value.some(...args)),
    toReversed: (...args) => derive(() => baseArraySignal.value.toReversed(...args)),
    toSorted: (...args) => derive(() => baseArraySignal.value.toSorted(...args)),
    toSpliced: (...args) => derive(() => baseArraySignal.value.toSpliced(...args))
  };
};
var getArraySignalCustomNonMutatingMethodsObject = (baseArraySignal) => {
  return {
    lastItem: () => {
      return derive(() => {
        const updatedArr = newVal(baseArraySignal.value);
        const returnVal = updatedArr.pop();
        return returnVal;
      });
    },
    partition: (...args) => {
      const conditionPassArray = derive(() => baseArraySignal.value.filter(...args));
      const conditionFailArray = derive(() => baseArraySignal.value.filter((item, index, array) => !args[0](item, index, array)));
      return [conditionPassArray, conditionFailArray];
    }
  };
};
var getArraySignalNonMutatingMethodsObject = (baseArraySignal) => ({
  ...getArraySignalIntrinsicNonMutatingMethodsObject(baseArraySignal),
  ...getArraySignalCustomNonMutatingMethodsObject(baseArraySignal)
});
var getArraySourceSignalMethodsObject = (valueSetter, baseArraySignal) => ({
  ...getArraySignalMutatingMethodsObject(valueSetter),
  ...getArraySignalNonMutatingMethodsObject(baseArraySignal)
});
// ../node_modules/.bun/@cyftec+signal@0.2.3/node_modules/@cyftec/signal/src/_core/signal/signal-methods-objects/boolean.ts
var getBooleanSignalMutatingMethodsObject = (valueSetter) => ({
  toggle: () => valueSetter((oldValue) => !oldValue)
});
var getBooleanSignalNonMutatingMethodsObject = (baseBooleanSignal) => ({
  negated: () => derive(() => !baseBooleanSignal.value)
});
var getBooleanSignalMethodsObject = (valueSetter, baseBooleanSignal) => ({
  ...getBooleanSignalMutatingMethodsObject(valueSetter),
  ...getBooleanSignalNonMutatingMethodsObject(baseBooleanSignal)
});
// ../node_modules/.bun/@cyftec+signal@0.2.3/node_modules/@cyftec/signal/src/_core/signal/signal-methods-objects/number.ts
var getNumberSignalIntrinsicNonMutatingMethodsObject = (baseNumberSignal) => {
  return {
    toExponential: (...args) => derive(() => baseNumberSignal.value.toExponential(...args)),
    toFixed: (...args) => derive(() => baseNumberSignal.value.toFixed(...args)),
    toPrecision: (...args) => derive(() => baseNumberSignal.value.toPrecision(...args)),
    toLocaleString: (locales, options) => derive(() => baseNumberSignal.value.toLocaleString(locales, options))
  };
};
var getNumberSignalCustomNonMutatingMethodsObject = (baseNumberSignal) => {
  return {
    toConfined: (start, end) => derive(() => baseNumberSignal.value < start ? start : baseNumberSignal.value > end ? end : baseNumberSignal.value)
  };
};
var getNumberSignalMethodsObject = (baseNumberSignal) => ({
  ...getNumberSignalIntrinsicNonMutatingMethodsObject(baseNumberSignal),
  ...getNumberSignalCustomNonMutatingMethodsObject(baseNumberSignal)
});
// ../node_modules/.bun/@cyftec+signal@0.2.3/node_modules/@cyftec/signal/src/_core/signal/signal-methods-objects/object.ts
var getObjectSignalMutatingMethodsObject = (valueSetter) => ({
  set: (partiallyNewObjectValue) => valueSetter((oldValue) => ({
    ...oldValue,
    ...partiallyNewObjectValue
  }))
});
var getObjectSignalNonMutatingMethodsObject = (baseObjectSignal) => {
  return {
    prop: (key) => derive(() => baseObjectSignal.value[key]),
    props: () => {
      const signalledPropsObj = {};
      Object.keys(baseObjectSignal.value).forEach((key) => {
        signalledPropsObj[key] = derive(() => baseObjectSignal.value[key]);
      });
      return signalledPropsObj;
    },
    keys: () => derive(() => Object.keys(baseObjectSignal.value))
  };
};
var getObjectSourceSignalMethodsObject = (valueSetter, baseObjectSignal) => ({
  ...getObjectSignalMutatingMethodsObject(valueSetter),
  ...getObjectSignalNonMutatingMethodsObject(baseObjectSignal)
});
// ../node_modules/.bun/@cyftec+signal@0.2.3/node_modules/@cyftec/signal/src/_core/signal/signal-methods-objects/string.ts
var getStringSignalIntrinsicNonMutatingMethodsObject = (baseStringSignal) => {
  return {
    at: (...args) => derive(() => baseStringSignal.value.at(...args)),
    charAt: (...args) => derive(() => baseStringSignal.value.charAt(...args)),
    charCodeAt: (...args) => derive(() => baseStringSignal.value.charCodeAt(...args)),
    codePointAt: (...args) => derive(() => baseStringSignal.value.codePointAt(...args)),
    concat: (...args) => derive(() => baseStringSignal.value.concat(...args)),
    endsWith: (...args) => derive(() => baseStringSignal.value.endsWith(...args)),
    includes: (...args) => derive(() => baseStringSignal.value.includes(...args)),
    indexOf: (...args) => derive(() => baseStringSignal.value.indexOf(...args)),
    lastIndexOf: (...args) => derive(() => baseStringSignal.value.lastIndexOf(...args)),
    padEnd: (...args) => derive(() => baseStringSignal.value.padEnd(...args)),
    padStart: (...args) => derive(() => baseStringSignal.value.padStart(...args)),
    repeat: (...args) => derive(() => baseStringSignal.value.repeat(...args)),
    slice: (...args) => derive(() => baseStringSignal.value.slice(...args)),
    startsWith: (...args) => derive(() => baseStringSignal.value.startsWith(...args)),
    substring: (...args) => derive(() => baseStringSignal.value.substring(...args)),
    trim: (...args) => derive(() => baseStringSignal.value.trim(...args)),
    trimEnd: (...args) => derive(() => baseStringSignal.value.trimEnd(...args)),
    trimStart: (...args) => derive(() => baseStringSignal.value.trimStart(...args)),
    length: () => derive(() => baseStringSignal.value.length),
    localeCompare: (that, locales, options) => derive(() => baseStringSignal.value.localeCompare(that, locales, options)),
    normalize: (form) => derive(() => baseStringSignal.value.normalize(form)),
    replace: (searchValue, replaceValue) => derive(() => baseStringSignal.value.replace(searchValue, replaceValue)),
    replaceAll: (searchValue, replaceValue) => derive(() => baseStringSignal.value.replaceAll(searchValue, replaceValue)),
    search: (regexp) => derive(() => baseStringSignal.value.search(regexp)),
    split: (separator, limit) => derive(() => baseStringSignal.value.split(separator, limit)),
    toLocaleLowerCase: (locales) => derive(() => baseStringSignal.value.toLocaleLowerCase(locales)),
    toLocaleUpperCase: (locales) => derive(() => baseStringSignal.value.toLocaleUpperCase(locales))
  };
};
var getStringSignalCustomNonMutatingMethodsObject = (baseStringSignal) => {
  return {
    lowercase: () => {
      return derive(() => baseStringSignal.value.toLowerCase());
    },
    Sentencecase: () => {
      return derive(() => {
        const str = baseStringSignal.value;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      });
    },
    TitleCase: () => {
      return derive(() => baseStringSignal.value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()));
    },
    UPPERCASE: () => {
      return derive(() => baseStringSignal.value.toUpperCase());
    }
  };
};
var getStringSignalMethodsObject = (baseStringSignal) => ({
  ...getStringSignalIntrinsicNonMutatingMethodsObject(baseStringSignal),
  ...getStringSignalCustomNonMutatingMethodsObject(baseStringSignal)
});
// ../node_modules/.bun/@cyftec+signal@0.2.3/node_modules/@cyftec/signal/src/_core/signal/source-signal.ts
var _currentSignalEffect = null;
var setCurrentEffect = (effect) => _currentSignalEffect = effect;
var signal = (initialValue, nonNullableInitialValue) => {
  let _value = immut(initialValue);
  const _effects = new Set;
  const runEffects = () => {
    _effects.forEach((effect) => {
      if (effect.canDisposeNow) {
        _effects.delete(effect);
        return;
      }
      effect();
    });
  };
  const setValueAndRunEffects = (newValue) => {
    _value = newValue;
    runEffects();
  };
  const baseSourceSignal = {
    type: "source-signal",
    get value() {
      if (_currentSignalEffect)
        _effects.add(_currentSignalEffect);
      return newVal(_value);
    },
    set value(newValue) {
      if (newValue === _value)
        return;
      setValueAndRunEffects(immut(newValue));
    }
  };
  const nonNullableInitial = nonNullableInitialValue === undefined ? initialValue : nonNullableInitialValue;
  const result = Array.isArray(nonNullableInitial) ? Object.assign(baseSourceSignal, getArraySourceSignalMethodsObject((mutatorMethod) => setValueAndRunEffects(mutatorMethod(_value)), baseSourceSignal)) : isPlainObject(nonNullableInitial) ? Object.assign(baseSourceSignal, getObjectSourceSignalMethodsObject((mutatorMethod) => setValueAndRunEffects(mutatorMethod(_value)), baseSourceSignal)) : typeof nonNullableInitial === "string" ? Object.assign(baseSourceSignal, getStringSignalMethodsObject(baseSourceSignal)) : typeof nonNullableInitial === "number" ? Object.assign(baseSourceSignal, getNumberSignalMethodsObject(baseSourceSignal)) : typeof nonNullableInitial === "boolean" ? Object.assign(baseSourceSignal, getBooleanSignalMethodsObject((mutatorMethod) => setValueAndRunEffects(mutatorMethod(_value)), baseSourceSignal)) : baseSourceSignal;
  return result;
};
// ../node_modules/.bun/@cyftec+signal@0.2.3/node_modules/@cyftec/signal/src/_core/effect.ts
var effect = (fn) => {
  const signalsEffect = fn;
  signalsEffect.canDisposeNow = false;
  signalsEffect.dispose = () => {
    signalsEffect.canDisposeNow = true;
  };
  setCurrentEffect(signalsEffect);
  fn();
  setCurrentEffect(null);
  return signalsEffect;
};

// ../node_modules/.bun/@cyftec+signal@0.2.3/node_modules/@cyftec/signal/src/_core/derive.ts
var derive = (valueGetterFn) => {
  let oldValue;
  let currValue;
  const derivedSource = signal(oldValue);
  const derivedSourceUpdator = effect(() => {
    oldValue = currValue;
    currValue = valueGetterFn(oldValue);
    derivedSource.value = currValue;
  });
  const baseDerivedSignal = {
    type: "derived-signal",
    get prevValue() {
      return oldValue;
    },
    get value() {
      return derivedSource.value;
    },
    dispose() {
      derivedSourceUpdator.dispose();
    }
  };
  if (Array.isArray(derivedSource.value)) {
    return Object.assign(baseDerivedSignal, getArraySignalNonMutatingMethodsObject(baseDerivedSignal));
  }
  if (isPlainObject(derivedSource.value)) {
    return Object.assign(baseDerivedSignal, getObjectSignalNonMutatingMethodsObject(baseDerivedSignal));
  }
  if (typeof derivedSource.value === "string") {
    return Object.assign(baseDerivedSignal, getStringSignalMethodsObject(baseDerivedSignal));
  }
  if (typeof derivedSource.value === "number") {
    return Object.assign(baseDerivedSignal, getNumberSignalMethodsObject(baseDerivedSignal));
  }
  if (typeof derivedSource.value === "boolean") {
    return Object.assign(baseDerivedSignal, getBooleanSignalNonMutatingMethodsObject(baseDerivedSignal));
  }
  return baseDerivedSignal;
};
// ../node_modules/.bun/@cyftec+signal@0.2.3/node_modules/@cyftec/signal/src/_core/utils/type-checkers.ts
var valueIsSignal = (input) => ["source-signal", "derived-signal"].includes(input?.type);
var valueIsNonSignalObject = (input, shouldMatchAnyOfTypes) => input?.type === "non-signal" && (!shouldMatchAnyOfTypes || !shouldMatchAnyOfTypes.length || shouldMatchAnyOfTypes.some((type) => typeof input?.value === type));
var valueIsSignalifiedObject = (input) => valueIsSignal(input) || valueIsNonSignalObject(input);

// ../node_modules/.bun/@cyftec+signal@0.2.3/node_modules/@cyftec/signal/src/_core/utils/value-getter.ts
var value = (input) => valueIsSignalifiedObject(input) ? input.value : input;
// ../node_modules/.bun/@cyftec+signal@0.2.3/node_modules/@cyftec/signal/src/api/tmpl.ts
var tmpl = (strings, ...tlExpressions) => derive(() => {
  return strings.reduce((acc, fragment, i) => {
    let expValue;
    const expression = tlExpressions[i];
    if (typeof expression === "function") {
      expValue = expression() ?? "";
    } else if (valueIsSignalifiedObject(expression)) {
      expValue = expression.value ?? "";
    } else {
      expValue = expression ?? "";
    }
    return `${acc}${fragment}${expValue.toString()}`;
  }, "");
});
// ../maya/utils/type-checkers.ts
var valueIsArray = (value2) => Array.isArray(value2);
var valueIsMHtmlElement = (value2) => !isNaN(value2?.elementId) && value2?.elementId > 0;
var validChild = (value2) => value2 === undefined || typeof value2 === "string" || typeof value2 === "function" && value2.isElementGetter;
var validChildren = (value2) => valueIsArray(value2) && value2.every((item) => validChild(item));
var validChildOrChildren = (value2) => validChild(value2) || validChildren(value2);
var validNonSignalChild = (value2) => valueIsNonSignalObject(value2) && validChild(value2.value);
var validSignalChild = (value2) => valueIsSignal(value2) && validChild(value2.value);
var validNonSignalChildOrChildren = (value2) => valueIsNonSignalObject(value2) && validChildOrChildren(value2.value);
var validSignalChildOrChildren = (value2) => valueIsSignal(value2) && validChildOrChildren(value2.value);
var validPlainChildren = (value2) => valueIsArray(value2) && value2.every((item) => validChild(item) || validNonSignalChild(item) || validSignalChild(item));
var validPlainChildOrChildren = (value2) => !valueIsSignal(value2) && (validChild(value2) || validNonSignalChildOrChildren(value2) || validPlainChildren(value2));
var validChildrenProp = (value2) => validPlainChildOrChildren(value2) || validSignalChildOrChildren(value2);
// ../maya/core/dom/unmount-observer.ts
var _observingDocument = false;
var addedNodesRecord = {};
var removedNodesRecord = {};
var MutationObserver = globalThis.MutationObserver;
var unmountObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (valueIsMHtmlElement(node)) {
          const element = node;
          const elementId = element.elementId;
          if (removedNodesRecord[elementId])
            delete removedNodesRecord[elementId];
          else
            addedNodesRecord[elementId] = element.tagName;
        }
      });
      mutation.removedNodes.forEach((node) => {
        if (valueIsMHtmlElement(node)) {
          const element = node;
          const elementId = element.elementId;
          const unmountListener = element.unmountListener;
          if (unmountListener)
            removedNodesRecord[elementId] = {
              element,
              unmountListener
            };
        }
      });
    }
  });
  Object.entries(removedNodesRecord).forEach(([_, listenerData]) => {
    const { element, unmountListener } = listenerData;
    execSubtreeUnmountListeners(element, unmountListener);
  });
});
var execSubtreeUnmountListeners = (element, elUnmountListener) => {
  if (!valueIsMHtmlElement(element))
    return;
  const elChildren = element.children;
  for (let i = 0;i < elChildren.length; i++) {
    const elChild = elChildren[i];
    execSubtreeUnmountListeners(elChild, elChild.unmountListener);
  }
  elUnmountListener && elUnmountListener(element);
  if (removedNodesRecord[element.elementId])
    delete removedNodesRecord[element.elementId];
};
var startUnmountObserver = () => {
  if (!_observingDocument && !phase.currentIs("build")) {
    unmountObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    _observingDocument = true;
  }
};

// ../maya/core/dom/create-element.ts
var attributeIsUndefinedEvent = (propKey, propValue) => eventKeys.includes(propKey) && propValue === undefined;
var attributeIsHtmlEvent = (propKey, propValue) => htmlEventKeys.includes(propKey) && typeof propValue === "function";
var attributeIsCustomEvent = (propKey, propValue) => customEventKeys.includes(propKey) && typeof propValue === "function";
var attributeIsEvent = (propKey, propValue) => attributeIsUndefinedEvent(propKey, propValue) || attributeIsHtmlEvent(propKey, propValue) || attributeIsCustomEvent(propKey, propValue);
var handleEventProps = (mHtmlElem, eventProps) => {
  Object.entries(eventProps).forEach(([eventName, listenerFn]) => {
    if (attributeIsUndefinedEvent(eventName, listenerFn)) {} else if (attributeIsHtmlEvent(eventName, listenerFn)) {
      const eventKey = eventName.slice(2);
      mHtmlElem.addEventListener(eventKey, (e) => {
        if (eventKey === "keypress") {
          e.preventDefault();
        }
        listenerFn(e);
      });
    } else if (attributeIsCustomEvent(eventName, listenerFn)) {
      if (eventName === "onmount" && !phase.currentIs("build")) {
        const onMount = listenerFn;
        setTimeout(() => onMount(mHtmlElem), 0);
      }
      if (eventName === "onunmount") {
        startUnmountObserver();
        const topLevelUnmountListener = mHtmlElem.unmountListener;
        mHtmlElem.unmountListener = (currentElement) => {
          listenerFn(currentElement);
          if (typeof topLevelUnmountListener === "function")
            topLevelUnmountListener(currentElement);
        };
      }
    } else {
      console.error(`Invalid event key: ${eventName} for element with tagName: ${mHtmlElem.tagName}`);
    }
  });
};
var setAttribute = (mHtmlElement, attrKey, attributePropValue) => {
  const unsafeAttrValue = valueIsSignalifiedObject(attributePropValue) ? attributePropValue.value : attributePropValue;
  const attrValue = sanitizeAttributeValue(attrKey, unsafeAttrValue);
  if (typeof attrValue === "boolean") {
    if (attrValue)
      mHtmlElement.setAttribute(attrKey, "");
    else
      mHtmlElement.removeAttribute(attrKey);
  } else if (attrKey === "value") {
    mHtmlElement.value = attrValue || "";
  } else {
    mHtmlElement.setAttribute(attrKey, attrValue || "");
  }
};
var handleAttributeProps = (mHtmlElem, attributeProps) => {
  const signalAttributeProps = {};
  Object.entries(attributeProps).forEach((attributeProp) => {
    const [attrKey, attrVal] = attributeProp;
    if (valueIsSignal(attrVal)) {
      signalAttributeProps[attrKey] = attrVal;
    }
    setAttribute(mHtmlElem, attrKey, attrVal);
  });
  const attributesUpdator = effect(() => {
    Object.entries(signalAttributeProps).forEach((signalAttributeProp) => {
      const [attrKey, attrVal] = signalAttributeProp;
      const signalAttrVal = attrVal.value;
      if (!phase.currentIs("run"))
        return;
      setAttribute(mHtmlElem, attrKey, signalAttrVal);
    });
  });
  mHtmlElem.effects.push(attributesUpdator);
};
var getElementFromChild = (child) => {
  if (!child || typeof child === "string") {
    return document.createTextNode(decodeHTMLEntities(child || ""));
  }
  if (validChild(child)) {
    const elem = child();
    if (!valueIsMHtmlElement(elem)) {
      throw new Error(`Invalid MHtml element getter child. Type: ${typeof child}`);
    }
    return elem;
  }
  throw new Error(`Invalid child. Type of child: ${typeof child}`);
};
var setChild = (parentNode, child, childPositionIndex) => {
  const prevChildNode = parentNode.childNodes[childPositionIndex];
  const newChildNode = getElementFromChild(child);
  if (prevChildNode && newChildNode) {
    parentNode.replaceChild(newChildNode, prevChildNode);
  } else if (newChildNode) {
    parentNode.appendChild(newChildNode);
  } else {
    console.error(`No child found for node with tagName: ${parentNode.tagName}`);
  }
};
var handleChildrenProp = (parentNode, children) => {
  if (!children)
    return;
  if (validSignalChildOrChildren(children)) {
    const signalChildrenUpdator = effect(() => {
      const signalChildOrChildrenValue = children.value;
      const childrenList2 = valueIsArray(signalChildOrChildrenValue) ? signalChildOrChildrenValue : [signalChildOrChildrenValue];
      childrenList2.forEach((child, index) => setChild(parentNode, child, index));
      const newChildrenCount = childrenList2.length;
      while (newChildrenCount < parentNode.childNodes.length) {
        const childNode = parentNode.childNodes[newChildrenCount];
        if (childNode)
          parentNode.removeChild(childNode);
      }
    });
    parentNode.effects.push(signalChildrenUpdator);
  }
  const childrenList = validChild(children) ? [children] : valueIsNonSignalObject(children) ? validChild(children.value) ? [children.value] : validChildren(children.value) ? children.value : [] : validPlainChildren(children) ? children.map((ch) => validSignalChild(ch) ? ch : validNonSignalChild(ch) ? ch.value : ch) : [];
  const signalChildren = [];
  childrenList.forEach((maybeSignalChild, index) => {
    if (validSignalChild(maybeSignalChild)) {
      signalChildren.push({
        index,
        signalChild: maybeSignalChild
      });
    }
    const childValue = value(maybeSignalChild);
    setChild(parentNode, childValue, index);
  });
  if (signalChildren.length) {
    signalChildren.forEach(({ index, signalChild }) => {
      const signalChildUpdator = effect(() => {
        const childValue = signalChild.value;
        if (!phase.currentIs("run"))
          return;
        setChild(parentNode, childValue, index);
      });
      parentNode.effects.push(signalChildUpdator);
    });
  }
};
var getNodesEventsAndAttributes = (props, tagName) => {
  let children = undefined;
  const eventProps = {};
  const attributeProps = {};
  Object.entries(props).forEach(([propKey, propValue]) => {
    if (propKey === "children") {
      if (validChildrenProp(propValue))
        children = propValue;
      else
        throw new Error(`Invalid children prop for node with tagName: ${tagName}

 ${JSON.stringify(propValue)}`);
    } else if (attributeIsEvent(propKey, propValue)) {
      eventProps[propKey] = propValue;
    } else {
      attributeProps[propKey] = propValue;
    }
  });
  return { children, eventProps, attributeProps };
};
var createElementGetter = (tagName, propsOrChildren) => {
  const elemGetter = () => {
    const elementId = idGen.getNewId();
    const mHtmlElem = phase.currentIs("mount") ? document.querySelector(`[data-elem-id="${elementId}"]`) : document.createElement(tagName);
    mHtmlElem.elementId = elementId;
    mHtmlElem.effects = [];
    mHtmlElem.unmountListener = () => {
      mHtmlElem.effects.forEach((eff) => eff.dispose());
    };
    const props = validChildrenProp(propsOrChildren) ? { children: propsOrChildren } : propsOrChildren;
    if (!phase.currentIs("run")) {
      props["data-elem-id"] = mHtmlElem.elementId.toString();
    }
    const allProps = getNodesEventsAndAttributes(props, mHtmlElem.tagName);
    handleEventProps(mHtmlElem, allProps.eventProps);
    handleAttributeProps(mHtmlElem, allProps.attributeProps);
    handleChildrenProp(mHtmlElem, allProps.children);
    if (!phase.currentIs("build")) {
      mHtmlElem.removeAttribute("data-elem-id");
    }
    return mHtmlElem;
  };
  elemGetter.isElementGetter = true;
  return elemGetter;
};
// ../maya/core/elements/custom-elements/for.ts
var getMappedChild = (item, i, mutableMap) => {
  const indexSignal = signal(i);
  const itemSignal = signal(item);
  const child = mutableMap(derive(() => itemSignal.value), derive(() => indexSignal.value));
  let mappedChild;
  let elem;
  let computedMHtmlElementGetterOnce = false;
  if (child?.isElementGetter) {
    mappedChild = () => {
      if (computedMHtmlElementGetterOnce && elem)
        return elem;
      elem = child();
      computedMHtmlElementGetterOnce = true;
      return elem;
    };
    mappedChild.isElementGetter = true;
  } else if (!child || typeof child === "string") {
    mappedChild = child || "";
  } else {
    throw `One of the child, ${child} passed in ForElement is invalid.`;
  }
  return { indexSignal, itemSignal, mappedChild };
};
var getChildrenAfterInjection = (children, n, nthChild) => {
  if (n !== undefined && n >= 0 && nthChild) {
    const injectingIndex = n > children.length ? children.length : n;
    children.splice(injectingIndex, 0, nthChild);
  }
  return children;
};
var forElement = ({
  subject,
  itemKey,
  map,
  n,
  nthChild
}) => {
  if (nthChild && n === undefined || n !== undefined && n > -1 && !nthChild) {
    throw new Error("Either both 'n' and 'nthChild' be passed or none of them.");
  }
  let injectableChild = nthChild;
  if (nthChild && typeof nthChild !== "string") {
    const element = nthChild();
    const injectable = () => element;
    injectable.isElementGetter = true;
    injectableChild = injectable;
  }
  if (!valueIsSignal(subject)) {
    return getChildrenAfterInjection(value(subject).map(map), n, injectableChild);
  }
  const list = derive(() => {
    const items = value(subject);
    return Array.isArray(items) ? items : [];
  });
  if (!itemKey) {
    return derive(() => getChildrenAfterInjection(list.value.map(map), n, injectableChild));
  }
  const itemsValue = list.value;
  if (itemsValue.length && typeof itemsValue[0] !== "object")
    throw new Error("for mutable map, item in the list must be an object");
  let previousItems = null;
  const currentItems = derive((prevItems) => {
    previousItems = prevItems || previousItems;
    return list.value;
  });
  const mappedChildren = derive((prevMappedChildren) => {
    if (!prevMappedChildren || !previousItems) {
      const initialItems = currentItems.value;
      return initialItems.map((item, i) => getMappedChild(item, i, map));
    }
    const muts = getArrayMutations(previousItems, currentItems.value, itemKey);
    return muts.map((mut, i) => {
      const oldMappedChild = (prevMappedChildren || [])[mut.oldIndex];
      console.assert(mut.type === "add" && mut.oldIndex === -1 && !oldMappedChild || mut.oldIndex > -1 && !!oldMappedChild, "In case of mutation type 'add' oldIndex should be '-1', or else oldIndex should always be a non-negative integer.");
      if (oldMappedChild) {
        if (mut.type === "shuffle") {
          oldMappedChild.indexSignal.value = i;
        }
        if (mut.type === "update") {
          oldMappedChild.indexSignal.value = i;
          oldMappedChild.itemSignal.value = { ...mut.value };
        }
        return oldMappedChild;
      }
      return getMappedChild(mut.value, i, map);
    });
  });
  const mappedChildrenSignal = derive(() => getChildrenAfterInjection(mappedChildren.value.map((item) => item.mappedChild), n, injectableChild));
  return mappedChildrenSignal;
};
// ../maya/core/elements/custom-elements/if.ts
var ifElement = ({ subject, isTruthy, isFalsy }) => {
  const deadComponent = m.Span({ style: "display: none;" });
  const compGetter = () => value(subject) ? isTruthy ? isTruthy(subject) : deadComponent : isFalsy ? isFalsy(subject) : deadComponent;
  return valueIsSignal(subject) ? derive(compGetter) : compGetter();
};
// ../maya/core/elements/custom-elements/switch.ts
var switchElement = ({
  subject,
  caseMatcher,
  defaultCase,
  cases
}) => {
  const switchReturnGetter = () => {
    const subjectValue = value(subject);
    const casesValue = value(cases);
    let component = undefined;
    for (const [currentCaseKey, comp] of Object.entries(casesValue)) {
      const matchWithCaseMatcher = caseMatcher && caseMatcher(subjectValue, currentCaseKey);
      const normalCaseMatch = `${subjectValue}` === currentCaseKey;
      if (matchWithCaseMatcher || normalCaseMatch) {
        component = comp();
        break;
      }
    }
    return component || defaultCase && defaultCase() || m.Span({ style: "display: none;" });
  };
  return valueIsSignal(subject) ? derive(switchReturnGetter) : switchReturnGetter();
};
// ../maya/core/elements/m.ts
var mayaElementsMap = htmlTagNames.reduce((map, htmlTagName) => {
  const mayaTagName = htmlTagName.split("").map((char, index) => !index ? char.toUpperCase() : char).join("");
  const mHtmlComp = (propsOrChildren) => createElementGetter(htmlTagName, propsOrChildren);
  map[mayaTagName] = mHtmlComp;
  return map;
}, {});
var customElementsMap = {
  For: forElement,
  If: ifElement,
  Switch: switchElement
};
var m = {
  ...mayaElementsMap,
  ...customElementsMap
};
// dev/view/@site/data.ts
var code = (lines) => lines.join(`
`);
var rootNav = [
  { label: "Home", route: "", pageId: "home" },
  { label: "Docs", route: "docs/", pageId: "docs-what-is-maya" },
  { label: "Tutorial", route: "tutorial/", pageId: "tutorial-thinking-in-maya" },
  { label: "Blogs", route: "blogs/", pageId: "blogs" }
];
var docsNav = [
  {
    title: "Introduction & Setup",
    items: [
      { label: "What is Maya?", route: "docs/what-is-maya/", pageId: "docs-what-is-maya" },
      { label: "Getting Started", route: "docs/getting-started/", pageId: "docs-getting-started" },
      { label: "Project Lifecycle", route: "docs/project-lifecycle/", pageId: "docs-project-lifecycle" }
    ]
  },
  {
    title: "Core Architecture & Components",
    items: [
      { label: "Component Creation", route: "docs/component-creation/", pageId: "docs-component-creation" },
      { label: "Reactivity with Signals", route: "docs/reactivity-with-signals/", pageId: "docs-reactivity-with-signals" },
      { label: "Built-In Directives", route: "docs/built-in-directives/", pageId: "docs-built-in-directives" }
    ]
  },
  {
    title: "Compilation Targets",
    items: [
      { label: "Web Applications", route: "docs/web-applications/", pageId: "docs-web-applications" },
      { label: "Progressive Web Apps", route: "docs/pwa/", pageId: "docs-pwa" },
      { label: "Chrome Extensions", route: "docs/chrome-extensions/", pageId: "docs-chrome-extensions" }
    ]
  }
];
var tutorialNav = [
  {
    title: "Overview",
    items: [
      { label: "Thinking in Maya", route: "tutorial/thinking-in-maya/", pageId: "tutorial-thinking-in-maya" }
    ]
  },
  {
    title: "Project 1: Todo List",
    items: [
      { label: "Step 1: Task Input", route: "tutorial/todo-input/", pageId: "tutorial-todo-input" },
      { label: "Step 2: Array Signals", route: "tutorial/todo-array-signals/", pageId: "tutorial-todo-array-signals" },
      { label: "Step 3: Finished Tasks", route: "tutorial/todo-conditional-rendering/", pageId: "tutorial-todo-conditional-rendering" }
    ]
  },
  {
    title: "Project 2: Tic-Tac-Toe",
    items: [
      { label: "Step 4: Grid Mechanics", route: "tutorial/tic-tac-toe-grid/", pageId: "tutorial-tic-tac-toe-grid" },
      { label: "Step 5: Turn State", route: "tutorial/tic-tac-toe-turns/", pageId: "tutorial-tic-tac-toe-turns" },
      { label: "Step 6: Win Computations", route: "tutorial/tic-tac-toe-winner/", pageId: "tutorial-tic-tac-toe-winner" }
    ]
  }
];
var pages = {
  "docs-what-is-maya": {
    id: "docs-what-is-maya",
    route: "docs/what-is-maya/",
    section: "docs",
    eyebrow: "Introduction",
    title: "What is Maya?",
    description: "Maya is an MPA-first TypeScript UI framework that builds static pages and mounts direct DOM references for signal-driven updates.",
    badge: true,
    toc: [
      { id: "model", text: "The mental model", level: 2 },
      { id: "current-package", text: "Current package identity", level: 2 },
      { id: "first-page", text: "A complete page", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "model", text: "The mental model" },
      {
        kind: "p",
        text: "A Maya page is not JSX and not a virtual DOM render function. It is a TypeScript expression that builds real DOM nodes through capitalized factories such as m.Div, m.Button, and m.Script."
      },
      {
        kind: "p",
        text: "Brahma runs the page once during build to produce static HTML, then the generated script runs the same page in the browser to mount the existing nodes. After mount, signals mutate the exact text node, child slot, or attribute that depends on them."
      },
      {
        kind: "ul",
        items: [
          "MPA routing comes from folders and page.ts files.",
          "Components are plain TypeScript functions or component() wrappers.",
          "State is held in signals, derived signals, and signal helpers.",
          "The DOM remains directly available through events and onmount."
        ]
      },
      { kind: "h2", id: "current-package", text: "Current package identity" },
      {
        kind: "callout",
        title: "Repository audit",
        body: "The local code currently publishes as @cyftec/maya and @cyftec/brahma at 0.0.14. The @mufw scope in the product prompt is not present in package.json yet, so verified examples use @cyftec imports."
      },
      { kind: "h2", id: "first-page", text: "A complete page" },
      {
        kind: "code",
        code: code([
          'import { m } from "@cyftec/maya";',
          "",
          "export default m.Html({",
          '  lang: "en",',
          "  children: [",
          "    m.Head({",
          "      children: [",
          '        m.Title("Maya App"),',
          '        m.Meta({ charset: "UTF-8" }),',
          '        m.Meta({ name: "viewport", content: "width=device-width, initial-scale=1.0" }),',
          "      ],",
          "    }),",
          "    m.Body({",
          "      children: [",
          '        m.Script({ src: "main.js", defer: true }),',
          '        m.Main({ children: m.H1("Hello Maya") }),',
          "      ],",
          "    }),",
          "  ],",
          "});"
        ])
      }
    ]
  },
  "docs-getting-started": {
    id: "docs-getting-started",
    route: "docs/getting-started/",
    section: "docs",
    eyebrow: "Introduction & Setup",
    title: "Getting Started",
    description: "Create a Maya app with Brahma, install generated dependencies, and run the static development build.",
    badge: true,
    toc: [
      { id: "install", text: "Install Brahma", level: 2 },
      { id: "create", text: "Create a project", level: 2 },
      { id: "commands", text: "Daily commands", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "install", text: "Install Brahma" },
      {
        kind: "p",
        text: "The current CLI is Bun-first. The local help text supports npm-style global installation examples, but repository builds use Bun."
      },
      { kind: "code", code: code(["bun install -g @cyftec/brahma", "brahma version"]) },
      {
        kind: "callout",
        title: "If your package scope has moved",
        body: "Use npm i -g @mufw/brahma only after package metadata and registry publishing have moved from @cyftec to @mufw."
      },
      { kind: "h2", id: "create", text: "Create a project" },
      {
        kind: "code",
        code: code([
          "brahma create my-app",
          "cd my-app",
          "brahma install",
          "brahma stage"
        ])
      },
      { kind: "h2", id: "commands", text: "Daily commands" },
      {
        kind: "ul",
        items: [
          "brahma stage builds to the configured staging directory, watches source files, and starts a local server.",
          "brahma publish builds production output and minifies page JavaScript.",
          "brahma reset restores karma.ts from the scaffold template.",
          "brahma install <package> adds a dependency and syncs karma.maya."
        ]
      }
    ]
  },
  "docs-project-lifecycle": {
    id: "docs-project-lifecycle",
    route: "docs/project-lifecycle/",
    section: "docs",
    eyebrow: "Introduction & Setup",
    title: "Project Lifecycle",
    description: "Understand karma.ts, source folders, ignored component folders, staging output, and production output.",
    badge: true,
    toc: [
      { id: "karma", text: "karma.ts is the app contract", level: 2 },
      { id: "layout", text: "Directory layout", level: 2 },
      { id: "route-output", text: "Route output", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "karma", text: "karma.ts is the app contract" },
      {
        kind: "p",
        text: "Brahma reads a single named export, karma. It contains build filenames, output folders, serve settings, app metadata, generated ignore rules, and dependency declarations."
      },
      {
        kind: "code",
        code: code([
          "export const karma = {",
          "  brahma: {",
          "    build: {",
          '      appSrcDir: "dev",',
          '      appViewDir: "dev/view",',
          '      buildablePageFileName: "page.ts",',
          '      buildableManifestFileName: "manifest.ts",',
          '      ignoreDelimiter: "@",',
          '      publishDir: "prod",',
          "    },",
          "  },",
          '  maya: { name: "my-app", appType: "web", dependencies: {} },',
          "};"
        ])
      },
      { kind: "h2", id: "layout", text: "Directory layout" },
      {
        kind: "code",
        code: code([
          "dev/",
          "  view/",
          "    page.ts",
          "    docs/page.ts",
          "    docs/signals/page.ts",
          "    @site/layout.ts",
          "    assets/styles.css",
          "karma.ts",
          "package.json"
        ])
      },
      { kind: "h2", id: "route-output", text: "Route output" },
      {
        kind: "ul",
        items: [
          "page.ts builds to index.html and main.js in the same output folder.",
          "contact.page.ts builds to contact.html and contact.main.js.",
          "manifest.ts at the app view root is imported and written as manifest.json.",
          "Other .ts files are compiled to .js; other assets are copied."
        ]
      }
    ]
  },
  "docs-component-creation": {
    id: "docs-component-creation",
    route: "docs/component-creation/",
    section: "docs",
    eyebrow: "Core Architecture & Components",
    title: "Component Creation",
    description: "Create reusable UI with pure TypeScript functions, component(), and raw DOM access through events and onmount.",
    badge: true,
    toc: [
      { id: "factories", text: "Element factories", level: 2 },
      { id: "component-wrapper", text: "component()", level: 2 },
      { id: "dom-access", text: "Raw DOM access", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "factories", text: "Element factories" },
      {
        kind: "p",
        text: "Every HTML tag listed by Maya is available as a capitalized function on m. The function accepts children or a props object and returns an element getter."
      },
      {
        kind: "code",
        code: code([
          "const toolbar = m.Nav({",
          '  class: "toolbar",',
          "  children: [",
          '    m.A({ href: "docs/", children: "Docs" }),',
          '    m.Button({ onclick: save, children: "Save" }),',
          "  ],",
          "});"
        ])
      },
      { kind: "h2", id: "component-wrapper", text: "component()" },
      {
        kind: "code",
        code: code([
          'import { component, m } from "@cyftec/maya";',
          "",
          "type PillProps = { label: string; selected: boolean; onTap: () => void };",
          "",
          "export const Pill = component<PillProps>(({ label, selected, onTap }) =>",
          "  m.Button({",
          '    class: selected.value ? "pill selected" : "pill",',
          "    onclick: onTap,",
          "    children: label.value,",
          "  }),",
          ");"
        ])
      },
      { kind: "h2", id: "dom-access", text: "Raw DOM access" },
      {
        kind: "p",
        text: "Use onmount when code requires a real browser node. The callback receives the mounted Maya element after the static node has been connected to runtime state."
      },
      {
        kind: "code",
        code: code([
          "m.Div({",
          '  children: "",',
          "  onmount: (element) => {",
          "    element.textContent = `Rendered at ${new Date().toLocaleTimeString()}`;",
          "  },",
          "});"
        ])
      }
    ]
  },
  "docs-reactivity-with-signals": {
    id: "docs-reactivity-with-signals",
    route: "docs/reactivity-with-signals/",
    section: "docs",
    eyebrow: "Core Architecture & Components",
    title: "Reactivity with Signals",
    description: "Use source signals, derived signals, template strings, and keyed list updates for surgical DOM mutation.",
    badge: true,
    toc: [
      { id: "source", text: "Source signals", level: 2 },
      { id: "derived", text: "Derived values", level: 2 },
      { id: "dom", text: "DOM update boundaries", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "source", text: "Source signals" },
      {
        kind: "code",
        code: code([
          'import { signal, tmpl } from "@cyftec/maya/signal";',
          "",
          "const count = signal(0);",
          "",
          "m.Button({",
          "  onclick: () => (count.value = count.value + 1),",
          "  children: tmpl`Clicked ${count} times`,",
          "});"
        ])
      },
      { kind: "h2", id: "derived", text: "Derived values" },
      {
        kind: "p",
        text: "derive() tracks signals whose .value is read during the callback. The return value is a read-only signal that can be used as text, attributes, or child selectors."
      },
      {
        kind: "code",
        code: code([
          'const first = signal("Ada");',
          'const last = signal("Lovelace");',
          "const fullName = derive(() => `${first.value} ${last.value}`);",
          "",
          "m.P({ children: fullName });"
        ])
      },
      { kind: "h2", id: "dom", text: "DOM update boundaries" },
      {
        kind: "p",
        text: "Attribute signals are watched by the element that owns the attribute. Child signals are watched by the parent and replace only the affected child position. There is no full parent re-render."
      }
    ]
  },
  "docs-built-in-directives": {
    id: "docs-built-in-directives",
    route: "docs/built-in-directives/",
    section: "docs",
    eyebrow: "Core Architecture & Components",
    title: "Built-In Directives",
    description: "Use m.If, m.For, and m.Switch for conditions, loops, keyed node preservation, and state-based branch selection.",
    badge: true,
    toc: [
      { id: "if", text: "m.If", level: 2 },
      { id: "for", text: "m.For", level: 2 },
      { id: "switch", text: "m.Switch", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "if", text: "m.If" },
      {
        kind: "code",
        code: code([
          "m.If({",
          "  subject: isLoggedIn,",
          '  isTruthy: () => m.P("Welcome back"),',
          '  isFalsy: () => m.P("Please sign in"),',
          "});"
        ])
      },
      { kind: "h2", id: "for", text: "m.For" },
      {
        kind: "code",
        code: code([
          "m.For({",
          "  subject: tasks,",
          '  itemKey: "id",',
          "  map: (task, index) =>",
          "    m.Li({",
          '      children: [tmpl`${() => index.value + 1}. `, task.prop("text")],',
          "    }),",
          "});"
        ])
      },
      {
        kind: "callout",
        title: "Keyed mapping",
        body: "With itemKey, m.For keeps existing mapped nodes for matching keys and updates item/index signals. Without itemKey, array changes recreate mapped children."
      },
      { kind: "h2", id: "switch", text: "m.Switch" },
      {
        kind: "code",
        code: code([
          "m.Switch({",
          "  subject: view,",
          "  cases: {",
          '    list: () => m.Section("List"),',
          '    detail: () => m.Section("Detail"),',
          "  },",
          '  defaultCase: () => m.Section("Unknown view"),',
          "});"
        ])
      }
    ]
  },
  "docs-web-applications": {
    id: "docs-web-applications",
    route: "docs/web-applications/",
    section: "docs",
    eyebrow: "Compilation Targets",
    title: "Web Applications",
    description: "Build a static multi-page website or application with folder routes and page-local runtime bundles.",
    badge: true,
    toc: [
      { id: "web-mode", text: "Web mode", level: 2 },
      { id: "assets", text: "Assets and links", level: 2 },
      { id: "publish", text: "Publishing", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "web-mode", text: "Web mode" },
      {
        kind: "p",
        text: "The default scaffold is appType web. It builds every page.ts under appViewDir into static HTML and a small page-local JavaScript file."
      },
      { kind: "h2", id: "assets", text: "Assets and links" },
      {
        kind: "p",
        text: "For GitHub Pages project sites, prefer relative links such as ../assets/styles.css from nested pages. Absolute /assets links assume domain-root hosting."
      },
      { kind: "h2", id: "publish", text: "Publishing" },
      {
        kind: "code",
        code: code([
          "// In karma.ts",
          'publishDir: "../doc"',
          "",
          "// Then build",
          "brahma publish"
        ])
      }
    ]
  },
  "docs-pwa": {
    id: "docs-pwa",
    route: "docs/pwa/",
    section: "docs",
    eyebrow: "Compilation Targets",
    title: "Progressive Web Apps",
    description: "Use the PWA scaffold for typed manifest configuration, service worker registration, and static deployment.",
    badge: true,
    toc: [
      { id: "manifest", text: "Typed manifest", level: 2 },
      { id: "service-worker", text: "Service worker", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "manifest", text: "Typed manifest" },
      {
        kind: "code",
        code: code([
          'import type { WebAppManifest } from "web-app-manifest";',
          "",
          "const manifest: WebAppManifest = {",
          '  name: "Maya PWA",',
          '  short_name: "Maya",',
          '  start_url: ".",',
          '  display: "standalone",',
          '  theme_color: "#000000",',
          '  background_color: "#ffffff",',
          "};",
          "",
          "export default manifest;"
        ])
      },
      { kind: "h2", id: "service-worker", text: "Service worker" },
      {
        kind: "p",
        text: "The scaffold registers sw.js from app.js. The sample service worker is intentionally minimal, so production cache routes, update behavior, and offline fallbacks must be written by the app."
      }
    ]
  },
  "docs-chrome-extensions": {
    id: "docs-chrome-extensions",
    route: "docs/chrome-extensions/",
    section: "docs",
    eyebrow: "Compilation Targets",
    title: "Chrome Extensions",
    description: "Target Manifest V3 with a typed manifest, popup page, background service worker, and content scripts.",
    badge: true,
    toc: [
      { id: "extension-mode", text: "Extension mode", level: 2 },
      { id: "manifest-v3", text: "Manifest V3", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "extension-mode", text: "Extension mode" },
      {
        kind: "code",
        code: code(["brahma create attention-extension --ext", "cd attention-extension", "brahma install", "brahma publish"])
      },
      { kind: "h2", id: "manifest-v3", text: "Manifest V3" },
      {
        kind: "code",
        code: code([
          "const manifest: chrome.runtime.ManifestV3 = {",
          '  name: "Maya Extension",',
          '  version: "0.0.1",',
          "  manifest_version: 3,",
          '  permissions: ["tabs"],',
          '  background: { service_worker: "sw.js" },',
          '  action: { default_popup: "popup.html" },',
          "};",
          "",
          "export default manifest;"
        ])
      }
    ]
  },
  "tutorial-thinking-in-maya": {
    id: "tutorial-thinking-in-maya",
    route: "tutorial/thinking-in-maya/",
    section: "tutorial",
    eyebrow: "Overview",
    title: "Thinking in Maya",
    description: "Build interfaces by identifying which DOM node or attribute should change when a signal mutates.",
    badge: true,
    toc: [
      { id: "mutation", text: "Mutation instead of diffing", level: 2 },
      { id: "shape", text: "Shape state around DOM ownership", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "mutation", text: "Mutation instead of diffing" },
      {
        kind: "p",
        text: "In a virtual DOM system you often ask what component should render again. In Maya, ask which child position, text node, or attribute depends on this signal."
      },
      {
        kind: "code",
        code: code([
          'const selected = signal("inbox");',
          "",
          "m.A({",
          '  class: tmpl`nav-link ${() => (selected.value === "inbox" ? "active" : "")}`',
          '  children: "Inbox",',
          "});"
        ])
      },
      { kind: "h2", id: "shape", text: "Shape state around DOM ownership" },
      {
        kind: "p",
        text: "Small signals work well. Keep form fields, selected IDs, current filters, and derived display strings close to the page or component that owns the DOM they update."
      }
    ]
  },
  "tutorial-todo-input": {
    id: "tutorial-todo-input",
    route: "tutorial/todo-input/",
    section: "tutorial",
    eyebrow: "Project 1: Todo List",
    title: "Step 1: Scaffolding the Task Input",
    description: "Create a controlled input and submit action using native form events and a text signal.",
    badge: true,
    toc: [
      { id: "state", text: "Input state", level: 2 },
      { id: "form", text: "Form wiring", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "state", text: "Input state" },
      {
        kind: "p",
        text: "Start with one source signal for the draft text. The input writes to it through oninput; the preview reads it through tmpl."
      },
      { kind: "h2", id: "form", text: "Form wiring" },
      {
        kind: "code",
        code: code([
          'const draft = signal("");',
          "",
          "m.Form({",
          "  onsubmit: (event) => {",
          "    event.preventDefault();",
          "    if (!draft.value.trim()) return;",
          '    console.log("create task", draft.value.trim());',
          '    draft.value = "";',
          "  },",
          "  children: [",
          "    m.Input({",
          "      value: draft,",
          '      placeholder: "Write a task",',
          "      oninput: (event) => {",
          "        draft.value = (event.target as HTMLInputElement).value;",
          "      },",
          "    }),",
          '    m.Button({ type: "submit", children: "Add" }),',
          "  ],",
          "});"
        ])
      }
    ]
  },
  "tutorial-todo-array-signals": {
    id: "tutorial-todo-array-signals",
    route: "tutorial/todo-array-signals/",
    section: "tutorial",
    eyebrow: "Project 1: Todo List",
    title: "Step 2: Managing List State with Array Signals",
    description: "Store tasks in an array signal and render them with keyed m.For so rows stay stable across updates.",
    badge: true,
    toc: [
      { id: "task-type", text: "Task type", level: 2 },
      { id: "keyed-list", text: "Keyed list rendering", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "task-type", text: "Task type" },
      {
        kind: "code",
        code: code([
          "type Task = { id: number; text: string; done: boolean };",
          "const tasks = signal<Task[]>([]);",
          "",
          "const addTask = (text: string) => {",
          "  tasks.push({ id: Date.now(), text, done: false });",
          "};"
        ])
      },
      { kind: "h2", id: "keyed-list", text: "Keyed list rendering" },
      {
        kind: "code",
        code: code([
          "m.Ul({",
          "  children: m.For({",
          "    subject: tasks,",
          '    itemKey: "id",',
          "    map: (task) =>",
          "      m.Li({",
          '        children: task.prop("text"),',
          "      }),",
          "  }),",
          "});"
        ])
      }
    ]
  },
  "tutorial-todo-conditional-rendering": {
    id: "tutorial-todo-conditional-rendering",
    route: "tutorial/todo-conditional-rendering/",
    section: "tutorial",
    eyebrow: "Project 1: Todo List",
    title: "Step 3: Conditional Rendering of Finished Tasks",
    description: "Combine m.For and m.If to toggle individual tasks while keeping rows bound to stable task IDs.",
    badge: true,
    toc: [
      { id: "toggle", text: "Toggle done", level: 2 },
      { id: "empty", text: "Empty states", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "toggle", text: "Toggle done" },
      {
        kind: "code",
        code: code([
          "m.For({",
          "  subject: tasks,",
          '  itemKey: "id",',
          "  map: (task) =>",
          "    m.Li({",
          '      class: tmpl`${() => (task.value.done ? "task done" : "task")}`,',
          "      children: [",
          "        m.Input({",
          '          type: "checkbox",',
          "          checked: derive(() => task.value.done),",
          "          onchange: () => task.set({ done: !task.value.done }),",
          "        }),",
          '        task.prop("text"),',
          "      ],",
          "    }),",
          "});"
        ])
      },
      { kind: "h2", id: "empty", text: "Empty states" },
      {
        kind: "code",
        code: code([
          "m.If({",
          "  subject: tasks.length(),",
          "  isTruthy: () => m.Ul({ children: taskRows }),",
          '  isFalsy: () => m.P("No tasks yet"),',
          "});"
        ])
      }
    ]
  },
  "tutorial-tic-tac-toe-grid": {
    id: "tutorial-tic-tac-toe-grid",
    route: "tutorial/tic-tac-toe-grid/",
    section: "tutorial",
    eyebrow: "Project 2: Tic-Tac-Toe",
    title: "Step 4: Grid Layout Mechanics & Component Reusability",
    description: "Represent the board as nine cells and extract a reusable square component.",
    badge: true,
    toc: [
      { id: "board", text: "Board signal", level: 2 },
      { id: "square", text: "Square component", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "board", text: "Board signal" },
      {
        kind: "code",
        code: code([
          'type Mark = "X" | "O" | "";',
          'const board = signal<Mark[]>(Array(9).fill(""));'
        ])
      },
      { kind: "h2", id: "square", text: "Square component" },
      {
        kind: "code",
        code: code([
          "const Square = component<{ mark: Mark; onTap: () => void }>(({ mark, onTap }) =>",
          "  m.Button({",
          '    class: "square",',
          "    onclick: onTap,",
          '    children: mark.value || " ",',
          "  }),",
          ");"
        ])
      }
    ]
  },
  "tutorial-tic-tac-toe-turns": {
    id: "tutorial-tic-tac-toe-turns",
    route: "tutorial/tic-tac-toe-turns/",
    section: "tutorial",
    eyebrow: "Project 2: Tic-Tac-Toe",
    title: "Step 5: Turn-Based State & Move Tracing",
    description: "Track the active mark, write immutable board moves, and record move history.",
    badge: true,
    toc: [
      { id: "turn", text: "Turn state", level: 2 },
      { id: "history", text: "Move tracing", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "turn", text: "Turn state" },
      {
        kind: "code",
        code: code([
          'const active = signal<"X" | "O">("X");',
          "const history = signal<number[]>([]);",
          "",
          "const play = (index: number) => {",
          "  if (board.value[index]) return;",
          "  const next = board.value;",
          "  next[index] = active.value;",
          "  board.value = next;",
          "  history.push(index);",
          '  active.value = active.value === "X" ? "O" : "X";',
          "};"
        ])
      },
      { kind: "h2", id: "history", text: "Move tracing" },
      {
        kind: "p",
        text: "Because array signal reads return a fresh value, copy the board into a local variable, update it, and assign it back. Use history.push for append-only move tracing."
      }
    ]
  },
  "tutorial-tic-tac-toe-winner": {
    id: "tutorial-tic-tac-toe-winner",
    route: "tutorial/tic-tac-toe-winner/",
    section: "tutorial",
    eyebrow: "Project 2: Tic-Tac-Toe",
    title: "Step 6: Win Condition Computations & Game Reset",
    description: "Compute a winner from the board signal and reset all game signals from one command.",
    badge: true,
    toc: [
      { id: "winner", text: "Winner computation", level: 2 },
      { id: "reset", text: "Game reset", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "winner", text: "Winner computation" },
      {
        kind: "code",
        code: code([
          "const wins = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];",
          "",
          "const winner = derive(() => {",
          "  const cells = board.value;",
          "  const line = wins.find(([a, b, c]) => cells[a] && cells[a] === cells[b] && cells[a] === cells[c]);",
          '  return line ? cells[line[0]] : "";',
          "});"
        ])
      },
      { kind: "h2", id: "reset", text: "Game reset" },
      {
        kind: "code",
        code: code([
          "const reset = () => {",
          '  board.value = Array(9).fill("");',
          "  history.value = [];",
          '  active.value = "X";',
          "};"
        ])
      }
    ]
  },
  blogs: {
    id: "blogs",
    route: "blogs/",
    section: "blogs",
    eyebrow: "Framework Updates",
    title: "Blogs & Engineering Logs",
    description: "Release notes, implementation notes, and changelog entries for the evolving Maya and Brahma codebase.",
    toc: [
      { id: "release-line", text: "v0.1.x release line", level: 2 },
      { id: "audit", text: "Repository audit log", level: 2 },
      { id: "next", text: "Next documentation tasks", level: 2 }
    ],
    blocks: [
      { kind: "h2", id: "release-line", text: "v0.1.x release line" },
      {
        kind: "p",
        text: "The prompt targets a v0.1.x public release line, while the local packages still report 0.0.14. Treat v0.1.x posts here as planned release content until package metadata is updated."
      },
      { kind: "h2", id: "audit", text: "Repository audit log" },
      {
        kind: "ul",
        items: [
          "Core runtime exports m factories, component(), and type definitions.",
          "Signals are re-exported through @cyftec/maya/signal.",
          "Brahma generates static HTML, page-local JavaScript, manifest.json, and production bundles.",
          "PWA and extension modes are scaffolded, with real service-worker caching left to the app."
        ]
      },
      { kind: "h2", id: "next", text: "Next documentation tasks" },
      {
        kind: "ol",
        items: [
          "Align package metadata with the intended public scope.",
          "Add tested PWA cache recipes after service-worker strategy is implemented.",
          "Add API reference pages generated from TypeScript signatures."
        ]
      }
    ]
  }
};
var landingPillars = [
  {
    title: "MPA first",
    text: "Folder routes build to independent HTML files, so navigation and deployment stay close to the platform."
  },
  {
    title: "Signal precision",
    text: "Source and derived signals update the exact DOM ownership boundary that reads them."
  },
  {
    title: "TypeScript templates",
    text: "Templates are native TypeScript values built from m.* factories instead of JSX or string HTML."
  },
  {
    title: "Static targets",
    text: "Web, PWA, and Chrome extension scaffolds share the same Brahma build pipeline."
  }
];

// dev/view/@site/pages.ts
var prefixFor = (depth) => "../".repeat(depth);
var hrefFor = (prefix, route) => route ? `${prefix}${route}` : prefix || "./";
var sectionLabel = {
  home: "Maya",
  docs: "Documentation",
  tutorial: "Tutorial",
  blogs: "Blogs"
};
var TopNav = (currentSection, currentPageId, prefix) => m.Header({
  class: "topbar",
  children: [
    m.A({
      class: "brand",
      href: hrefFor(prefix, ""),
      children: [
        m.Span({ class: "brand-mark", children: "M" }),
        m.Span({ class: "brand-text", children: "Maya UI" })
      ]
    }),
    m.Nav({
      class: "topnav",
      children: rootNav.map((item) => m.A({
        class: item.pageId === currentPageId || item.pageId !== "home" && item.pageId.startsWith(currentSection) ? "topnav-link is-active" : "topnav-link",
        href: hrefFor(prefix, item.route),
        children: item.label
      }))
    })
  ]
});
var SidebarLink = (item, currentPageId, prefix) => m.A({
  class: item.pageId === currentPageId ? "sidebar-link is-active" : "sidebar-link",
  href: hrefFor(prefix, item.route),
  children: item.label
});
var Sidebar = (groups, currentPageId, prefix) => m.Aside({
  class: "sidebar",
  children: [
    m.Div({ class: "sidebar-kicker", children: "Navigate" }),
    ...groups.map((group) => m.Section({
      class: "sidebar-group",
      children: [
        m.H3({ class: "sidebar-title", children: group.title }),
        m.Nav({
          class: "sidebar-nav",
          children: group.items.map((item) => SidebarLink(item, currentPageId, prefix))
        })
      ]
    }))
  ]
});
var Toc = (page) => m.Aside({
  class: "toc",
  children: [
    m.Div({ class: "toc-title", children: "On this page" }),
    m.Nav({
      class: "toc-nav",
      children: page.toc.map((item) => m.A({
        class: item.level === 3 ? "toc-link nested" : "toc-link",
        href: `#${item.id}`,
        children: item.text
      }))
    })
  ]
});
var UnverifiedBadge = () => m.Div({
  class: "spec-badge",
  children: "[⚠️ UNVERIFIED SPECS - DUMMY CONTENT]"
});
var CodeBlock = (code2) => m.Pre({
  class: "code-block",
  children: m.Code({ children: code2 })
});
var renderBlock = (block) => {
  if (block.kind === "p") {
    return m.P({ class: "doc-p", children: block.text });
  }
  if (block.kind === "h2") {
    return m.H2({ id: block.id, class: "doc-h2", children: block.text });
  }
  if (block.kind === "h3") {
    return m.H3({ id: block.id, class: "doc-h3", children: block.text });
  }
  if (block.kind === "ul") {
    return m.Ul({
      class: "doc-list",
      children: block.items.map((item) => m.Li(item))
    });
  }
  if (block.kind === "ol") {
    return m.Ol({
      class: "doc-list ordered",
      children: block.items.map((item) => m.Li(item))
    });
  }
  if (block.kind === "code") {
    return CodeBlock(block.code);
  }
  return m.Div({
    class: "callout",
    children: [
      m.Strong({ children: block.title }),
      m.P({ children: block.body })
    ]
  });
};
var ContentArticle = (page) => m.Article({
  class: "content",
  children: [
    page.badge ? UnverifiedBadge() : undefined,
    m.Div({ class: "eyebrow", children: page.eyebrow }),
    m.H1({ class: "page-title", children: page.title }),
    m.P({ class: "page-description", children: page.description }),
    m.Div({
      class: "doc-body",
      children: page.blocks.map(renderBlock)
    })
  ]
});
var DocsLayout = (page, depth) => {
  const prefix = prefixFor(depth);
  const groups = page.section === "tutorial" ? tutorialNav : docsNav;
  return m.Div({
    class: "docs-layout",
    children: [
      Sidebar(groups, page.id, prefix),
      ContentArticle(page),
      Toc(page)
    ]
  });
};
var StandardLayout = (page) => m.Div({
  class: "single-layout",
  children: [ContentArticle(page), Toc(page)]
});
var InstallTerminal = () => m.Div({
  class: "terminal",
  children: [
    m.Div({
      class: "terminal-bar",
      children: [m.Span(), m.Span(), m.Span()]
    }),
    m.Pre({
      children: m.Code({
        children: [
          "$ bun install -g @cyftec/brahma",
          `
$ brahma create my-app`
        ].join("")
      })
    })
  ]
});
var SignalDemo = () => {
  const count = signal(0);
  const label = tmpl`${count}`;
  const codeLine = tmpl`children: tmpl\`Signal value: \$\{countSignal\}\``;
  return m.Div({
    class: "signal-demo",
    children: [
      m.Div({
        class: "demo-readout",
        children: [
          m.Span("Fine-grained update"),
          m.Span({
            class: "demo-readout-count",
            children: [m.Span(`Signal value: `), m.Strong(label)]
          })
        ]
      }),
      m.Button({
        class: "demo-button",
        onclick: () => count.value = count.value + 1,
        children: "Mutate count signal"
      }),
      m.Pre({
        class: "demo-code",
        children: m.Code({ children: codeLine })
      })
    ]
  });
};
var Landing = (depth) => {
  const prefix = prefixFor(depth);
  return m.Main({
    class: "landing",
    children: [
      m.Section({
        class: "hero",
        children: [
          m.Div({
            class: "hero-copy",
            children: [
              m.Div({
                class: "eyebrow",
                children: "Compiler-free TypeScript UI"
              }),
              m.H1({
                children: "Build static multi-page applications with signal-level DOM updates."
              }),
              m.P({
                children: "Maya keeps the platform visible: folder routes, real DOM nodes, TypeScript templates, and a Brahma build pipeline for web, PWA, and extension targets."
              }),
              m.Div({
                class: "hero-actions",
                children: [
                  m.A({
                    class: "button primary",
                    href: hrefFor(prefix, "docs/"),
                    children: "Read the docs"
                  }),
                  m.A({
                    class: "button secondary",
                    href: hrefFor(prefix, "tutorial/"),
                    children: "Start tutorial"
                  })
                ]
              })
            ]
          }),
          m.Div({
            class: "hero-visual",
            children: [InstallTerminal(), SignalDemo()]
          })
        ]
      }),
      m.Section({
        class: "pillars",
        children: landingPillars.map((pillar) => m.Article({
          class: "pillar",
          children: [
            m.H2({ children: pillar.title }),
            m.P({ children: pillar.text })
          ]
        }))
      }),
      m.Section({
        class: "code-compare",
        children: [
          m.Div({
            children: [
              m.H2("A page is just TypeScript"),
              m.P("Brahma builds this expression to HTML first, then the browser mounts the same structure for runtime events and signal effects.")
            ]
          }),
          CodeBlock([
            'import { m } from "@cyftec/maya";',
            'import { signal, tmpl } from "@cyftec/maya/signal";',
            "",
            "const count = signal(0);",
            "",
            "export default m.Html({",
            '  lang: "en",',
            "  children: [",
            '    m.Head({ children: [m.Title("Counter")] }),',
            "    m.Body({",
            "      children: [",
            '        m.Script({ src: "main.js", defer: true }),',
            "        m.Button({",
            "          onclick: () => (count.value += 1),",
            "          children: tmpl`Clicked ${count} times`,",
            "        }),",
            "      ],",
            "    }),",
            "  ],",
            "});"
          ].join(`
`))
        ]
      })
    ]
  });
};
var SitePage = (pageId, depth = 0) => {
  const page = pages[pageId];
  const section = page?.section || "home";
  const prefix = prefixFor(depth);
  const title = pageId === "home" ? "Maya UI Documentation" : `${page.title} - Maya UI`;
  const description = page?.description || "Documentation for the Maya UI Framework and Brahma CLI.";
  return m.Html({
    lang: "en",
    children: [
      m.Head({
        children: [
          m.Title(title),
          m.Meta({ charset: "UTF-8" }),
          m.Meta({
            name: "viewport",
            content: "width=device-width, initial-scale=1.0"
          }),
          m.Meta({ name: "description", content: description }),
          m.Link({ rel: "stylesheet", href: `${prefix}assets/styles.css` })
        ]
      }),
      m.Body({
        children: [
          m.Script({ src: "main.js", defer: true }),
          m.Div({
            class: "site",
            children: [
              TopNav(section, pageId, prefix),
              pageId === "home" ? Landing(depth) : m.Main({
                class: "page-shell",
                children: section === "docs" || section === "tutorial" ? DocsLayout(page, depth) : StandardLayout(page)
              }),
              m.Footer({
                class: "footer",
                children: [
                  m.Span({ children: sectionLabel[section] }),
                  m.Span({ children: "Built with Maya and Brahma." })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
};

// dev/view/docs/built-in-directives/page.ts
var page_default = SitePage("docs-built-in-directives", 2);

    
const mountAndRun = () => {
    phase.start("mount");
    idGen.resetIdCounter();
    page_default();
    phase.start("run")
};

mountAndRun();
    

  