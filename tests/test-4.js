/**
 * Tests for all of the password strength rules.
 */
module.exports = {
    "Password strength rules: all" : function (browser) {
    browser
        .url("http://localhost:8080/examples")
        .waitForElementVisible("body", 1000)
        .setValue("input[type=password]", "1_Nightwatch_1")
        .pause(500)
        .assert.containsText("#length", "true")
        .assert.containsText("#lower", "true")
        .assert.containsText("#upper", "true")
        .assert.containsText("#number", "true")
        .assert.containsText("#special", "true")
        .assert.containsText("#strengthValidity", "true")
        .end();
    }
};