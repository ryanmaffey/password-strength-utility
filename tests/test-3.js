/**
 * Tests for the following password strength rules:
 * - lower
 * - upper
 * - !number
 * - special
 */
module.exports = {
    "Password strength rules: lower, upper, !number, special" : function (browser) {
    browser
        .url("http://localhost:8080/examples")
        .waitForElementVisible("body", 1000)
        .setValue("input[type=password]", "Night!1")
        .pause(500)
        .assert.containsText("#length", "false")
        .assert.containsText("#lower", "true")
        .assert.containsText("#upper", "true")
        .assert.containsText("#number", "false")
        .assert.containsText("#special", "true")
        .assert.containsText("#strengthValidity", "false")
        .end();
    }
};