_ = require 'underscore'

modifierKeyMap =
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
    else if _.isObject(object)
      plus.mapObject object, (key, value) => [key, plus.deepClone(value)]
    else
      object

  deepExtend: (objects...) ->
    result = {}
    for object in objects
      for key, value of object
        if _.isObject(value) and not _.isArray(value)
          result[key] = plus.deepExtend(result[key], value)
        else
          result[key] ?= value

    result

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

  humanizeKey: (key) ->
    return key unless key
    if modifierKeyMap[key]
      modifierKeyMap[key]
    else if key.length == 1 and shiftKeyMap[key]?
      [modifierKeyMap.shift, shiftKeyMap[key]]
    else if key.length == 1 and key == key.toUpperCase() and key.toUpperCase() != key.toLowerCase()
      [modifierKeyMap.shift, key.toUpperCase()]
    else if key.length == 1 or /f[0-9]{1,2}/.test(key)
      key.toUpperCase()
    else
      key

  humanizeKeystroke: (keystroke) ->
    return keystroke unless keystroke
    keystrokes = keystroke.split(' ')
    humanizedKeystrokes = []
    for keystroke in keystrokes
      keys = keystroke.split('-')
      keys = _.flatten(plus.humanizeKey(key) for key in keys)
      humanizedKeystrokes.push(_.uniq(keys).join(''))
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
    for key, value of object
      [key, value] = iterator(key, value)
      newObject[key] = value

    newObject

  multiplyString: (string, n) ->
    new Array(1 + n).join(string)

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
    keys = keyPath.split('.')
    while keys.length > 1
      key = keys.shift()
      object[key] ?= {}
      object = object[key]
    if value?
      object[keys.shift()] = value
    else
      delete object[keys.shift()]

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
    keys = keyPath.split('.')
    for key in keys
      object = object[key]
      return unless object?
    object

  isEqual: (a, b, aStack, bStack) ->
    if _.isArray(aStack) and _.isArray(bStack)
      isEqual(a, b, aStack, bStack)
    else
      isEqual(a, b)

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
