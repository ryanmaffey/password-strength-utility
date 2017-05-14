/**
 * Tests for:
 * - upper case
 * - number
 */
module.exports = {
    'Demo test Google' : function (browser) {
    browser
        .url('http://localhost:8080/examples')
        .waitForElementVisible('body', 1000)
        .setValue('input[type=password]', '1NIGHT1')
        .pause(500)
        .assert.containsText('#length', 'false')
        .assert.containsText('#lower', 'false')
        .assert.containsText('#upper', 'true')
        .assert.containsText('#number', 'true')
        .assert.containsText('#special', 'false')
        .end();
    }
};