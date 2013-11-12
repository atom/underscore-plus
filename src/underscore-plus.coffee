_ = require 'underscore'
isEqual = require 'tantamount'

plus =
  adviseBefore: (object, methodName, advice) ->
    original = object[methodName]
    object[methodName] = (args...) ->
      unless advice.apply(this, args) == false
        original.apply(this, args)

  camelize: (string) ->
    string.replace /[_-]+(\w)/g, (m) -> m[1].toUpperCase()

  capitalize: (word) ->
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
    string = string[0].toLowerCase() + string[1..]
    string.replace /([A-Z])|(_)/g, (m, letter, underscore) ->
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

  endsWith: (string, suffix) ->
    string.indexOf(suffix, string.length - suffix.length) isnt -1

  escapeAttribute: (string) ->
    string.replace(/"/g, '&quot;').replace(/\n/g, '').replace(/\\/g, '-')

  escapeRegExp: (string) ->
    string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

  humanizeEventName: (eventName, eventDoc) ->
    [namespace, event]  = eventName.split(':')
    return plus.undasherize(namespace) unless event?

    namespaceDoc = plus.undasherize(namespace)
    eventDoc ?= plus.undasherize(event)

    "#{namespaceDoc}: #{eventDoc}"

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
    result = string.replace /([A-Z])|(_)/g, (m, letter, underscore) -> " " + letter
    plus.capitalize(result)

  undasherize: (string) ->
    string.split('-').map(plus.capitalize).join(' ')

  underscore: (string) ->
    string = string[0].toLowerCase() + string[1..]
    string.replace /([A-Z])|(-)/g, (m, letter, dash) ->
      if letter
        "_" + letter.toLowerCase()
      else
        "_"

  valueForKeyPath: (object, keyPath) ->
    keys = keyPath.split('.')
    for key in keys
      object = object[key]
      return unless object?
    object

module.exports = _.extend({}, _, plus, {isEqual})
