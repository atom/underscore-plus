/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import * as _ from 'underscore'

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

const splitKeyPath = function(keyPath) {
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
};

const isPlainObject = value => _.isObject(value) && !_.isArray(value);

var plus = {
  adviseBefore(object, methodName, advice) {
    const original = object[methodName];
    return object[methodName] = function(...args) {
      if (advice.apply(this, args) !== false) {
        return original.apply(this, args);
      }
    };
  },

  camelize(string) {
    if (string) {
      return string.replace(/[_-]+(\w)/g, m => m[1].toUpperCase());
    } else {
      return '';
    }
  },

  capitalize(word) {
    if (!word) { return ''; }

    if (word.toLowerCase() === 'github') {
      return 'GitHub';
    } else {
      return word[0].toUpperCase() + word.slice(1);
    }
  },

  compactObject(object) {
    const newObject = {};
    for (let key in object) {
      const value = object[key];
      if (value != null) { newObject[key] = value; }
    }
    return newObject;
  },

  dasherize(string) {
    if (!string) { return ''; }

    string = string[0].toLowerCase() + string.slice(1);
    return string.replace(/([A-Z])|(_)/g, function(m, letter) {
      if (letter) {
        return "-" + letter.toLowerCase();
      } else {
        return "-";
      }
    });
  },

  // Deep clones the given JSON object.
  //
  // `object` - The JSON object to clone.
  //
  // Returns a deep clone of the JSON object.
  deepClone(object) {
    if (_.isArray(object)) {
      return object.map(value => plus.deepClone(value));
    } else if (_.isObject(object) && !_.isFunction(object)) {
      return plus.mapObject(object, (key, value) => [key, plus.deepClone(value)]);
    } else {
      return object;
    }
  },

  deepExtend(target) {
    let result = target;
    let i = 0;
    while (++i < arguments.length) {
      const object = arguments[i];
      if (isPlainObject(result) && isPlainObject(object)) {
        for (let key of Array.from(Object.keys(object))) {
          result[key] = plus.deepExtend(result[key], object[key]);
        }
      } else {
        result = plus.deepClone(object);
      }
    }
    return result;
  },

  deepContains(array, target) {
    if (array == null) { return false; }
    for (let object of Array.from(array)) {
      if (_.isEqual(object, target)) { return true; }
    }
    return false;
  },

  endsWith(string, suffix) {
    if (suffix == null) { suffix = ''; }
    if (string) {
      return string.indexOf(suffix, string.length - suffix.length) !== -1;
    } else {
      return false;
    }
  },

  escapeAttribute(string) {
    if (string) {
      return string.replace(/"/g, '&quot;').replace(/\n/g, '').replace(/\\/g, '-');
    } else {
      return '';
    }
  },

  escapeRegExp(string) {
    if (string) {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    } else {
      return '';
    }
  },

  humanizeEventName(eventName, eventDoc) {
    const [namespace, event]  = Array.from(eventName.split(':'));
    if (event == null) { return plus.undasherize(namespace); }

    const namespaceDoc = plus.undasherize(namespace);
    if (eventDoc == null) { eventDoc = plus.undasherize(event); }

    return `${namespaceDoc}: ${eventDoc}`;
  },

  humanizeKey(key, platform) {
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
        return plus.capitalize(key);
      }
    }
  },

  // Humanize the keystroke according to platform conventions. This method
  // attempts to mirror the text the given keystroke would have if displayed in
  // a system menu.
  //
  // keystroke - A String keystroke to humanize such as `ctrl-O`.
  // platform  - An optional String platform to humanize for (default:
  //             `process.platform`).
  //
  // Returns a humanized representation of the keystroke.
  humanizeKeystroke(keystroke, platform) {
    if (platform == null) { ({
      platform
    } = process); }
    if (!keystroke) { return keystroke; }

    const keystrokes = keystroke.split(' ');
    const humanizedKeystrokes = [];
    for (keystroke of Array.from(keystrokes)) {
      let keys = [];
      const splitKeystroke = keystroke.split('-');
      for (let index = 0; index < splitKeystroke.length; index++) {
        // Check for consecutive dashes such as cmd--
        let key = splitKeystroke[index];
        if ((key === '') && (splitKeystroke[index-1] === '')) { key = '-'; }
        if (key) { keys.push(plus.humanizeKey(key, platform)); }
      }

      keys = _.uniq(_.flatten(keys));
      if (platform === 'darwin') {
        keys = keys.join('');
      } else {
        keys = keys.join('+');
      }
      humanizedKeystrokes.push(keys);
    }

    return humanizedKeystrokes.join(' ');
  },

  isSubset(potentialSubset, potentialSuperset) {
    return _.every(potentialSubset, element => _.include(potentialSuperset, element));
  },

  losslessInvert(hash) {
    const inverted = {};
    for (let key in hash) {
      const value = hash[key];
      if (inverted[value] == null) { inverted[value] = []; }
      inverted[value].push(key);
    }
    return inverted;
  },

  // Transform the given object into another object.
  //
  // `object` - The object to transform.
  // `iterator` -
  //   A function that takes `(key, value)` arguments and returns a
  //   `[key, value]` tuple.
  //
  // Returns a new object based with the key/values returned by the iterator.
  mapObject(object, iterator) {
    const newObject = {};
    for (let key of Array.from(Object.keys(object))) {
      let value;
      [key, value] = Array.from(iterator(key, object[key]));
      newObject[key] = value;
    }

    return newObject;
  },

  multiplyString(string, n) {
    let finalString = "";
    let i = 0;
    while (i < n) {
      finalString += string;
      i++;
    }
    return finalString;
  },

  pluralize(count, singular, plural) {
    if (count == null) { count = 0; }
    if (plural == null) { plural = singular+'s'; }
    if (count === 1) {
      return `${count} ${singular}`;
    } else {
      return `${count} ${plural}`;
    }
  },

  remove(array, element) {
    const index = array.indexOf(element);
    if (index >= 0) { array.splice(index, 1); }
    return array;
  },

  setValueForKeyPath(object, keyPath, value) {
    const keys = splitKeyPath(keyPath);
    while (keys.length > 1) {
      const key = keys.shift();
      if (object[key] == null) { object[key] = {}; }
      object = object[key];
    }
    if (value != null) {
      return object[keys.shift()] = value;
    } else {
      return delete object[keys.shift()];
    }
  },

  hasKeyPath(object, keyPath) {
    const keys = splitKeyPath(keyPath);
    for (let key of Array.from(keys)) {
      if (!object.hasOwnProperty(key)) { return false; }
      object = object[key];
    }
    return true;
  },

  spliceWithArray(originalArray, start, length, insertedArray, chunkSize) {
    if (chunkSize == null) { chunkSize = 100000; }
    if (insertedArray.length < chunkSize) {
      return originalArray.splice(start, length, ...Array.from(insertedArray));
    } else {
      originalArray.splice(start, length);
      return (() => {
        const result = [];
        for (let chunkStart = 0, end = insertedArray.length, step = chunkSize, asc = step > 0; asc ? chunkStart <= end : chunkStart >= end; chunkStart += step) {
          result.push(originalArray.splice(start + chunkStart, 0, ...Array.from(insertedArray.slice(chunkStart, chunkStart + chunkSize))));
        }
        return result;
      })();
    }
  },

  sum(array) {
    let sum = 0;
    for (let elt of Array.from(array)) { sum += elt; }
    return sum;
  },

  uncamelcase(string) {
    if (!string) { return ''; }

    const result = string.replace(/([A-Z])|_+/g, function(match, letter) { if (letter == null) { letter = ''; } return ` ${letter}`; });
    return plus.capitalize(result.trim());
  },

  undasherize(string) {
    if (string) {
      return string.split('-').map(plus.capitalize).join(' ');
    } else {
      return '';
    }
  },

  underscore(string) {
    if (!string) { return ''; }

    string = string[0].toLowerCase() + string.slice(1);
    return string.replace(/([A-Z])|-+/g, function(match, letter) { if (letter == null) { letter = ''; } return `_${letter.toLowerCase()}`; });
  },

  valueForKeyPath(object, keyPath) {
    const keys = splitKeyPath(keyPath);
    for (let key of Array.from(keys)) {
      object = object[key];
      if (object == null) { return; }
    }
    return object;
  },

  isEqual(a, b, aStack, bStack) {
    if (_.isArray(aStack) && _.isArray(bStack)) {
      return isEqual(a, b, aStack, bStack);
    } else {
      return isEqual(a, b);
    }
  },

  isEqualForProperties(a, b, ...properties) {
    for (let property of Array.from(properties)) {
      if (!_.isEqual(a[property], b[property])) { return false; }
    }
    return true;
  }
};

