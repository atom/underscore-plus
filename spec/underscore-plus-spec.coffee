_ = require '../src/underscore-plus'

describe "underscore extensions", ->
  describe "::adviseBefore(object, methodName, advice)", ->
    [object, calls] = []

    beforeEach ->
      calls = []
      object = {
        method: (args...) ->
          calls.push(["original", this, args])
      }

    it "calls the given function before the advised method", ->
      _.adviseBefore object, 'method', (args...) -> calls.push(["advice", this, args])
      object.method(1, 2, 3)
      expect(calls).toEqual [['advice', object, [1, 2, 3]], ['original', object, [1, 2, 3]]]

    it "cancels the original method's invocation if the advice returns true", ->
      _.adviseBefore object, 'method', -> false
      object.method(1, 2, 3)
      expect(calls).toEqual []

  describe "::endsWith(string, ending)", ->
    it "returns whether the given string ends with the given suffix", ->
      expect(_.endsWith("test.txt", ".txt")).toBeTruthy()
      expect(_.endsWith("test.txt", "txt")).toBeTruthy()
      expect(_.endsWith("test.txt", "test.txt")).toBeTruthy()
      expect(_.endsWith("test.txt", "")).toBeTruthy()
      expect(_.endsWith("test.txt", ".txt2")).toBeFalsy()
      expect(_.endsWith("test.txt", ".tx")).toBeFalsy()
      expect(_.endsWith("test.txt", "test")).toBeFalsy()

  describe "::camelize(string)", ->
    it "converts `string` to camel case", ->
      expect(_.camelize("corey_dale_johnson")).toBe "coreyDaleJohnson"
      expect(_.camelize("corey-dale-johnson")).toBe "coreyDaleJohnson"
      expect(_.camelize("corey_dale-johnson")).toBe "coreyDaleJohnson"
      expect(_.camelize("coreyDaleJohnson")).toBe "coreyDaleJohnson"
      expect(_.camelize("CoreyDaleJohnson")).toBe "CoreyDaleJohnson"

  describe "::dasherize(string)", ->
    it "converts `string` to use dashes", ->
      expect(_.dasherize("corey_dale_johnson")).toBe "corey-dale-johnson"
      expect(_.dasherize("coreyDaleJohnson")).toBe "corey-dale-johnson"
      expect(_.dasherize("CoreyDaleJohnson")).toBe "corey-dale-johnson"
      expect(_.dasherize("corey-dale-johnson")).toBe "corey-dale-johnson"

  describe "::underscore(string)", ->
    it "converts `string` to use underscores", ->
      expect(_.underscore('')).toBe ''
      expect(_.underscore(null)).toBe ''
      expect(_.underscore()).toBe ''
      expect(_.underscore('a_b')).toBe 'a_b'
      expect(_.underscore('A_b')).toBe 'a_b'
      expect(_.underscore('a-b')).toBe 'a_b'
      expect(_.underscore('TheOffice')).toBe 'the_office'
      expect(_.underscore('theOffice')).toBe 'the_office'
      expect(_.underscore('test')).toBe 'test'
      expect(_.underscore(' test ')).toBe ' test '
      expect(_.underscore('--ParksAndRec')).toBe '__parks_and_rec'
      expect(_.underscore("corey-dale-johnson")).toBe "corey_dale_johnson"
      expect(_.underscore("coreyDaleJohnson")).toBe "corey_dale_johnson"
      expect(_.underscore("CoreyDaleJohnson")).toBe "corey_dale_johnson"
      expect(_.underscore("corey_dale_johnson")).toBe "corey_dale_johnson"

  describe "::spliceWithArray(originalArray, start, length, insertedArray, chunkSize)", ->
    describe "when the inserted array is smaller than the chunk size", ->
      it "splices the array in place", ->
        array = ['a', 'b', 'c']
        _.spliceWithArray(array, 1, 1, ['v', 'w', 'x', 'y', 'z'], 100)
        expect(array).toEqual ['a', 'v', 'w', 'x', 'y', 'z', 'c']

    describe "when the inserted array is larger than the chunk size", ->
      it "splices the array in place one chunk at a time (to avoid stack overflows)", ->
        array = ['a', 'b', 'c']
        _.spliceWithArray(array, 1, 1, ['v', 'w', 'x', 'y', 'z'], 2)
        expect(array).toEqual ['a', 'v', 'w', 'x', 'y', 'z', 'c']

  describe "::humanizeEventName(eventName)", ->
    describe "when no namespace exists", ->
      it "undasherizes and capitalizes the event name", ->
        expect(_.humanizeEventName('nonamespace')).toBe 'Nonamespace'
        expect(_.humanizeEventName('no-name-space')).toBe 'No Name Space'

    describe "when a namespaces exists", ->
      it "space separates the undasherized/capitalized versions of the namespace and event name", ->
        expect(_.humanizeEventName('space:final-frontier')).toBe 'Space: Final Frontier'
        expect(_.humanizeEventName('star-trek:the-next-generation')).toBe 'Star Trek: The Next Generation'

  describe "::humanizeKeystroke(keystroke)", ->
    it "replaces single keystroke", ->
      expect(_.humanizeKeystroke('cmd-O', 'darwin')).toEqual '⌘⇧O'
      expect(_.humanizeKeystroke('cmd-O', 'linux')).toEqual 'Cmd+Shift+O'

      expect(_.humanizeKeystroke('cmd-shift-up', 'darwin')).toEqual '⌘⇧↑'
      expect(_.humanizeKeystroke('cmd-shift-up', 'linux')).toEqual 'Cmd+Shift+Up'

      expect(_.humanizeKeystroke('cmd-option-down', 'darwin')).toEqual '⌘⌥↓'
      expect(_.humanizeKeystroke('cmd-option-down', 'linux')).toEqual 'Cmd+Alt+Down'

      expect(_.humanizeKeystroke('cmd-option-left', 'darwin')).toEqual '⌘⌥←'
      expect(_.humanizeKeystroke('cmd-option-left', 'linux')).toEqual 'Cmd+Alt+Left'

      expect(_.humanizeKeystroke('cmd-option-right', 'darwin')).toEqual '⌘⌥→'
      expect(_.humanizeKeystroke('cmd-option-right', 'linux')).toEqual 'Cmd+Alt+Right'

      expect(_.humanizeKeystroke('cmd-o', 'darwin')).toEqual '⌘O'
      expect(_.humanizeKeystroke('cmd-o', 'linux')).toEqual 'Cmd+O'

      expect(_.humanizeKeystroke('ctrl-2', 'darwin')).toEqual '⌃2'
      expect(_.humanizeKeystroke('ctrl-2', 'linux')).toEqual 'Ctrl+2'

      expect(_.humanizeKeystroke('cmd-space', 'darwin')).toEqual '⌘space'
      expect(_.humanizeKeystroke('cmd-space', 'linux')).toEqual 'Cmd+Space'

      expect(_.humanizeKeystroke('cmd-|', 'darwin')).toEqual '⌘⇧\\'
      expect(_.humanizeKeystroke('cmd-|', 'linux')).toEqual 'Cmd+Shift+\\'

      expect(_.humanizeKeystroke('cmd-}', 'darwin')).toEqual '⌘⇧]'
      expect(_.humanizeKeystroke('cmd-}', 'linux')).toEqual 'Cmd+Shift+]'

      expect(_.humanizeKeystroke('cmd--', 'darwin')).toEqual '⌘-'
      expect(_.humanizeKeystroke('cmd--', 'linux')).toEqual 'Cmd+-'

    it "correctly replaces keystrokes with shift and capital letter", ->
      expect(_.humanizeKeystroke('cmd-shift-P', 'darwin')).toEqual '⌘⇧P'
      expect(_.humanizeKeystroke('cmd-shift-P', 'linux')).toEqual 'Cmd+Shift+P'

    it "replaces multiple keystrokes", ->
      expect(_.humanizeKeystroke('cmd-O cmd-n', 'darwin')).toEqual '⌘⇧O ⌘N'
      expect(_.humanizeKeystroke('cmd-O cmd-n', 'linux')).toEqual 'Cmd+Shift+O Cmd+N'

      expect(_.humanizeKeystroke('cmd-shift-- cmd-n', 'darwin')).toEqual '⌘⇧- ⌘N'
      expect(_.humanizeKeystroke('cmd-shift-- cmd-n', 'linux')).toEqual 'Cmd+Shift+- Cmd+N'

      expect(_.humanizeKeystroke('cmd-k right', 'darwin')).toEqual '⌘K →'
      expect(_.humanizeKeystroke('cmd-k right', 'linux')).toEqual 'Cmd+K Right'

    it "formats function keys", ->
      expect(_.humanizeKeystroke('cmd-f2', 'darwin')).toEqual '⌘F2'
      expect(_.humanizeKeystroke('cmd-f2', 'linux')).toEqual 'Cmd+F2'

    it "handles junk input", ->
      expect(_.humanizeKeystroke()).toEqual undefined
      expect(_.humanizeKeystroke(null)).toEqual null
      expect(_.humanizeKeystroke('')).toEqual ''

  describe "::deepExtend(objects...)", ->
    it "copies all key/values from each object onto the target", ->
      first =
        things:
          string: "oh"
          boolean: false
          anotherArray: ['a', 'b', 'c']
          object:
            first: 1
            second: 2

      second =
        things:
          string: "cool"
          array: [1,2,3]
          anotherArray: ['aa', 'bb', 'cc']
          object:
            first: 1
          newObject:
            first: 'one'

      result = _.deepExtend(first, second)

      expect(result).toBe(first)
      expect(result).toEqual
        things:
          string: "cool"
          boolean: false
          array: [1,2,3]
          anotherArray: ['aa', 'bb', 'cc']
          object:
            first: 1
            second: 2
          newObject:
            first: 'one'
      expect(result.things.newObject).not.toBe(second.things.newObject)

    it "prefers values from later objects over those from earlier objects", ->
      first =
        things: {string: 'oh'}
        otherThings: ['one', 'two']

      second =
        things: false
        otherThings: null

      expect(_.deepExtend(first, second)).toEqual
        things: false
        otherThings: null

    it "overrides objects with scalar values", ->
      expect(_.deepExtend({a: {b: "c"}}, {a: "d"})).toEqual {a: "d"}
      expect(_.deepExtend({a: {b: "c"}}, {a: "d"}, {a: {e: "f"}})).toEqual {a: {e: "f"}}
      expect(_.deepExtend({a: {b: "c"}}, {a: "d"}, {a: "e"})).toEqual {a: "e"}

  describe "::deepContains(array, target)", ->
    subject = null
    beforeEach ->
      subject = [{one: 1, two: {three: 3}}, {four: 4, five: {six: 6}}, 'omgkittens']

    it "returns true for a matching object in the array", ->
      expect(_.deepContains(subject, {four: 4, five: {six: 6}})).toBe true
      expect(_.deepContains(subject, 'omgkittens')).toBe true

    it "returns false when it does not find a match in the array", ->
      expect(_.deepContains(subject, {four: 4, five: {six: 7}})).toBe false
      expect(_.deepContains(subject, 'nope')).toBe false

  describe "::isSubset(potentialSubset, potentialSuperset)", ->
    it "returns whether the first argument is a subset of the second", ->
      expect(_.isSubset([1, 2], [1, 2])).toBeTruthy()
      expect(_.isSubset([1, 2], [1, 2, 3])).toBeTruthy()
      expect(_.isSubset([], [1])).toBeTruthy()
      expect(_.isSubset([], [])).toBeTruthy()
      expect(_.isSubset([1, 2], [2, 3])).toBeFalsy()

  describe '::isEqual(a, b)', ->
    it 'returns true when the elements are equal, false otherwise', ->
      expect(_.isEqual(null, null)).toBe true
      expect(_.isEqual('test', 'test')).toBe true
      expect(_.isEqual(3, 3)).toBe true
      expect(_.isEqual({a: 'b'}, {a: 'b'})).toBe true
      expect(_.isEqual([1, 'a'], [1, 'a'])).toBe true

      expect(_.isEqual(null, 'test')).toBe false
      expect(_.isEqual(3, 4)).toBe false
      expect(_.isEqual({a: 'b'}, {a: 'c'})).toBe false
      expect(_.isEqual({a: 'b'}, {a: 'b', c: 'd'})).toBe false
      expect(_.isEqual([1, 'a'], [2])).toBe false
      expect(_.isEqual([1, 'a'], [1, 'b'])).toBe false

      a = isEqual: (other) -> other is b
      b = isEqual: (other) -> other is 'test'
      expect(_.isEqual(a, null)).toBe false
      expect(_.isEqual(a, 'test')).toBe false
      expect(_.isEqual(a, b)).toBe true
      expect(_.isEqual(null, b)).toBe false
      expect(_.isEqual('test', b)).toBe true

      expect(_.isEqual(/a/, /a/g)).toBe false
      expect(_.isEqual(/a/, /b/)).toBe false
      expect(_.isEqual(/a/gi, /a/gi)).toBe true

      # Simulate DOM element comparison
      domElement1 = {nodeType: 1, a: 2}
      domElement2 = {nodeType: 1, a: 2}
      expect(_.isEqual(domElement1, domElement2)).toBe false
      expect(_.isEqual(domElement2, domElement1)).toBe false
      expect(_.isEqual(domElement1, domElement1)).toBe true
      expect(_.isEqual(domElement2, domElement2)).toBe true

    it "calls custom equality methods with stacks so they can participate in cycle-detection", ->
      class X
        isEqual: (b, aStack, bStack) ->
          _.isEqual(@y, b.y, aStack, bStack)

      class Y
        isEqual: (b, aStack, bStack) ->
          _.isEqual(@x, b.x, aStack, bStack)

      x1 = new X
      y1 = new Y
      x1.y = y1
      y1.x = x1

      x2 = new X
      y2 = new Y
      x2.y = y2
      y2.x = x2

      expect(_.isEqual(x1, x2)).toBe true

    it "only accepts arrays as stack arguments to avoid accidentally calling with other objects", ->
      expect(-> _.isEqual({}, {}, "junk")).not.toThrow()
      expect(-> _.isEqual({}, {}, [], "junk")).not.toThrow()

  describe "::isEqualForProperties(a, b, properties...)", ->
    it "compares two objects for equality using just the specified properties", ->
      expect(_.isEqualForProperties({a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 4}, 'a', 'b')).toBe true
      expect(_.isEqualForProperties({a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 4}, 'a', 'c')).toBe false

  describe "::capitalize(word)", ->
    it "capitalizes the word", ->
      expect(_.capitalize('')).toBe ''
      expect(_.capitalize(null)).toBe ''
      expect(_.capitalize()).toBe ''
      expect(_.capitalize('Github')).toBe 'GitHub'
      expect(_.capitalize('test')).toBe 'Test'

  describe "::dasherize(word)", ->
    it "dasherizes the word", ->
      expect(_.dasherize('')).toBe ''
      expect(_.dasherize(null)).toBe ''
      expect(_.dasherize()).toBe ''
      expect(_.dasherize('a_b')).toBe 'a-b'
      expect(_.dasherize('test')).toBe 'test'

  describe "::uncamelcase(string)", ->
    it "uncamelcases the string", ->
      expect(_.uncamelcase('')).toBe ''
      expect(_.uncamelcase(null)).toBe ''
      expect(_.uncamelcase()).toBe ''
      expect(_.uncamelcase('a_b')).toBe 'A b'
      expect(_.uncamelcase('TheOffice')).toBe 'The Office'
      expect(_.uncamelcase('theOffice')).toBe 'The Office'
      expect(_.uncamelcase('test')).toBe 'Test'
      expect(_.uncamelcase(' test ')).toBe 'Test'
      expect(_.uncamelcase('__ParksAndRec')).toBe 'Parks And Rec'

  describe "::valueForKeyPath(object, keyPath)", ->
    it "retrieves the value at the given key path or undefined if none exists", ->
      object = {a: b: c: 2}
      expect(_.valueForKeyPath(object, 'a.b.c')).toBe 2
      expect(_.valueForKeyPath(object, 'a.b')).toEqual {c: 2}
      expect(_.valueForKeyPath(object, 'a.x')).toBeUndefined()

    it "retrieves the value at the when the key contains a dot", ->
      object = {a: b: 'c\\.d': 2}
      expect(_.valueForKeyPath(object, 'a.b.c\\.d')).toBe 2
      expect(_.valueForKeyPath(object, 'a.b')).toEqual {'c\\.d': 2}
      expect(_.valueForKeyPath(object, 'a.x')).toBeUndefined()

    it "returns the object when no key path is given", ->
      object = {a: b: 'c\\.d': 2}
      expect(_.valueForKeyPath(object, null)).toBe(object)
      expect(_.valueForKeyPath(object)).toBe(object)

  describe "::setValueForKeyPath(object, keyPath, value)", ->
    it "assigns a value at the given key path, creating intermediate objects if needed", ->
      object = {}
      _.setValueForKeyPath(object, 'a.b.c', 1)
      _.setValueForKeyPath(object, 'd', 2)
      expect(object).toEqual {a: {b: c: 1}, d: 2}

    it "assigns a value at the given key path when the key has a dot in it", ->
      object = {}
      _.setValueForKeyPath(object, 'a.b.c', 1)
      _.setValueForKeyPath(object, 'd\\.e', 2)
      expect(object).toEqual {a: {b: c: 1}, 'd\\.e': 2}

  describe "::hasKeyPath(object, keyPath)", ->
    it "determines whether the given object has properties along the given key path", ->
      object =
        a:
          b:
            c: 2
          'd\\.e': 3
      expect(_.hasKeyPath(object, 'a')).toBe true
      expect(_.hasKeyPath(object, 'a.b.c')).toBe true
      expect(_.hasKeyPath(object, 'a.b.c.d')).toBe false
      expect(_.hasKeyPath(object, 'a.x')).toBe false
      expect(_.hasKeyPath(object, 'a.d\\.e')).toBe true

  describe "deepClone(object)", ->
    it "clones nested object", ->
      object =
        a:
          b: 'test'
          c:
            d: -> console.log('hi')
          e: 3
          f: [4, 'abc']

      expect(_.deepClone(object)).toEqual object
