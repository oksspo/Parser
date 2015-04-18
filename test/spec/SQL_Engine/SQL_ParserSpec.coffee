define (require) =>
  Parser = require "SQL_Engine/SQL_Parser"

  describe "SQL_Parser", ->
    parser = null
    beforeEach ->
      parser = new Parser()

    it "should be defined", ->
      expect(Parser).toBeDefined()

    it 'should have parse method', ->
        expect(parser.parse).toEqual jasmine.any(Function)

    describe 'SELECT', ->
      it 'should be able to parse simple select query', ->
        result = parser.parse 'SELECT * FROM users'
        expect(result).toEqual
          select:
            columns: '*'
            from: 'users'

      it 'should be able to parse simple select query with specified property', ->
        result = parser.parse 'SELECT users.name FROM users'
        expect(result).toEqual
            select:
              columns: [
                {
                  table: 'users'
                  column: 'name'
                }
              ]
              from: 'users'

      it 'should be able to parse simple select query with a list of fields', ->
        result = parser.parse 'SELECT movies.title, movies.id FROM movies'
        expect(result).toEqual
          select:
            columns: [
              {
                table: 'movies'
                column: 'title'
              },
              {
                table: 'movies'
                column: 'id'
              }
            ]
            from: 'movies'

    describe 'JOIN', ->
      it 'should be able parse simple JOIN section', ->
        result = parser.parse 'JOIN movies ON users.id = movies.userID'
        expect(result).toEqual
          join: [
            {
              table: 'movies'
              columns:
                left:
                  table: 'users'
                  column: 'id'
                right:
                  table: 'movies'
                  column: 'userID'
            }
          ]

      it 'should be able parse multiple join operation', ->
        result = parser.parse '''
          JOIN movies ON users.id = movies.userID
          JOIN actors ON actors.id = movies.actorID
        '''

        expect(result).toEqual
          join: [
            {
              table: 'movies'
              columns:
                left:
                  table: 'users'
                  column: 'id'
                right:
                  table: 'movies'
                  column: 'userID'
            },
            {
              table: 'actors'
              columns:
                left:
                  table: 'actors'
                  column: 'id'
                right:
                  table: 'movies'
                  column: 'actorID'
            }
          ]

    describe 'WHERE', ->
      it 'should be able to parse WHERE', ->
        for comparator in ['>=', '<=', '>', '<', '<>', '=']
          result = parser.parse "WHERE movies.id #{comparator} users.moviesID"
          expect(result).toEqual
            where:
              left:
                table: 'movies'
                column: 'id'
              right:
                table: 'users'
                column: 'moviesID'
              operand: comparator

      it 'should be able to parse WHERE and compare numbers, strings, boolean', ->
        result = parser.parse "WHERE movies.id = 5"
        expect(result).toEqual
          where:
            left:
              table: 'movies'
              column: 'id'
            right: '5'
            operand: '='

    describe 'complex query', ->
      it 'should be able to parse complex query', ->
        result = parser.parse '''
          SELECT movies.title, movies.id
          FROM movies
          JOIN movies ON users.id= movies.userID
          JOIN actors ON actors.id = movies.actorID
          WHERE movies.id <= users.movieID
        '''

        expect(result).toEqual
          select:
            columns: [
              {
                table: 'movies'
                column: 'title'
              },
              {
                table: 'movies'
                column: 'id'
              }
            ]
            from: 'movies'
          join: [
            {
              table: 'movies'
              columns:
                left:
                  table: 'users'
                  column: 'id'
                right:
                  table: 'movies'
                  column: 'userID'
            },
            {
              table: 'actors'
              columns:
                left:
                  table: 'actors'
                  column: 'id'
                right:
                  table: 'movies'
                  column: 'actorID'
            }
          ]
          where:
            left:
              table: 'movies'
              column: 'id'
            right:
              table: 'users'
              column: 'movieID'
            operand: '<='

