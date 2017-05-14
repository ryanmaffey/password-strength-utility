var masterTest = require("../master-test.js");

module.exports = {
    "Password strength rules: lower, upper, !number, special" : function (browser) {
        masterTest.test(browser, {
            password: "Night1!",
            rules: {
                length: false,
                lower: true,
                upper: true,
                number: false,
                special: true
            }
        });
    }
};