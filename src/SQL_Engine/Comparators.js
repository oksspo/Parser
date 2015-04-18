define('SQL_Engine/Comparators', [], function () {
    var Comparators = {
        '=': function(a, b){
            return a == b;
        },
        '>': function(a, b){
            return parseInt(a) > parseInt(b);
        },
        '<': function(a, b){
            return parseInt(a) < parseInt(b);
        }
    };

    return Comparators;
});