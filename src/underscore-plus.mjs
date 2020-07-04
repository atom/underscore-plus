/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
export * from 'underscore'

// import * as _ from 'underscore' // if we needed all
import {every, flatten, has, include, isArray, isElement, isEqual as _isEqual, isFunction, isObject, isRegExp, uniq} from "underscore";

const macModifierKeyMap = {
  cmd: '\u2318',
  ctrl: '\u2303',
  alt: '\u2325',
  option: '\u2325',
  shift: '\u21e7',
  enter: '\u23ce',
  left: '\u2190',
  right: '\u2192',
  up: '\u2191',
  down: '\u2193'
};

const nonMacModifierKeyMap = {
  cmd: 'Cmd',
  ctrl: 'Ctrl',
  alt: 'Alt',
  option: 'Alt',
  shift: 'Shift',
  enter: 'Enter',
  left: 'Left',
  right: 'Right',
  up: 'Up',
  down: 'Down'
};

// Human key combos should always explicitly state the shift key. This map is a disambiguator.
// 'shift-version': 'no-shift-version'
const shiftKeyMap = {
  '~': '`',
  '_': '-',
  '+': '=',
  '|': '\\',
  '{': '[',
  '}': ']',
  ':': ';',
  '"': '\'',
  '<': ',',
  '>': '.',
  '?': '/'
};

function splitKeyPath(keyPath) {
  let startIndex = 0;
  const keyPathArray = [];
  if (keyPath == null) { return keyPathArray; }
  for (let i = 0; i < keyPath.length; i++) {
    const char = keyPath[i];
    if ((char === '.') && ((i === 0) || (keyPath[i-1] !== '\\'))) {
      keyPathArray.push(keyPath.substring(startIndex, i));
      startIndex = i + 1;
    }
  }
  keyPathArray.push(keyPath.substr(startIndex, keyPath.length));
  return keyPathArray;
}

const isPlainObject = value => isObject(value) && !isArray(value);

export function adviseBefore(object, methodName, advice) {
  const original = object[methodName];
  return object[methodName] = function(...args) {
    if (advice.apply(this, args) !== false) {
      return original.apply(this, args);
    }
  };
}

export function camelize(string) {
  if (string) {
    return string.replace(/[_-]+(\w)/g, m => m[1].toUpperCase());
  } else {
    return '';
  }
}

export function capitalize(word) {
  if (!word) { return ''; }

  if (word.toLowerCase() === 'github') {
    return 'GitHub';
  } else {
    return word[0].toUpperCase() + word.slice(1);
  }
}

export function compactObject(object) {
  const newObject = {};
  for (let key in object) {
    const value = object[key];
    if (value != null) { newObject[key] = value; }
  }
  return newObject;
}

export function dasherize(string) {
  if (!string) { return ''; }

  string = string[0].toLowerCase() + string.slice(1);
  return string.replace(/([A-Z])|(_)/g, function(m, letter) {
    if (letter) {
      return "-" + letter.toLowerCase();
    } else {
      return "-";
    }
  });
}

// Deep clones the given JSON object.
//
// `object` - The JSON object to clone.
//
// Returns a deep clone of the JSON object.
export function deepClone(object) {
  if (isArray(object)) {
    return object.map(value => deepClone(value));
  } else if (isObject(object) && !isFunction(object)) {
    return mapObject(object, (key, value) => [key, deepClone(value)]);
  } else {
    return object;
  }
}

export function deepExtend(target) {
  let result = target;
  let i = 0;
  while (++i < arguments.length) {
    const object = arguments[i];
    if (isPlainObject(result) && isPlainObject(object)) {
      const keys = Object.keys(object)
      for (let key of keys) {
        result[key] = deepExtend(result[key], object[key]);
      }
    } else {
      result = deepClone(object);
    }
  }
  return result;
}

export function deepContains(array, target) {
  if (array == null) { return false; }
  for (let object of array) {
    if (_isEqual(object, target)) { return true; }
  }
  return false;
}

export function endsWith(string, suffix) {
  if (suffix == null) { suffix = ''; }
  if (string) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
  } else {
    return false;
  }
}

