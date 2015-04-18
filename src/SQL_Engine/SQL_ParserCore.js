define('SQL_Engine/SQL_ParserCore', [
    'SQL_Engine/SQL_ParserPattern'
], function (Pattern) {
    return {

        /**
         * Parses fixed in advance given text string
         * @param text
         * @returns {Pattern}
         */
        txt: function(text){
            return new Pattern (function(str, pos){
                if (str.substr(pos, text.length) === text){
                    return {
                        res: text,
                        end: pos + text.length
                    }
                }
            });
        },

        /**
         * Parses a regular expression
         * @param rgx
         * @returns {Pattern}
         */
        rgx: function(rgx){
            return new Pattern (function(str, pos) {
                var res;
                res = rgx.exec(str.slice(pos));
                if (res && res.index === 0) {
                    return {
                        res: res[0], //all str what have matched
                        end: pos + res[0].length
                    };
                }
            });
        },

        /**
         * Makes pattern optional
         * @param pattern
         * @returns {Pattern}
         */
        opt: function(pattern){
            return new Pattern(function (str, pos) {
                return pattern.exec(str, pos) || { res: void 0, end: pos };
            });
        },

        /**
         * Parses only something that can parse the first pattern
         * and can not parse the second
         * @param pattern
         * @param except
         * @returns {Pattern}
         */
        exc: function(pattern, except){
            return new Pattern(function(str, pos) {
                return !except.exec(str, pos) && pattern.exec(str, pos) || void 0;
            })
        },

        /**
         * Takes several patterns and constructs a new,
         * which parses that parses the first of these patterns
         * @returns {Pattern}
         */
        any: function () {
            var patterns =  [].slice.call(arguments, 0);
            return new Pattern(function (str, pos){
                var ln = patterns.length;
                for (var r, i = 0; i < ln; i++)
                    if (r = patterns[i].exec(str, pos))
                        return r || void 0;
            });
        },

        /**
         * Sequentially parses the text given to him by a sequence of patterns
         * and produces an array of results
         * @returns {Pattern}
         */
        seq: function() {
            var patterns = [].slice.call(arguments, 0);

            return new Pattern(function (str, pos) {
                var i, r, ln = patterns.length, end = pos, res = [];
                for (i = 0; i < ln; i++) {
                    r = patterns[i].exec(str, end);
                    if (!r) return;
                    res.push(r.res);
                    end = r.end;
                }
                return {res: res, end: end};
            });
        },

        /**
         * Pattern that uses a lot of times known pattern to the text
         * and produces an array of results
         * @param pattern
         * @param separator
         * @returns {Pattern}
         */
        rep: function(pattern, separator) {
            var separated = !separator ? pattern :
                this.seq(separator, pattern).then(function(r) {return r[1]});

            return new Pattern(function (str, pos) {
                var res = [], end = pos, r = pattern.exec(str, end);
                while (r && r.end > end) {
                    res.push(r.res);
                    end = r.end;
                    r = separated.exec(str, end);
                }

                if (!res[0]) return;
                return {res: res, end: end};
            });
        }
    };
});