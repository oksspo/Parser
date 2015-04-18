define (require) ->
  Patterns = require 'SQL_Engine/SQL_ParserCore'

  describe 'ParserCore', ->
    hello = Patterns.txt 'hello'

    it 'should be difined', ->
      expect(Patterns).toBeDefined()

    describe 'txt', ->
      it 'should be a function', ->
        expect(Patterns.txt).toEqual jasmine.any(Function)

      it 'should read predefined text', ->
        expect(hello.exec('hello', 0)).toEqual
          res: 'hello',
          end: 5

      it 'should return undefined when text does not match', ->
        expect(hello.exec('gghgjk', 0)).toBeUndefined()

      it 'should read from the specified position', ->
        expect(hello.exec('gghhello', 3)).toEqual
        res: 'hello',
        end: 8

    describe 'rgx', ->
      it 'should be a function', ->
        expect(Patterns.rgx).toEqual jasmine.any(Function)

      it 'should return undefined when rgx does not match', ->
        expect(Patterns.rgx(/\d+/).exec "hello world", 0).toBeUndefined()

      it 'should read from the specified position', =>
        expect(Patterns.rgx(/hello/).exec 'world hello', 6).toEqual
        res: 'hello'
        end: 11

    describe 'opt', ->
      it 'should be a function', ->
        expect(Patterns.opt).toEqual jasmine.any(Function)

      it 'should make pattern optional', ->
        select = Patterns.txt 'SELECT'
        optSelect = Patterns.opt(select)

        expect(optSelect.exec 'SELECT * FROM').toEqual
        res: 'SELECT'
        end: 6

        expect(optSelect.exec 'SECT * FROM').toEqual
        res: undefined
        end: 0

    describe 'exc', ->
      pattern = Patterns.rgx (/\d+/)
      except = Patterns.txt '23'

      it 'should be a function', ->
        expect(Patterns.exc).toEqual jasmine.any(Function)

      it 'should parse pattern and does not parse second', ->
        expect(Patterns.exc(pattern, except).exec('134', 0)).toEqual
          res: '134',
          end: 3

      it 'should return undefined when second pattern parses', ->
        expect(Patterns.exc(pattern, except).exec('23', 0)).toBeUndefined()

    describe 'any', ->
      firstPattern = Patterns.txt 'INNER JOIN'
      secondPattern = Patterns.txt 'LEFT JOIN'

      it 'should be a function', ->
        expect(Patterns.any).toEqual jasmine.any(Function)

      it 'should parse any pattern', ->
        expect(Patterns.any(firstPattern, secondPattern).exec('INNER JOIN', 0)).toEqual
          res: 'INNER JOIN',
          end: 10

        expect(Patterns.any(firstPattern, secondPattern).exec('LEFT JOIN', 0)).toEqual
          res: 'LEFT JOIN',
          end: 9

      it 'should return undefined when any of patterns does not parses', ->
        expect(Patterns.any(firstPattern, secondPattern).exec('CROSS JOIN', 0)).toBeUndefined()

    describe 'seq', ->
      firstPattern = Patterns.txt 'SELECT'
      secondPattern = Patterns.txt '*'
      thirdPattern = Patterns.txt 'FROM'

      it 'should be a function', ->
        expect(Patterns.seq).toEqual jasmine.any(Function)

      it 'should parse queue of patterns', ->
        expect(Patterns.seq(firstPattern, secondPattern, thirdPattern).exec('SELECT*FROM', 0)).toEqual
          res: ['SELECT', '*', 'FROM']
          end: 11

      it 'should return undefined when any of patterns does not parses', ->
        expect(Patterns.seq(firstPattern, secondPattern, thirdPattern).exec('SELECT*FR', 0)).toBeUndefined()

    describe 'rep', ->
      firstPattern = Patterns.rgx (/\d+/)
      secondPattern = Patterns.txt ','

      it 'should be a function', ->
        expect(Patterns.rep).toEqual jasmine.any(Function)

      it 'should parse first pattern excluding the result of the second', ->
        expect(Patterns.rep(firstPattern, secondPattern).exec('1,2,3', 0)).toEqual
          res: ['1', '2', '3']
          end: 5

      it 'should return result of first pattern if second does not parses', ->
        expect(Patterns.rep(firstPattern, secondPattern).exec('1234', 0)).toEqual
          res: ['1234']
          end: 4

      it 'should return undefined when any of patterns does not parses', ->
        expect(Patterns.rep(firstPattern, secondPattern).exec('s,s,s,s', 0)).toBeUndefined()
        expect(Patterns.rep(firstPattern, secondPattern).exec('sss', 0)).toBeUndefined()

