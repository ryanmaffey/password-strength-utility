var masterTest = require("../master-test.js");

module.exports = {
    "Password strength rules: length, lower" : function (browser) {
        masterTest.test(browser, {
            password: "nightwatch",
            rules: {
                length: true,
                lower: true,
                upper: false,
                number: false,
                special: false
            }
        });
    }
};