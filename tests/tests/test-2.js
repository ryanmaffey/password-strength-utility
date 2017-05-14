var masterTest = require("../master-test.js");

module.exports = {
    "Password strength rules: upper, number" : function (browser) {
        masterTest.test(browser, {
            password: "1NIGHT1",
            rules: {
                length: false,
                lower: false,
                upper: true,
                number: true,
                special: false
            }
        });
    }
};