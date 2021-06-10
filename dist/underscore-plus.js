"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  adviseBefore: true,
  camelize: true,
  capitalize: true,
  compactObject: true,
  dasherize: true,
  deepClone: true,
  deepExtend: true,
  deepContains: true,
  endsWith: true,
  escapeAttribute: true,
  escapeRegExp: true,
  humanizeEventName: true,
  humanizeKey: true,
  humanizeKeystroke: true,
  isSubset: true,
  losslessInvert: true,
  mapObject: true,
  multiplyString: true,
  pluralize: true,
  remove: true,
  setValueForKeyPath: true,
  hasKeyPath: true,
  spliceWithArray: true,
  sum: true,
  uncamelcase: true,
  undasherize: true,
  underscore: true,
  valueForKeyPath: true,
  isEqual: true,
  isEqualForProperties: true
};
exports.adviseBefore = adviseBefore;
exports.camelize = camelize;
exports.capitalize = capitalize;
exports.compactObject = compactObject;
exports.dasherize = dasherize;
exports.deepClone = deepClone;
exports.deepExtend = deepExtend;
exports.deepContains = deepContains;
exports.endsWith = endsWith;
exports.escapeAttribute = escapeAttribute;
exports.escapeRegExp = escapeRegExp;
exports.humanizeEventName = humanizeEventName;
exports.humanizeKey = humanizeKey;
exports.humanizeKeystroke = humanizeKeystroke;
exports.isSubset = isSubset;
exports.losslessInvert = losslessInvert;
exports.mapObject = mapObject;
exports.multiplyString = multiplyString;
exports.pluralize = pluralize;
exports.remove = remove;
exports.setValueForKeyPath = setValueForKeyPath;
exports.hasKeyPath = hasKeyPath;
exports.spliceWithArray = spliceWithArray;
exports.sum = sum;
exports.uncamelcase = uncamelcase;
exports.undasherize = undasherize;
exports.underscore = underscore;
exports.valueForKeyPath = valueForKeyPath;
exports.isEqual = isEqual;
exports.isEqualForProperties = isEqualForProperties;

var _underscore = require("underscore");

Object.keys(_underscore).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _underscore[key];
    }
  });
});
// import * as _ from 'underscore' // if we needed all
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
}; // Human key combos should always explicitly state the shift key. This map is a disambiguator.
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

  if (keyPath == null) {
    return keyPathArray;
  }

  for (let i = 0; i < keyPath.length; i++) {
    const char = keyPath[i];

    if (char === '.' && (i === 0 || keyPath[i - 1] !== '\\')) {
      keyPathArray.push(keyPath.substring(startIndex, i));
      startIndex = i + 1;
    }
  }

  keyPathArray.push(keyPath.substr(startIndex, keyPath.length));
  return keyPathArray;
}

const isPlainObject = value => (0, _underscore.isObject)(value) && !(0, _underscore.isArray)(value);

function adviseBefore(object, methodName, advice) {
  const original = object[methodName];
  return object[methodName] = function (...args) {
    if (advice.apply(this, args) !== false) {
      return original.apply(this, args);
    }
  };
}

function camelize(string) {
  if (string) {
    return string.replace(/[_-]+(\w)/g, m => m[1].toUpperCase());
  } else {
    return '';
  }
}

function capitalize(word) {
  if (!word) {
    return '';
  }

  if (word.toLowerCase() === 'github') {
    return 'GitHub';
  } else {
    return word[0].toUpperCase() + word.slice(1);
  }
}

function compactObject(object) {
  const newObject = {};

  for (let key in object) {
    const value = object[key];

    if (value != null) {
      newObject[key] = value;
    }
  }

  return newObject;
}

function dasherize(string) {
  if (!string) {
    return '';
  }

  string = string[0].toLowerCase() + string.slice(1);
  return string.replace(/([A-Z])|(_)/g, function (m, letter) {
    if (letter) {
      return "-" + letter.toLowerCase();
    } else {
      return "-";
    }
  });
} // Deep clones the given JSON object.
//
// `object` - The JSON object to clone.
//
// Returns a deep clone of the JSON object.


function deepClone(object) {
  if ((0, _underscore.isArray)(object)) {
    return object.map(value => deepClone(value));
  } else if ((0, _underscore.isObject)(object) && !(0, _underscore.isFunction)(object)) {
    return mapObject(object, (key, value) => [key, deepClone(value)]);
  } else {
    return object;
  }
}

function deepExtend(target) {
  let result = target;
  let i = 0;

  while (++i < arguments.length) {
    const object = arguments[i];

    if (isPlainObject(result) && isPlainObject(object)) {
      const keys = Object.keys(object);

      for (let key of keys) {
        result[key] = deepExtend(result[key], object[key]);
      }
    } else {
      result = deepClone(object);
    }
  }

  return result;
}

