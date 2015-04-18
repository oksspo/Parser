define (require) ->
  DB = require 'SQL_Engine/SQL_Db'

  describe 'SQL_DB', ->
    it 'should be defined', ->
      expect(DB).toBeDefined()

    it 'should have get table', ->
      db = new DB()
      expect(db.getTable).toBeDefined()

    it 'should transform table', ->
      stub = {
        movie: [
          {
            id: 1,
            title: "The A-Team",
            year: 2010,
            directorID: 1
          }
        ]
      }
      db = new DB(stub)
      expect(db.transformTable(stub, 'movie')).toEqual
        movie: [{
          movie: {
            'id': 1,
            'title': "The A-Team",
            'year': 2010,
            'directorID': 1
          }
        }]

    it 'should return table', ->
      stub = {
        movie: [
          {
            id: 1,
            title: "The A-Team",
            year: 2010,
            directorID: 1
          }
        ],
        director: [
          {
            "id": 1,
            "name": "Joe Carnahan"
          }
          ]
      }
      db = new DB(stub)
      expect(db.getTable('movie')).toEqual
        movie: [{
            movie: {
              'id': 1,
              'title': "The A-Team",
              'year': 2010,
              'directorID': 1
            }
        }]

    it 'should return all tables', ->
      stub = {
        movie: [
          {
            id: 1,
            title: "The A-Team",
            year: 2010,
            directorID: 1
          }
        ],
        director: [
          {
            "id": 1,
            "name": "Joe Carnahan"
          },
          {
            "id": 2,
            "name": "Joe Carnahan"
          }
        ]
      }
      db = new DB(stub)
      expect(db.getAllTables()).toEqual
        movie: [
          {
            movie: {
              'id': 1,
              'title': "The A-Team",
              'year': 2010,
              'directorID': 1
            }
          }
        ],
        director: [
          {
            director: {
              "id": 1,
              "name": "Joe Carnahan"
            }
          },
          {
            director: {
              "id": 2,
              "name": "Joe Carnahan"
            }
          }
        ]