export function escapeAttribute(string) {
  if (string) {
    return string.replace(/"/g, '&quot;').replace(/\n/g, '').replace(/\\/g, '-');
  } else {
    return '';
  }
}

export function escapeRegExp(string) {
  if (string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  } else {
    return '';
  }
}

export function humanizeEventName(eventName, eventDoc) {
  const [namespace, event]  = eventName.split(':');
  if (event == null) { return undasherize(namespace); }

  const namespaceDoc = undasherize(namespace);
  if (eventDoc == null) { eventDoc = undasherize(event); }

  return `${namespaceDoc}: ${eventDoc}`;
}

export function humanizeKey(key, platform) {
  if (platform == null) { ({
    platform
  } = process); }
  if (!key) { return key; }

  const modifierKeyMap = platform === 'darwin' ? macModifierKeyMap : nonMacModifierKeyMap;

  if (modifierKeyMap[key]) {
    return modifierKeyMap[key];
  } else if ((key.length === 1) && (shiftKeyMap[key] != null)) {
    return [modifierKeyMap.shift, shiftKeyMap[key]];
  } else if ((key.length === 1) && (key === key.toUpperCase()) && (key.toUpperCase() !== key.toLowerCase())) {
    return [modifierKeyMap.shift, key.toUpperCase()];
  } else if ((key.length === 1) || /f[0-9]{1,2}/.test(key)) {
    return key.toUpperCase();
  } else {
    if (platform === 'darwin') {
      return key;
    } else {
      return capitalize(key);
    }
  }
}

// Humanize the keystroke according to platform conventions. This method
// attempts to mirror the text the given keystroke would have if displayed in
// a system menu.
//
// keystroke - A String keystroke to humanize such as `ctrl-O`.
// platform  - An optional String platform to humanize for (default:
//             `process.platform`).
//
// Returns a humanized representation of the keystroke.
export function humanizeKeystroke(keystroke, platform) {
  if (platform == null) { ({
    platform
  } = process); }
  if (!keystroke) { return keystroke; }

  const keystrokes = keystroke.split(' ');
  const humanizedKeystrokes = [];
  for (keystroke of keystrokes) {
    let keys = [];
    const splitKeystroke = keystroke.split('-');
    for (let index = 0; index < splitKeystroke.length; index++) {
      // Check for consecutive dashes such as cmd--
      let key = splitKeystroke[index];
      if ((key === '') && (splitKeystroke[index-1] === '')) { key = '-'; }
      if (key) { keys.push(humanizeKey(key, platform)); }
    }

    keys = uniq(flatten(keys));
    if (platform === 'darwin') {
      keys = keys.join('');
    } else {
      keys = keys.join('+');
    }
    humanizedKeystrokes.push(keys);
  }

  return humanizedKeystrokes.join(' ');
}

export function isSubset(potentialSubset, potentialSuperset) {
  return every(potentialSubset, element => include(potentialSuperset, element));
}

export function losslessInvert(hash) {
  const inverted = {};
  for (let key in hash) {
    const value = hash[key];
    if (inverted[value] == null) { inverted[value] = []; }
    inverted[value].push(key);
  }
  return inverted;
}

// Transform the given object into another object.
//
// `object` - The object to transform.
// `iterator` -
//   A function that takes `(key, value)` arguments and returns a
//   `[key, value]` tuple.
//
// Returns a new object based with the key/values returned by the iterator.
export function mapObject(object, iterator) {
  const newObject = {};
  const keys = Object.keys(object)
  for (let key of keys) {
    let value;
    [key, value] = iterator(key, object[key]);
    newObject[key] = value;
  }

  return newObject;
}

export function multiplyString(string, n) {
  let finalString = "";
  let i = 0;
  while (i < n) {
    finalString += string;
    i++;
  }
  return finalString;
}

export function pluralize(count, singular, plural) {
  if (count == null) { count = 0; }
  if (plural == null) { plural = singular+'s'; }
  if (count === 1) {
    return `${count} ${singular}`;
  } else {
    return `${count} ${plural}`;
  }
}

export function remove(array, element) {
  const index = array.indexOf(element);
  if (index >= 0) { array.splice(index, 1); }
  return array;
}

export function setValueForKeyPath(object, keyPath, value) {
  const keys = splitKeyPath(keyPath);
  while (keys.length > 1) {
    const key = keys.shift();
    if (object[key] == null) { object[key] = {}; }
    object = object[key];
  }
  if (value != null) {
    object[keys.shift()] = value;
  } else {
    delete object[keys.shift()];
  }
}

export function hasKeyPath(object, keyPath) {
  const keys = splitKeyPath(keyPath);
  for (let key of keys) {
    if (!object.hasOwnProperty(key)) { return false; }
    object = object[key];
  }
  return true;
}

export function spliceWithArray(originalArray, start, length, insertedArray, chunkSize) {
  if (chunkSize == null) { chunkSize = 100000; }
  if (insertedArray.length < chunkSize) {
    originalArray.splice(start, length, ...insertedArray);
  } else {
      originalArray.splice(start, length);
      for (let chunkStart = 0, end = insertedArray.length, step = chunkSize, asc = step > 0; asc ? chunkStart <= end : chunkStart >= end; chunkStart += step) {
        originalArray.splice(start + chunkStart, 0, ...insertedArray.slice(chunkStart, chunkStart + chunkSize));
      }
  }
}

export function sum(array) {
  let sum = 0;
  for (let elt of Array.from(array)) { sum += elt; }
  return sum;
}

export function uncamelcase(string) {
  if (!string) { return ''; }

  const result = string.replace(/([A-Z])|_+/g, function(match, letter) { if (letter == null) { letter = ''; } return ` ${letter}`; });
  return capitalize(result.trim());
}

export function undasherize(string) {
  if (string) {
    return string.split('-').map(capitalize).join(' ');
  } else {
    return '';
  }
}

export function underscore(string) {
  if (!string) { return ''; }

  string = string[0].toLowerCase() + string.slice(1);
  return string.replace(/([A-Z])|-+/g, function(match, letter) { if (letter == null) { letter = ''; } return `_${letter.toLowerCase()}`; });
}

export function valueForKeyPath(object, keyPath) {
  const keys = splitKeyPath(keyPath);
  for (let key of Array.from(keys)) {
    object = object[key];
    if (object == null) { return; }
  }
  return object;
}

export function isEqual(a, b, aStack, bStack) {
  if (isArray(aStack) && isArray(bStack)) {
    return isEqual_(a, b, aStack, bStack);
  } else {
    return isEqual_(a, b);
  }
}

export function isEqualForProperties(a, b, ...properties) {
  for (let property of Array.from(properties)) {
    if (!_isEqual(a[property], b[property])) { return false; }
  }
  return true;
}

function isEqual_(a, b, aStack=[], bStack=[]) {
  if (a === b) { return _isEqual(a, b); }
  if (isFunction(a) || isFunction(b)) { return _isEqual(a, b); }

  let stackIndex = aStack.length;
  while (stackIndex--) {
    if (aStack[stackIndex] === a) { return bStack[stackIndex] === b; }
  }
  aStack.push(a);
  bStack.push(b);

  let equal = false;
  if (isFunction(a?.isEqual)) {
    equal = a.isEqual(b, aStack, bStack);
  } else if (isFunction(b?.isEqual)) {
    equal = b.isEqual(a, bStack, aStack);
  } else if (isArray(a) && isArray(b) && (a.length === b.length)) {
    equal = true;
    for (let i = 0; i < a.length; i++) {
      const aElement = a[i];
      if (!isEqual_(aElement, b[i], aStack, bStack)) {
        equal = false;
        break;
      }
    }
  } else if (isRegExp(a) && isRegExp(b)) {
    equal = _isEqual(a, b);
  } else if (isElement(a) && isElement(b)) {
    equal = a === b;
  } else if (isObject(a) && isObject(b)) {
    const aCtor = a.constructor;
    const bCtor = b.constructor;
    const aCtorValid = isFunction(aCtor) && aCtor instanceof aCtor;
    const bCtorValid = isFunction(bCtor) && bCtor instanceof bCtor;
    if ((aCtor !== bCtor) && !(aCtorValid && bCtorValid)) {
      equal = false;
    } else {
      let key;
      let aKeyCount = 0;
      equal = true;
      for (key in a) {
        const aValue = a[key];
        if (!has(a, key)) { continue; }
        aKeyCount++;
        if (!has(b, key) || !isEqual_(aValue, b[key], aStack, bStack)) {
          equal = false;
          break;
        }
      }
      if (equal) {
        let bKeyCount = 0;
        for (key in b) {
          const bValue = b[key];
          if (has(b, key)) { bKeyCount++; }
        }
        equal = aKeyCount === bKeyCount;
      }
    }
  } else {
    equal = _isEqual(a, b);
  }

  aStack.pop();
  bStack.pop();
  return equal;
}