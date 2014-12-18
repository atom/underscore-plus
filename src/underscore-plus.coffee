_ = require 'underscore'

macModifierKeyMap =
  cmd: '\u2318'
  ctrl: '\u2303'
  alt: '\u2325'
  option: '\u2325'
  shift: '\u21e7'
  enter: '\u23ce'
  left: '\u2190'
  right: '\u2192'
  up: '\u2191'
  down: '\u2193'

nonMacModifierKeyMap =
  cmd: 'Cmd'
  ctrl: 'Ctrl'
  alt: 'Alt'
  option: 'Alt'
  shift: 'Shift'
  enter: 'Enter'
  left: 'Left'
  right: 'Right'
  up: 'Up'
  down: 'Down'

# Human key combos should always explicitly state the shift key. This map is a disambiguator.
# 'shift-version': 'no-shift-version'
shiftKeyMap =
  '~': '`'
  '_': '-'
  '+': '='
  '|': '\\'
  '{': '['
  '}': ']'
  ':': ';'
  '"': '\''
  '<': ','
  '>': '.'
  '?': '/'

splitKeyPath = (keyPath) ->
  startIndex = 0
  keyPathArray = []
  return keyPathArray unless keyPath?
  for char, i in keyPath
    if char is '.' and (i is 0 or keyPath[i-1] != '\\')
      keyPathArray.push keyPath.substring(startIndex, i)
      startIndex = i + 1
  keyPathArray.push keyPath.substr(startIndex, keyPath.length)
  keyPathArray

isPlainObject = (value) ->
  _.isObject(value) and not _.isArray(value)

