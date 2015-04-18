'use strict';

var SQL_Engine_Page = function(){
    global.isAngularSite(false);
    browser.get('http://localhost:63342/Parser/src/index.html');
};

SQL_Engine_Page.prototype = Object.create({}, {
    queryInput: {
        get: function(){
            return element(by.css('#query-input'));
        }
    },
    submitBtn: {
        get: function(){
           return element(by.css('#go-btn'));
        }
    },
    tableRows: {
        get: function(){
            return element.all(by.css('#result tbody tr'));
        }
    },
    tableColumns:{
        get: function(){
            return element.all(by.css('#result thead th'));
        }
    },
    schema: {
        get: function(){
            return element.all(by.css('#result thead th'));
        }
    },
    inputHolderClass: {
        get: function(){
            return element(by.css('.input-group')).getAttribute('class');
        }
    },
    query: {
        value: function (keys){
            this.queryInput.sendKeys(keys);
            this.submitBtn.click();
        }
    }
});

module.exports = SQL_Engine_Page;