require.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'lodash': '../bower_components/lodash/lodash',
        'text': '../bower_components/requirejs-text/text'
    },

    shim: {
        'jquery': {
            exports: '$'
        }
    }
});

define('main', ['Application/App', 'jquery'], function (App) {
    var application = new App(),
        $input = $('#query-input');

    application.getDb().then(function () {
        $input.removeAttr('disabled');

        $('.query-form').on('submit', function(event){
            event.preventDefault();
            var query = 'SELECT ' + $('#query-input').val();

            try{
                application.setValid();
                application.renderResult(query);
            } catch (error){
                application.setInvalid(error);
            }
        });
    });

});