'use strict';
var SQL_Engine_Page = require('../SQL_Engine_Page.js');

describe ("quering", function(){
    var page;

    beforeEach(function() {
        page = new SQL_Engine_Page();
    });

    it ("should make a query and get result", function(){
        setTimeout(function () {
            page.query('* FROM movie');
            expect(page.tableRows.count()).toEqual(18);
        }, 800);
    });
    it ("should set invalid when query is wrong or empty", function(){
        setTimeout(function () {
            page.query('Olololo');
            expect(page.inputHolderClass).toMatch('has-error');
        }, 800);
    });
    it ("should generate right schema", function(){
        setTimeout(function () {
            expect(page.schema.count()).toBe(4);
        }, 800);
    });
    it ("should get a correct columns", function(){
        setTimeout(function () {
            page.query('movie.id, movie.title FROM movie');

            var columns = page.tableColumns;
            expect(columns.count()).toEqual(2);
            expect(columns.get(0).getText()).toBe("id");
            expect(columns.get(1).getText()).toBe("title");
        }, 800);
    });
});