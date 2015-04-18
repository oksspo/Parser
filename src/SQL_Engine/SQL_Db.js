define('SQL_Engine/SQL_Db', ['lodash'], function (_) {
    var SQL_Db = function(structure){
        this.structure = structure
    };
    /**
     * Return table by name
     * @param table
     * @returns {*}
     */
    SQL_Db.prototype.getTable = function(tableName){
        var tableFromDb = _.pick(this.structure, tableName);
        return this.transformTable(tableFromDb, tableName);
    };

    /**
     * Transform table. For example
     * movie: [ {'id':.....}, {...}] to movie: [{movie: {...}}, {movie: {..}}]
     * It needs for recognition fields
     * @param table
     * @param tableName
     * @returns {{}}
     */
    SQL_Db.prototype.transformTable = function(table, tableName){
        var  transformedTable = {};
        transformedTable[tableName] = [];
        _.forEach(table[tableName], function(item){
            var  transformedCell = {};
            transformedCell[tableName] = item;
            transformedTable[tableName].push(transformedCell);
        });
        return transformedTable;
    };
    /**
     * Return all tables
     * @returns {*}
     */
    SQL_Db.prototype.getAllTables = function(){
        var result = {};
       _.forEach(this.structure, function(item, key) {
           _.merge(result, this.getTable(key));
        }.bind(this));
        return result;
    };

    return SQL_Db;
});