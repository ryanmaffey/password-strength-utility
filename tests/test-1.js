/**
 * Tests for the following password strength rules:
 * - length
 * - lower
 */
module.exports = {
    "Password strength rules: length, lower" : function (browser) {
    browser
        .url("http://localhost:8080/examples")
        .waitForElementVisible("body", 1000)
        .setValue("input[type=password]", "nightwatch")
        .pause(500)
        .assert.containsText("#length", "true")
        .assert.containsText("#lower", "true")
        .assert.containsText("#upper", "false")
        .assert.containsText("#number", "false")
        .assert.containsText("#special", "false")
        .assert.containsText("#strengthValidity", "false")
        .end();
    }
};