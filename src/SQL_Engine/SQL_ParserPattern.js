define('SQL_Engine/SQL_ParserPattern', [], function () {
    var Pattern = function(execFn){
        this.exec = execFn;
    };

    Pattern.prototype = {
        constructor: Pattern,
        then: function(tranformFn) {
            var exec = this.exec;
            return new Pattern(function(str, pos){
                var result;
                result = exec(str, pos || 0);

                return result && {
                        res: tranformFn(result.res),
                        end: result.end
                    }
            });
        }
    };

    return Pattern;
});