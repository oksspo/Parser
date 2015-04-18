define('Application/App', [
    'SQL_Engine/SQL_Engine',
    'text!Application/templates/response-template.html',
    'text!Application/templates/scheme-template.html',
    'lodash',
    'jquery'
], function (sqlEngine, resultTemplate, shemeTemplate, _) {
    "use strict";

    var App = function () {
        this.templateResult = _.template(resultTemplate);
        this.templateSheme = _.template(shemeTemplate);
        this.engine = new sqlEngine();
    };

    App.prototype = {
        defaults: {
            '$input': $('#query-input'),
            '$resultHolder': $('#result'),
            '$shemeHolder': $('#sheme'),
            '$errorHolder': $('#errors .alert')
        },
        getDb: function () {
            var deff = $.Deferred();
            $.get('Application/db.json').then(function(data){
                this.engine.setDb(data);
                console.log(data);
                this.renderShems(data);
                deff.resolve();
            }.bind(this));
            return deff;
        },
        setInvalid: function (error) {
            this.defaults.$input.parent().addClass('has-error');
            this.defaults.$resultHolder.empty();
            this.defaults.$errorHolder.show().html(error);
        },
        setValid: function () {
            this.defaults.$input.parent().removeClass('has-error');
        },
        renderResult: function (input) {
            this.defaults.$errorHolder.hide();
            var result = this.engine.execute(input);
            this.defaults.$resultHolder.html(this.templateResult({
                'result': result
            }));
        },
        renderShems: function (db) {
            this.defaults.$shemeHolder.html(this.templateSheme({
                'sheme': db
            }));
        }

    };

    return App;

});