define('SQL_Engine/SQL_Parser', [
    'SQL_Engine/SQL_ParserCore'
], function (ParserCore) {
    'use strict';
    var txt = ParserCore.txt,
        rgx = ParserCore.rgx,
        opt = ParserCore.opt,
        any = ParserCore.any,
        seq = ParserCore.seq.bind(ParserCore),
        rep = ParserCore.rep.bind(ParserCore);

    //Keys words
    var SELECT = txt('SELECT'),
        FROM = txt('FROM'),
        JOIN = txt('JOIN'),
        ON = txt('ON'),
        WHERE = txt('WHERE');

    //Services
    var ws = rgx(/\s+/),
        wso = opt(ws),
        table = rgx(/[a-z][a-x0-9]*/i),
        column = table,
        str = rgx(/w*/i),
        num = rgx(/[0-9]*/),
        bool = rgx(/(true|false)/);

    var tableColumn = seq(
            table,
            txt('.'),
            column
        ).then(function(res){
            return {
                table: res[0],
                column: res[2]
            }
         });

    var tableColumnList = rep(
        tableColumn,
        seq(
            txt(','),
            wso
        )
    );

    //SELECT
    var selectSection = seq(
        SELECT, ws,
        any(txt('*'), tableColumnList), ws,
        FROM, ws,
        table
    ).then(function(res){
        return {
            select: {
              columns: (res[2] === '*') ?
                '*':
                res[2],
              from: res[6]
            }
        }
        });

    //JOIN
    var joinON = seq(
        tableColumn, wso,
        txt('='), wso,
        tableColumn
    ).then(function(res){
        return {
            left: res[0],
            right: res[4]
        }
        });

    var joinSection = seq(
        JOIN, ws,
        table, ws,
        ON, ws,
        joinON
    ).then(function(res){
        return {
            table: res[2],
            columns: res[6]
        }
        });
    //WHERE
    var val = any(
        tableColumn,
        num,
        str,
        bool
    );

    var whereComprasion = seq(
        tableColumn, wso,
        any(
            txt('>='),
            txt('<='),
            txt('<>'),
            txt('>'),
            txt('<'),
            txt('=')
        ), wso,
        val
    ).then(function(res){
        return {
            left: res[0],
            right: res[4],
            operand: res[2]
        };
    });



    var whereSection = seq(
        WHERE, ws,
        whereComprasion
    ).then(function(res){
        return res[2];
        });

    //WHOLE
    var wholeSection = seq(
        opt(selectSection), wso,
        opt(rep(joinSection, ws)), wso,
        opt(whereSection)
    ).then(function(res){
            var query = {};
            if(res[0]){
                query.select = res[0].select;
            }
            if(res[2]) {
                query.join = res[2];
            }
            if(res[4]) {
                query.where = res[4];
            }

            return query;
        });

    var SQL_Parser = function(){};

    SQL_Parser.prototype.parse = function(str){
        var result = wholeSection.exec(str, 0);
        return result.res;
    };

    return SQL_Parser;
});