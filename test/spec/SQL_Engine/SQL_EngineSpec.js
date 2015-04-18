// Generated by CoffeeScript 1.9.1
(function() {
  define(function(require) {
    var Engine;
    Engine = require('SQL_Engine/SQL_Engine');
    return describe('SQL_Engine', function() {
      var engine, stub, transformedStub;
      engine = new Engine;
      stub = {};
      transformedStub = {};
      beforeEach(function() {
        stub = {
          movie: [
            {
              id: 1,
              title: "The A-Team",
              year: 2010,
              directorID: 1
            }, {
              id: 2,
              title: "Avatar",
              year: 2009,
              directorID: 2
            }
          ],
          director: [
            {
              id: 1,
              name: "Joe Carnahan"
            }, {
              id: 2,
              name: "James Cameron"
            }, {
              id: 3,
              name: "Joss Whedon"
            }, {
              id: 4,
              name: "Shane Black"
            }
          ]
        };
        return transformedStub = {
          movie: [
            {
              movie: {
                id: 1,
                title: "The A-Team",
                year: 2010,
                directorID: 1
              }
            }, {
              movie: {
                id: 2,
                title: "Avatar",
                year: 2009,
                directorID: 2
              }
            }
          ],
          director: [
            {
              director: {
                id: 1,
                name: "Joe Carnahan"
              }
            }, {
              director: {
                id: 2,
                name: "James Cameron"
              }
            }, {
              director: {
                id: 3,
                name: "Joss Whedon"
              }
            }, {
              director: {
                id: 4,
                name: "Shane Black"
              }
            }
          ]
        };
      });
      it('should be defined', function() {
        return expect(Engine).toBeDefined();
      });
      it('should set DB', function() {
        return expect(engine.setDb(stub)).toEqual(transformedStub);
      });
      it('should throw error if entered field is empty', function() {
        return expect(function() {
          return engine.execute('');
        }).toThrow(new Error("You try parse empty query. It's bad idea. Please try again"));
      });
      it("should throw error if parser can't parse query", function() {
        return expect(function() {
          return engine.execute('Azazaza');
        }).toThrow(new Error("It seems that you have incorrectly entered query. I can't parse it, please try again"));
      });
      it("should throw error if parser parse query but in DB no such records", function() {
        return expect(function() {
          return engine.execute('SELECT * FROM students');
        }).toThrow(new Error("Sorry, we did not find such records in data base."));
      });
      it('should join tables', function() {
        var join;
        join = [
          {
            table: 'movie',
            columns: {
              left: {
                table: 'movie',
                column: 'directorID'
              },
              right: {
                table: 'director',
                column: 'id'
              }
            }
          }
        ];
        return expect(engine.join(join, transformedStub)).toEqual({
          movie: [
            {
              movie: {
                'id': 1,
                'title': "The A-Team",
                'year': 2010,
                'directorID': 1
              },
              director: {
                'id': 1,
                'name': "Joe Carnahan"
              }
            }, {
              movie: {
                'id': 2,
                'title': "Avatar",
                'year': 2009,
                'directorID': 2
              },
              director: {
                'id': 2,
                'name': "James Cameron"
              }
            }
          ]
        });
      });
      it('should compare cells tables with constant', function() {
        var where;
        where = {
          left: {
            table: 'movie',
            column: 'year'
          },
          right: '2010',
          operand: '='
        };
        return expect(engine.where(where, transformedStub)).toEqual({
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
      it('should compare cells tables', function() {
        var where;
        where = {
          left: {
            table: 'movie',
            column: 'directorID'
          },
          right: {
            table: 'director',
            column: 'id'
          },
          operand: '='
        };
        return expect(engine.where(where, transformedStub)).toEqual({
          movie: [
            {
              movie: {
                'id': 1,
                'title': "The A-Team",
                'year': 2010,
                'directorID': 1
              }
            }, {
              movie: {
                'id': 2,
                'title': "Avatar",
                'year': 2009,
                'directorID': 2
              }
            }
          ]
        });
      });
      it('should select cells', function() {
        var select;
        select = {
          columns: [
            {
              table: 'movie',
              column: 'id'
            }, {
              table: 'movie',
              column: 'title'
            }
          ],
          from: 'movie'
        };
        return expect(engine.select(select, transformedStub)).toEqual([
          {
            'id': 1,
            'title': "The A-Team"
          }, {
            'id': 2,
            'title': "Avatar"
          }
        ]);
      });
      it('should execute simple query', function() {
        var query;
        query = 'SELECT *\nFROM movie';
        engine.setDb(stub);
        return expect(engine.execute(query)).toEqual([
          {
            'id': 1,
            'title': "The A-Team",
            'year': 2010,
            'directorID': 1
          }, {
            'id': 2,
            'title': "Avatar",
            'year': 2009,
            'directorID': 2
          }
        ]);
      });
      return it('should execute full query', function() {
        var query;
        query = 'SELECT movie.title, movie.id\nFROM movie\nJOIN movie ON movie.directorID = director.id\nWHERE movie.year = 2010';
        engine.setDb(stub);
        return expect(engine.execute(query)).toEqual([
          {
            'id': 1,
            'title': "The A-Team"
          }
        ]);
      });
    });
  });

}).call(this);

//# sourceMappingURL=SQL_EngineSpec.js.map