plus =
  adviseBefore: (object, methodName, advice) ->
    original = object[methodName]
    object[methodName] = (args...) ->
      unless advice.apply(this, args) == false
        original.apply(this, args)

  camelize: (string) ->
    if string
      string.replace /[_-]+(\w)/g, (m) -> m[1].toUpperCase()
    else
      ''

  capitalize: (word) ->
    return '' unless word

    if word.toLowerCase() is 'github'
      'GitHub'
    else
      word[0].toUpperCase() + word[1..]

  compactObject: (object) ->
    newObject = {}
    for key, value of object
      newObject[key] = value if value?
    newObject

  dasherize: (string) ->
    return '' unless string

    string = string[0].toLowerCase() + string[1..]
    string.replace /([A-Z])|(_)/g, (m, letter) ->
      if letter
        "-" + letter.toLowerCase()
      else
        "-"

  # Deep clones the given JSON object.
  #
  # `object` - The JSON object to clone.
  #
  # Returns a deep clone of the JSON object.
  deepClone: (object) ->
    if _.isArray(object)
      object.map (value) -> plus.deepClone(value)
    else if _.isObject(object) and not _.isFunction(object)
      plus.mapObject object, (key, value) => [key, plus.deepClone(value)]
    else
      object

  deepExtend: (target) ->
    result = target
    i = 0
    while ++i < arguments.length
      object = arguments[i]
      if isPlainObject(result) and isPlainObject(object)
        for key in Object.keys(object)
          result[key] = plus.deepExtend(result[key], object[key])
      else
        result = plus.deepClone(object)
    result

  deepContains: (array, target) ->
    return false unless array?
    for object in array
      return true if _.isEqual(object, target)
    false

  endsWith: (string, suffix='') ->
    if string
      string.indexOf(suffix, string.length - suffix.length) isnt -1
    else
      false

  escapeAttribute: (string) ->
    if string
      string.replace(/"/g, '&quot;').replace(/\n/g, '').replace(/\\/g, '-')
    else
      ''

  escapeRegExp: (string) ->
    if string
      string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    else
      ''

  humanizeEventName: (eventName, eventDoc) ->
    [namespace, event]  = eventName.split(':')
    return plus.undasherize(namespace) unless event?

    namespaceDoc = plus.undasherize(namespace)
    eventDoc ?= plus.undasherize(event)

    "#{namespaceDoc}: #{eventDoc}"

  humanizeKey: (key, platform=process.platform) ->
    return key unless key

    modifierKeyMap = if platform is 'darwin' then macModifierKeyMap else nonMacModifierKeyMap

    if modifierKeyMap[key]
      modifierKeyMap[key]
    else if key.length == 1 and shiftKeyMap[key]?
      [modifierKeyMap.shift, shiftKeyMap[key]]
    else if key.length == 1 and key == key.toUpperCase() and key.toUpperCase() != key.toLowerCase()
      [modifierKeyMap.shift, key.toUpperCase()]
    else if key.length == 1 or /f[0-9]{1,2}/.test(key)
      key.toUpperCase()
    else
      if platform is 'darwin'
        key
      else
        plus.capitalize(key)

  # Humanize the keystroke according to platform conventions. This method
  # attempts to mirror the text the given keystroke would have if displayed in
  # a system menu.
  #
  # keystroke - A String keystroke to humanize such as `ctrl-O`.
  # platform  - An optional String platform to humanize for (default:
  #             `process.platform`).
  #
  # Returns a humanized representation of the keystroke.
  humanizeKeystroke: (keystroke, platform=process.platform) ->
    return keystroke unless keystroke

    keystrokes = keystroke.split(' ')
    humanizedKeystrokes = []
    for keystroke in keystrokes
      keys = []
      splitKeystroke = keystroke.split('-')
      for key, index in splitKeystroke
        # Check for consecutive dashes such as cmd--
        key = '-' if key is '' and splitKeystroke[index-1] is ''
        keys.push(plus.humanizeKey(key, platform)) if key

      keys = _.uniq(_.flatten(keys))
      if platform is 'darwin'
        keys = keys.join('')
      else
        keys = keys.join('+')
      humanizedKeystrokes.push(keys)

    humanizedKeystrokes.join(' ')

  isSubset: (potentialSubset, potentialSuperset) ->
    _.every potentialSubset, (element) -> _.include(potentialSuperset, element)

  losslessInvert: (hash) ->
    inverted = {}
    for key, value of hash
      inverted[value] ?= []
      inverted[value].push(key)
    inverted

  # Transform the given object into another object.
  #
  # `object` - The object to transform.
  # `iterator` -
  #   A function that takes `(key, value)` arguments and returns a
  #   `[key, value]` tuple.
  #
  # Returns a new object based with the key/values returned by the iterator.
  mapObject: (object, iterator) ->
    newObject = {}
    for key in Object.keys(object)
      [key, value] = iterator(key, object[key])
      newObject[key] = value

    newObject

  multiplyString: (string, n) ->
    finalString = ""
    i = 0
    while i < n
      finalString += string
      i++
    finalString

  pluralize: (count=0, singular, plural=singular+'s') ->
    if count is 1
      "#{count} #{singular}"
    else
      "#{count} #{plural}"

  remove: (array, element) ->
    index = array.indexOf(element)
    array.splice(index, 1) if index >= 0
    array

  setValueForKeyPath: (object, keyPath, value) ->
    keys = splitKeyPath(keyPath)
    while keys.length > 1
      key = keys.shift()
      object[key] ?= {}
      object = object[key]
    if value?
      object[keys.shift()] = value
    else
      delete object[keys.shift()]

  hasKeyPath: (object, keyPath) ->
    keys = splitKeyPath(keyPath)
    for key in keys
      return false unless object.hasOwnProperty(key)
      object = object[key]
    true

  spliceWithArray: (originalArray, start, length, insertedArray, chunkSize=100000) ->
    if insertedArray.length < chunkSize
      originalArray.splice(start, length, insertedArray...)
    else
      originalArray.splice(start, length)
      for chunkStart in [0..insertedArray.length] by chunkSize
        originalArray.splice(start + chunkStart, 0, insertedArray.slice(chunkStart, chunkStart + chunkSize)...)

  sum: (array) ->
    sum = 0
    sum += elt for elt in array
    sum

  uncamelcase: (string) ->
    return '' unless string

    result = string.replace /([A-Z])|_+/g, (match, letter='') -> " #{letter}"
    plus.capitalize(result.trim())

  undasherize: (string) ->
    if string
      string.split('-').map(plus.capitalize).join(' ')
    else
      ''

  underscore: (string) ->
    return '' unless string

    string = string[0].toLowerCase() + string[1..]
    string.replace /([A-Z])|-+/g, (match, letter='') -> "_#{letter.toLowerCase()}"

  valueForKeyPath: (object, keyPath) ->
    keys = splitKeyPath(keyPath)
    for key in keys
      object = object[key]
      return unless object?
    object

  isEqual: (a, b, aStack, bStack) ->
    if _.isArray(aStack) and _.isArray(bStack)
      isEqual(a, b, aStack, bStack)
    else
      isEqual(a, b)

  isEqualForProperties: (a, b, properties...) ->
    for property in properties
      return false unless _.isEqual(a[property], b[property])
    true

isEqual = (a, b, aStack=[], bStack=[]) ->
  return _.isEqual(a, b) if a is b
  return _.isEqual(a, b) if _.isFunction(a) or _.isFunction(b)

  stackIndex = aStack.length
  while stackIndex--
    return bStack[stackIndex] is b if aStack[stackIndex] is a
  aStack.push(a)
  bStack.push(b)

  equal = false
  if _.isFunction(a?.isEqual)
    equal = a.isEqual(b, aStack, bStack)
  else if _.isFunction(b?.isEqual)
    equal = b.isEqual(a, bStack, aStack)
  else if _.isArray(a) and _.isArray(b) and a.length is b.length
    equal = true
    for aElement, i in a
      unless isEqual(aElement, b[i], aStack, bStack)
        equal = false
        break
  else if _.isRegExp(a) and _.isRegExp(b)
    equal = _.isEqual(a, b)
  else if _.isElement(a) and _.isElement(b)
    equal = a is b
  else if _.isObject(a) and _.isObject(b)
    aCtor = a.constructor
    bCtor = b.constructor
    aCtorValid = _.isFunction(aCtor) and aCtor instanceof aCtor
    bCtorValid = _.isFunction(bCtor) and bCtor instanceof bCtor
    if aCtor isnt bCtor and not (aCtorValid and bCtorValid)
      equal = false
    else
      aKeyCount = 0
      equal = true
      for key, aValue of a
        continue unless _.has(a, key)
        aKeyCount++
        unless _.has(b, key) and isEqual(aValue, b[key], aStack, bStack)
          equal = false
          break
      if equal
        bKeyCount = 0
        for key, bValue of b
          bKeyCount++ if _.has(b, key)
        equal = aKeyCount is bKeyCount
  else
    equal = _.isEqual(a, b)

  aStack.pop()
  bStack.pop()
  equal

module.exports = _.extend({}, _, plus)
