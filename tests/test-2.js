/**
 * Tests for the following password strength rules:
 * - upper
 * - number
 */
module.exports = {
    "Password strength rules: upper, number" : function (browser) {
    browser
        .url("http://localhost:8080/examples")
        .waitForElementVisible("body", 1000)
        .setValue("input[type=password]", "1NIGHT1")
        .pause(500)
        .assert.containsText("#length", "false")
        .assert.containsText("#lower", "false")
        .assert.containsText("#upper", "true")
        .assert.containsText("#number", "true")
        .assert.containsText("#special", "false")
        .assert.containsText("#strengthValidity", "false")
        .end();
    }
};