function deepContains(array, target) {
  if (array == null) {
    return false;
  }

  for (let object of array) {
    if ((0, _underscore.isEqual)(object, target)) {
      return true;
    }
  }

  return false;
}

function endsWith(string, suffix) {
  if (suffix == null) {
    suffix = '';
  }

  if (string) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
  } else {
    return false;
  }
}

function escapeAttribute(string) {
  if (string) {
    return string.replace(/"/g, '&quot;').replace(/\n/g, '').replace(/\\/g, '-');
  } else {
    return '';
  }
}

function escapeRegExp(string) {
  if (string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  } else {
    return '';
  }
}

function humanizeEventName(eventName, eventDoc) {
  const [namespace, event] = eventName.split(':');

  if (event == null) {
    return undasherize(namespace);
  }

  const namespaceDoc = undasherize(namespace);

  if (eventDoc == null) {
    eventDoc = undasherize(event);
  }

  return `${namespaceDoc}: ${eventDoc}`;
}

function humanizeKey(key, platform = process.platform) {
  if (!key) {
    return key;
  }

  const modifierKeyMap = platform === 'darwin' ? macModifierKeyMap : nonMacModifierKeyMap;

  if (modifierKeyMap[key]) {
    return modifierKeyMap[key];
  } else if (key.length === 1 && shiftKeyMap[key] != null) {
    return [modifierKeyMap.shift, shiftKeyMap[key]];
  } else if (key.length === 1 && key === key.toUpperCase() && key.toUpperCase() !== key.toLowerCase()) {
    return [modifierKeyMap.shift, key.toUpperCase()];
  } else if (key.length === 1 || /f[0-9]{1,2}/.test(key)) {
    return key.toUpperCase();
  } else {
    if (platform === 'darwin') {
      return key;
    } else {
      return capitalize(key);
    }
  }
} // Humanize the keystroke according to platform conventions. This method
// attempts to mirror the text the given keystroke would have if displayed in
// a system menu.
//
// keystroke - A String keystroke to humanize such as `ctrl-O`.
// platform  - An optional String platform to humanize for (default:
//             `process.platform`).
//
// Returns a humanized representation of the keystroke.


function humanizeKeystroke(keystroke, platform = process.platform) {
  if (!keystroke) {
    return keystroke;
  }

  const keystrokes = keystroke.split(' ');
  const humanizedKeystrokes = [];

  for (keystroke of keystrokes) {
    let keys = [];
    const splitKeystroke = keystroke.split('-');

    for (let index = 0; index < splitKeystroke.length; index++) {
      // Check for consecutive dashes such as cmd--
      let key = splitKeystroke[index];

      if (key === '' && splitKeystroke[index - 1] === '') {
        key = '-';
      }

      if (key) {
        keys.push(humanizeKey(key, platform));
      }
    }

    keys = (0, _underscore.uniq)((0, _underscore.flatten)(keys));

    if (platform === 'darwin') {
      keys = keys.join('');
    } else {
      keys = keys.join('+');
    }

    humanizedKeystrokes.push(keys);
  }

  return humanizedKeystrokes.join(' ');
}

function isSubset(potentialSubset, potentialSuperset) {
  return (0, _underscore.every)(potentialSubset, element => (0, _underscore.include)(potentialSuperset, element));
}

function losslessInvert(hash) {
  const inverted = {};

  for (let key in hash) {
    const value = hash[key];

    if (inverted[value] == null) {
      inverted[value] = [];
    }

    inverted[value].push(key);
  }

  return inverted;
} // Transform the given object into another object.
//
// `object` - The object to transform.
// `iterator` -
//   A function that takes `(key, value)` arguments and returns a
//   `[key, value]` tuple.
//
// Returns a new object based with the key/values returned by the iterator.


function mapObject(object, iterator) {
  const newObject = {};
  const keys = Object.keys(object);

  for (let key of keys) {
    let value;
    [key, value] = iterator(key, object[key]);
    newObject[key] = value;
  }

  return newObject;
}

function multiplyString(string, n) {
  let finalString = "";
  let i = 0;

  while (i < n) {
    finalString += string;
    i++;
  }

  return finalString;
}

function pluralize(count = 0, singular, plural = singular + 's') {
  if (count === 1) {
    return `${count} ${singular}`;
  } else {
    return `${count} ${plural}`;
  }
}

function remove(array, element) {
  const index = array.indexOf(element);

  if (index >= 0) {
    array.splice(index, 1);
  }

  return array;
}

function setValueForKeyPath(object, keyPath, value) {
  const keys = splitKeyPath(keyPath);

  while (keys.length > 1) {
    const key = keys.shift();

    if (object[key] == null) {
      object[key] = {};
    }

    object = object[key];
  }

  if (value != null) {
    object[keys.shift()] = value;
  } else {
    delete object[keys.shift()];
  }
}

function hasKeyPath(object, keyPath) {
  const keys = splitKeyPath(keyPath);

  for (let key of keys) {
    if (!object.hasOwnProperty(key)) {
      return false;
    }

    object = object[key];
  }

  return true;
}

function spliceWithArray(originalArray, start, length, insertedArray, chunkSize = 100000) {
  if (insertedArray.length < chunkSize) {
    originalArray.splice(start, length, ...insertedArray);
  } else {
    originalArray.splice(start, length);

    for (let chunkStart = 0, end = insertedArray.length; chunkStart <= end; chunkStart += chunkSize) {
      originalArray.splice(start + chunkStart, 0, ...insertedArray.slice(chunkStart, chunkStart + chunkSize));
    }
  }
}

function sum(array) {
  let sum = 0;

  for (let elt of array) {
    sum += elt;
  }

  return sum;
}

function uncamelcase(string) {
  if (!string) {
    return '';
  }

  const result = string.replace(/([A-Z])|_+/g, (match, letter = '') => ` ${letter}`);
  return capitalize(result.trim());
}

function undasherize(string) {
  if (string) {
    return string.split('-').map(capitalize).join(' ');
  } else {
    return '';
  }
}

function underscore(string) {
  if (!string) {
    return '';
  }

  string = string[0].toLowerCase() + string.slice(1);
  return string.replace(/([A-Z])|-+/g, (match, letter = '') => `_${letter.toLowerCase()}`);
}

function valueForKeyPath(object, keyPath) {
  const keys = splitKeyPath(keyPath);

  for (let key of keys) {
    object = object[key];

    if (object == null) {
      return;
    }
  }

  return object;
}

function isEqual(a, b, aStack, bStack) {
  if ((0, _underscore.isArray)(aStack) && (0, _underscore.isArray)(bStack)) {
    return isEqual_(a, b, aStack, bStack);
  } else {
    return isEqual_(a, b);
  }
}

function isEqualForProperties(a, b, ...properties) {
  // TODO is Array.from needed?
  for (let property of Array.from(properties)) {
    if (!(0, _underscore.isEqual)(a[property], b[property])) {
      return false;
    }
  }

  return true;
}

function isEqual_(a, b, aStack = [], bStack = []) {
  if (a === b) {
    return (0, _underscore.isEqual)(a, b);
  }

  if ((0, _underscore.isFunction)(a) || (0, _underscore.isFunction)(b)) {
    return (0, _underscore.isEqual)(a, b);
  }

  let stackIndex = aStack.length;

  while (stackIndex--) {
    if (aStack[stackIndex] === a) {
      return bStack[stackIndex] === b;
    }
  }

  aStack.push(a);
  bStack.push(b);
  let equal = false;

  if ((0, _underscore.isFunction)(a === null || a === void 0 ? void 0 : a.isEqual)) {
    equal = a.isEqual(b, aStack, bStack);
  } else if ((0, _underscore.isFunction)(b === null || b === void 0 ? void 0 : b.isEqual)) {
    equal = b.isEqual(a, bStack, aStack);
  } else if ((0, _underscore.isArray)(a) && (0, _underscore.isArray)(b) && a.length === b.length) {
    equal = true;

    for (let i = 0; i < a.length; i++) {
      const aElement = a[i];

      if (!isEqual_(aElement, b[i], aStack, bStack)) {
        equal = false;
        break;
      }
    }
  } else if ((0, _underscore.isRegExp)(a) && (0, _underscore.isRegExp)(b)) {
    equal = (0, _underscore.isEqual)(a, b);
  } else if ((0, _underscore.isElement)(a) && (0, _underscore.isElement)(b)) {
    equal = a === b;
  } else if ((0, _underscore.isObject)(a) && (0, _underscore.isObject)(b)) {
    const aCtor = a.constructor;
    const bCtor = b.constructor;
    const aCtorValid = (0, _underscore.isFunction)(aCtor) && aCtor instanceof aCtor;
    const bCtorValid = (0, _underscore.isFunction)(bCtor) && bCtor instanceof bCtor;

    if (aCtor !== bCtor && !(aCtorValid && bCtorValid)) {
      equal = false;
    } else {
      let key;
      let aKeyCount = 0;
      equal = true;

      for (key in a) {
        const aValue = a[key];

        if (!(0, _underscore.has)(a, key)) {
          continue;
        }

        aKeyCount++;

        if (!(0, _underscore.has)(b, key) || !isEqual_(aValue, b[key], aStack, bStack)) {
          equal = false;
          break;
        }
      }

      if (equal) {
        let bKeyCount = 0;

        for (key in b) {
          const bValue = b[key];

          if ((0, _underscore.has)(b, key)) {
            bKeyCount++;
          }
        }

        equal = aKeyCount === bKeyCount;
      }
    }
  } else {
    equal = (0, _underscore.isEqual)(a, b);
  }

  aStack.pop();
  bStack.pop();
  return equal;
} // TODO: Consider shorter variations of null checks:
// https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md#ds207-consider-shorter-variations-of-null-checks