var isEqual = function(a, b, aStack, bStack) {
  if (aStack == null) { aStack = []; }
  if (bStack == null) { bStack = []; }
  if (a === b) { return _.isEqual(a, b); }
  if (_.isFunction(a) || _.isFunction(b)) { return _.isEqual(a, b); }

  let stackIndex = aStack.length;
  while (stackIndex--) {
    if (aStack[stackIndex] === a) { return bStack[stackIndex] === b; }
  }
  aStack.push(a);
  bStack.push(b);

  let equal = false;
  if (_.isFunction(a?.isEqual)) {
    equal = a.isEqual(b, aStack, bStack);
  } else if (_.isFunction(b?.isEqual)) {
    equal = b.isEqual(a, bStack, aStack);
  } else if (_.isArray(a) && _.isArray(b) && (a.length === b.length)) {
    equal = true;
    for (let i = 0; i < a.length; i++) {
      const aElement = a[i];
      if (!isEqual(aElement, b[i], aStack, bStack)) {
        equal = false;
        break;
      }
    }
  } else if (_.isRegExp(a) && _.isRegExp(b)) {
    equal = _.isEqual(a, b);
  } else if (_.isElement(a) && _.isElement(b)) {
    equal = a === b;
  } else if (_.isObject(a) && _.isObject(b)) {
    const aCtor = a.constructor;
    const bCtor = b.constructor;
    const aCtorValid = _.isFunction(aCtor) && aCtor instanceof aCtor;
    const bCtorValid = _.isFunction(bCtor) && bCtor instanceof bCtor;
    if ((aCtor !== bCtor) && !(aCtorValid && bCtorValid)) {
      equal = false;
    } else {
      let key;
      let aKeyCount = 0;
      equal = true;
      for (key in a) {
        const aValue = a[key];
        if (!_.has(a, key)) { continue; }
        aKeyCount++;
        if (!_.has(b, key) || !isEqual(aValue, b[key], aStack, bStack)) {
          equal = false;
          break;
        }
      }
      if (equal) {
        let bKeyCount = 0;
        for (key in b) {
          const bValue = b[key];
          if (_.has(b, key)) { bKeyCount++; }
        }
        equal = aKeyCount === bKeyCount;
      }
    }
  } else {
    equal = _.isEqual(a, b);
  }

  aStack.pop();
  bStack.pop();
  return equal;
};

module.exports = _.extend({}, _, plus);
