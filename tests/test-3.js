module.exports = {
    'Demo test Google' : function (browser) {
    browser
        .url('http://localhost:8080/examples')
        .waitForElementVisible('body', 1000)
        .setValue('input[type=password]', 'Night!')
        .pause(500)
        .assert.containsText('#length', 'false')
        .assert.containsText('#lower', 'true')
        .assert.containsText('#upper', 'true')
        .assert.containsText('#number', 'false')
        .assert.containsText('#special', 'true')
        .end();
    }
};