exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['test/e2e/**/*.spec.js'],
    onPrepare: function() {
        global.isAngularSite = function(flag){
            browser.ignoreSynchronization = !flag;
        };
    }
};