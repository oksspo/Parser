// Generated by CoffeeScript 1.9.1
(function() {
  define(function(require) {
    var DB;
    DB = require('SQL_Engine/SQL_Db');
    return describe('SQL_DB', function() {
      it('should be defined', function() {
        return expect(DB).toBeDefined();
      });
      it('should have get table', function() {
        var db;
        db = new DB();
        return expect(db.getTable).toBeDefined();
      });
      it('should transform table', function() {
        var db, stub;
        stub = {
          movie: [
            {
              id: 1,
              title: "The A-Team",
              year: 2010,
              directorID: 1
            }
          ]
        };
        db = new DB(stub);
        return expect(db.transformTable(stub, 'movie')).toEqual({
          movie: [
            {
              movie: {
                'id': 1,
                'title': "The A-Team",
                'year': 2010,
                'directorID': 1
              }
            }
          ]
        });
      });
      it('should return table', function() {
        var db, stub;
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
        };
        db = new DB(stub);
        return expect(db.getTable('movie')).toEqual({
          movie: [
            {
              movie: {
                'id': 1,
                'title': "The A-Team",
                'year': 2010,
                'directorID': 1
              }
            }
          ]
        });
      });
      return it('should return all tables', function() {
        var db, stub;
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
            }, {
              "id": 2,
              "name": "Joe Carnahan"
            }
          ]
        };
        db = new DB(stub);
        return expect(db.getAllTables()).toEqual({
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
            }, {
              director: {
                "id": 2,
                "name": "Joe Carnahan"
              }
            }
          ]
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=SQL_DBSpec.js.map