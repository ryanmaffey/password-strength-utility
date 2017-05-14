module.exports = {
    test: function (browser, opts) {
        /**
         * Get information based on options.
         */
        var isValid = true;

        for (var key in opts.rules) {
            if (opts.rules[key] == false) {
                isValid = false;
                break;
            }
        }

        browser
            .url("http://localhost:8080/example")
            .waitForElementVisible("body", 1000)
            .setValue("#password", opts.password)
            .pause(500)

            /**
             * Check the password strength rules are passing/failing as 
             * expected.
             */
            .assert.containsText("#length", opts.rules.length)
            .assert.containsText("#lower", opts.rules.lower)
            .assert.containsText("#upper", opts.rules.upper)
            .assert.containsText("#number", opts.rules.number)
            .assert.containsText("#special", opts.rules.special)
            .assert.containsText("#strengthValidity", isValid)

            /**
             * Check PasswordStrength() and it's properties.
             */
            .execute(function(data) {
                return PasswordStrength("#password");
            }, [], function(pws) {
                pws = pws.value;

                // PasswordStrength().
                browser.assert.equal(typeof pws, "object");

                // // PasswordStrength().password.
                browser.assert.equal(typeof pws.password, "object");
                browser.assert.equal(typeof pws.password.value, "string");
                browser.assert.equal(typeof pws.password.elem, "object");

                // PasswordStrength().isValid.
                browser.assert.equal(typeof pws.isValid, "boolean");
                browser.assert.equal(pws.isValid, isValid)

                // PasswordStrength().regex.
                browser.assert.equal(typeof pws.regex, "string");
                browser.assert.equal(new RegExp(pws.regex, "g").test(pws.password.value), isValid);

                // // PasswordStrength().score.
                browser.assert.equal(typeof pws.score, "number");
                browser.assert.equal(parseInt(pws.score), pws.score);
                browser.assert.equal(pws.score >= 0, true);
                browser.assert.equal(pws.score <= 4, true);

                // PasswordStrength().rules.
                browser.assert.equal(typeof pws.rules, "object");
                pws.rules.map(function (rule) {
                    browser.assert.equal(typeof rule, "object");
                    browser.assert.equal(typeof rule.isPassing, "boolean");
                    browser.assert.equal(rule.isPassing, opts.rules[rule.name]);
                });
            })
            .end();
    }
}