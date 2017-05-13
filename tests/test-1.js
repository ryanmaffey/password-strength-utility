module.exports = {
    'Test 1' : function (browser) {
    browser
        .url('http://localhost:8080/playground')
        .waitForElementVisible('body', 1000)
        .setValue('input[type=password]', 'nightwatch')
        .pause(500)
        .assert.containsText('#length', 'true')
        .assert.containsText('#lower', 'true')
        .assert.containsText('#upper', 'false')
        .assert.containsText('#number', 'false')
        .assert.containsText('#special', 'false')
        .end();
    }
};