define('SQL_Engine/SQL_Engine', [
    'SQL_Engine/SQL_Db',
    'SQL_Engine/SQL_Parser',
    'SQL_Engine/Comparators',
    'lodash'
], function (DB, Parser, Comparators, _) {
    var SQL_Engine = function () {
        this.parser = new Parser();
    };

    SQL_Engine.prototype = {
        /**
         * Load database
         * @param data
         * @returns {*}
         */
        setDb: function (data) {
            this.db = new DB(data);
            this.data = this.db.getAllTables();
            return this.data;
        },

        /**
         * Execute JOIN
         * @param join
         * @param data
         * @returns {*}
         */
        join: function (join, data) {
            var result = _.create(data);

            join.forEach(function (joinItem) {
                var left = joinItem.columns.left,
                    right = joinItem.columns.right,
                    temp = [];

                _.forEach(result[left.table], function (leftItem) {
                    _.forEach(result[right.table], function (rightItem) {
                        if (leftItem[left.table][left.column] === rightItem[right.table][right.column]) {
                            var merge = {};
                            _.merge(merge , leftItem);
                            temp.push(_.merge(merge , rightItem));
                        }
                    });
                });
                result[left.table] = temp;
                result = _.omit(result, right.table);
            });
            return result;
        },

        /**
         * Execute WHERE
         * @param where
         * @param data
         * @returns {{}}
         */
        where: function (where, data) {
            var result = {},
                left = where.left,
                right = where.right,
                operand = where.operand;
            result[left.table] = [];
            _.forEach(data[left.table], function (leftItem) {
                var leftColumn = leftItem[left.table][left.column];
                if (typeof right == 'string') {
                    if (Comparators[operand](leftColumn, right)) {
                        result[left.table].push(leftItem);
                    }
                } else {
                    _.forEach(data[right.table], function (rightItem) {
                        var rightColumn = rightItem[right.table][right.column];
                        if (Comparators[operand](leftColumn, rightColumn)) {
                            result[left.table].push(leftItem);
                        }
                    })
                }

            });

            return result;
        },

        /**
         * Execute SELECT
         * @param select
         * @param data
         * @returns {Array}
         */
        select: function (select, data) {
            var result = [];
            if (select.columns === '*') {
                _.forEach(data[select.from], function (itemCell) {
                    var temp = {};
                    _.forEach(itemCell, function (itemColumn) {
                        _.merge(temp, itemColumn);
                    });
                    result.push(temp);
                });
            } else {
                _.forEach(data[select.from], function (itemRow) {
                    var temp = {};
                    _.forEach(select.columns, function (itemColumn) {
                        temp[itemColumn.column] = itemRow[itemColumn.table][itemColumn.column];
                    });
                    result.push(temp);
                });

            }
            return result;
        },

        /**
         * Execute whole query
         * @param input
         * @returns {*}
         */
        execute: function (input) {
            var parsedQuery = this.parser.parse(input),
                result = this.data;

            /* START ERRORS HANDLING*/
            //  For case if input is empty
            if (input.length === 0) throw new Error("You try parse empty query. It's bad idea. Please try again");
            //  For case if Parser cannot parse query
            if (_.isEmpty(parsedQuery)) throw new Error("It seems that you have incorrectly entered query. I can't parse it, please try again");
            /* START ERRORS HANDLING*/

            if (parsedQuery.join) {
                result = this.join(parsedQuery.join, result);
            }

            if (parsedQuery.where) {
                result = this.where(parsedQuery.where, result);
            }
            if (parsedQuery.select) {
                result = this.select(parsedQuery.select, result);
            }

            if(!_.isEmpty(result)) {
                return result;
            } else {
                if (!_.isEmpty(parsedQuery)){
                    throw new Error("Sorry, we did not find such records in data base.")
                }
            }
        }
    };

    return SQL_Engine;
});