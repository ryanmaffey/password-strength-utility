var masterTest = require("../master-test.js");

module.exports = {
    "Password strength rules: all" : function (browser) {
        masterTest.test(browser, {
            password: "1_Nightwatch_1",
            rules: {
                length: true,
                lower: true,
                upper: true,
                number: true,
                special: true
            }
        });
    }
};