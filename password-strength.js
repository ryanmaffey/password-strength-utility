/**
 * -----------------------------------------------------------------------------
 *                              PasswordStrength
 * -----------------------------------------------------------------------------
 */


/**
 * PasswordStrength method.
 * 
 * This acts as an interface for interacting with _PWS instances.
 * Each [data-pws] input has it's own _PWS instance for managing it's password
 * strength information.
 * 
 * @param {String, HtmlElement} selector A selector for the data-pws password
 *                                       input (String) or the element itself.
 * 
 * @return {_PWS} The target _PWS instance.
 */
function PasswordStrength (selector) {
    // If no selector is provided, warn the user and exit early.
    if (selector == null && selector == undefined) {
        PWS.warn("Did you mean to pass in a selector to PasswordStrength()?");
        return;
    }

    /**
     * A private method which returns the target _PWS instance.
     * 
     * 1. If the selector is a String, select all _PWS instances where the 
     *    password input matches the selector.
     * 
     * 2. If the selector id an HtmlElement, select all _PWS instances where the
     *    password input is the same as the selector HtmlElement.
     * 
     * 3. If the selector is neither a String nor HtmlElement, warn the user and
     *    exit early.
     * 
     * 4. If there is at least one matching _PWS instance, return the first 
     *    match.
     * 
     * 5. If there are no _PWS instances matching the selector, see if we need 
     *    to instantiate a new _PWS instance and return it.
     */
    function selected_PWS () {
        var target_PWS;
    
        if (typeof selector == "string") {
            // [1]
            target_PWS = PasswordStrength._PWSArray.filter(function (_PWS) {
                return _PWS.password.elem.matches(selector);
            });
        } else if (selector instanceof HTMLElement) {
            // [2]
            target_PWS = PasswordStrength._PWSArray.filter(function (_PWS) {
                return _PWS.password.elem == selector;
            });
        } else {
            // [3]
            PWS.warn("Selector must be of type String or HtmlElement. " +
                "Instead found '" + typeof selector + "'.", selector);
            return;
        }

        return target_PWS.length ?
            // [4]
            target_PWS[0] : 
            // [5]
            createAndSelect_PWS();
    }

    /**
     * A private method which creates a new _PWS instance using the selectoe 
     * and returns the it.
     * 
     * 1. Try to create the the new _PWS instance based on the type of selector.
     *    (The selector will only be a String or HtmlElement because any other
     *    type would have caused an early exit further up the chain).
     * 
     * 2. If the creation of a new _PWS instance was successful, store it.
     * 
     * 3. Return the new _PWS instance (or null if no _PWS instance was 
     *    created).
     */
    function createAndSelect_PWS () {
        var not_PWSMsg = "PasswordStrength: This is not a [data-pws] element.";

        /**
         * 1. Get all of the elements matching the selector.
         * 
         * 2. If there are no DOM elements matching the selector, warn the user
         *    and exit early.
         * 
         * 3. Of the matching elements, filter them down to only thise with 
         *    [data-pws] attributes.
         * 
         * 4. If there are no [data-pws] elements found, warn the user and exit 
         *    early.
         * 
         * 5. Create the _PWS instance for the first matching [data-pws] element
         *    and return it.
         */
        function create_PWSFromString () {
            // [1]
            var matchingElems = document.querySelectorAll(selector);

            // [2]
            if (matchingElems.length) {
                console.warn("PasswordStrength: '" + selector + "' was not " +
                    "found.");
                return;
            }

            // [3]
            var matching_PWSElems = []
                .slice
                .call(matchingElems)
                .filter(function (elem) {
                    return elem.hasAttribute("[data-pws]");
                });

            // [4]
            if (!matching_PWSElems.length) {
                console.warn(not_PWSMsg, selector);
                return;
            }

            // [5]
            return new _PWS(matching_PWSElems[0]);
        }

        /**
         * 1. If this element does not have a [data-pws] attribute, warn the
         *    user and exit early.
         * 
         * 2. Create and return a _PWS instance for the first matching 
         *    [data-pws] element.
         */
        function create_PWSfromElem () {
            // [1]
            if (!selector.hasAttribute("[data-pws]")) {
                console.warn(not_PWSMsg, selector);
                return;
            }
            // [2]
            return new _PWS(selector);
        }

        // [1]
        var new_PWS = (typeof selector == "string") ? 
            create_PWSFromString() : create_PWSfromElem();

        // [2]
        if (new_PWS) {
            PWS._PWSArray.push(new_PWS);
        }

        // [3]
        return new_PWS;
    }
    
    return selected_PWS();
}''

// Using PWS as an alias for PasswordStrength.
var PWS = PasswordStrength;


/**
 * TODO
 */
PWS.availableRules = ["length", "upper", "lower", "number", "special"],


/**
 * Creating events to be dispatched after various changes to the data on a _PWS
 * object.
 */
PWS.events = {
    scoreChange     : new CustomEvent('pwsScoreChange'),
    labelChange     : new CustomEvent('pwsLabelChange'),
    ruleMatchChange : new CustomEvent('pwsRuleMatchChange'),
    validityChange  : new CustomEvent('pwsValidityChange')
};


// Create an empty array in which to store the _PWS instances.
PWS._PWSArray = [];


/**
 * Public setup method to allow users to define the password strength rules and
 * labels before creating each of the _PWS instances.
 * 
 * 1. Validate the passed in setup options. If invalid, exit early.
 * 
 * 2. Assign the rules and labels (optional) to the PasswordStrength object.
 * 
 * 3. Create and store the _PWS instances for all of the [data-pws] elements in 
 *    the DOM.
 * 
 * @param {Object} opts The setup options. 
 *                      Properties:
 *                      labels: { Number (Integer): String } (optional)
 *                      rules: { String: Number (Integer) }
 * 
 * @return {PasswordStrength} The instance PasswordStrength method.
 *                            Allows for method chaining.
 */
PWS.setup = function (opts) {

    /**
     * Private helper methid to prefix the warning message with a string 
     * relating to the current situation.
     */
    function warn (msg, other) {
        msg = "Invalid PasswordStrength.setup() parameter. " + msg;
        other ? PWS.warn(msg, other) : PWS.warn(msg);
    }

    /**
     * Private helper method to validate the opts parameter.
     * 
     * 1. Validate the opts object at the top level and return false if invalid.
     * 
     * 2. If the opts object is valid at the top level, validate the labels and 
     *    rules properties and return the result.
     * 
     * @return {Boolean} opts parameter validity.
     */
    function validateOpts () {
        // [1]
        if (!opts) {
            warn("No parameter found.");
            return false;
        }
        if (typeof opts != "object" ) {
            warn("Parameter must be an object. Instead found '" + typeof opts + "'.", opts);
            return false;
        }
        if (opts.labels && typeof opts.labels != "object") {
            warn("The labels property is not an object. Instead found '" + typeof opts.labels + "'.", opts.labels);
            return false;
        }
        if (!opts.rules) {
            warn("The rules property is required.");
            return false;
        }
        if (typeof opts.rules != "object") {
            warn("The rules property must be an object. Instead found '" + typeof opts.rules + "'.", opts.rules);
            return false;
        }

        // [2]
        return validateLabelsOpts() && validateRulesOpts();
    }

    /**
     * Private helper method for texting thr validity of the opts.labels 
     * property.
     * 
     * 1. If there are no labels passed in, assign an empty object and return 
     *    true (valid).
     * 
     * 2. For each label in opts.labels, if any of the values are not Strings,
     *    assign a warning message and break the loop.
     * 
     * 3. If there is a warning message to display, warn the user and return 
     *    false (invalid).
     * 
     * 4. Check that all of the necessary properties (0, 1, 2,3 and 4) are in
     *    the opts.labels object.
     * 
     *    Note: This uses code from xdazz's answer to the following question about 
     *    comparing arrays: https://stackoverflow.com/questions/22395357/how-to-compare-two-arrays-are-equal-using-javascript
     * 
     * 5. If there are missing properties on the opts.labels object, warn the
     *    user and return false (invalid).
     * 
     * 6. If all is well, return true (valid).
     * 
     * @return {Boolean} opt.labels validity.
     */
    function validateLabelsOpts () {
        // [1]
        if (!opts.labels) {
            PWS.labels = {};
            return true;
        }

        var labelKeysRequired = ["0", "1", "2", "3", "4"],
            labelKeysFound = [],
            invalidRuleMsg;

        for (var key in opts.labels) {
            labelKeysFound.push(key);
            // [2]
            if (typeof opts.labels[key] != "string") {
                invalidRuleMsg = "The value '" + opts.labels[key] + "' for the '" + key + "' property on the labels object is not a string.";
                break;
            }
        }

        // [3]
        if (invalidRuleMsg) {
            warn(invalidRuleMsg);
            return;
        }

        labelKeysFound = labelKeysFound.sort();

        // [4]
        var labelKeysMatch = (labelKeysRequired.length == labelKeysFound.length) && labelKeysRequired.every(function(element, index) {
            return element === labelKeysFound[index]; 
        });

        // [5]
        if (!labelKeysMatch) {
            warn("Missing required properties on the labels object. Properties of 0, 1, 2, 3 and 4 are required, with values of type 'string'.", opts.labels);
            return false;
        }

        // [6]
        return true;
    }

    /**
     * Private helper method for texting thr validity of the opts.rules 
     * property.
     * 
     * 1. For each rule in opts.rules, if the value matches one of the available
     *    rules, increment the rule counter.
     * 
     * 2. For each rule in opts.rules, if any of the values are not Numbers 
     *    (Integers) or the String of a Number (Integer), store a warning 
     *    message and break the loop.
     * 
     * 3. Cast all values to an integer to allow the use of String values 
     *    instead of Number (e.g. "1" instead of 1).
     * 
     * 4. If there are no rules found, warn the user and return false (invalid).
     * 
     * 5. If there is a warning message, warn the user and return false 
     *    (invalid).
     * 
     * 6. If all is well, return true (valid).
     */
    function validateRulesOpts () {
        var ruleCount = 0,
            invalidRuleMsg;

        for (var key in opts.rules) {
            if (PWS.availableRules.indexOf(key) > -1) {
                // [1]
                ruleCount++;

                var originalValue = opts.rules[key],
                    intValue = parseInt(originalValue);

                // [2]
                if (isNaN(intValue) || originalValue != intValue) {
                    invalidRuleMsg = "The value '" + opts.rules[key] + "' for the '" + key + "' property on the rules object is not an integer.";
                    break;
                }

                // [3]
                opts.rules[key] = parseInt(opts.rules[key]);
            }
        }

        // [4]
        if (!ruleCount) {
            warn("There are no valid rules on in the rules object.", opts.rules);
            return false;
        }

        // [5]
        if (invalidRuleMsg) {
            warn(invalidRuleMsg);
            return false;
        }

        // [6]
        return true;
    }

    // [1]
    if (!validateOpts()) {
        return;
    }

    // [2]
    if (opts.labels) {
        PWS.labels = opts.labels;
    }
    PWS.rules = opts.rules;
    
    // [3]
    [].slice
        .call(document.querySelectorAll("[data-pws]"))
        .forEach(function (_PWSElem) {
            PWS._PWSArray.push(new _PWS(_PWSElem));
        });
};


/**
 * @param {String} msg The warning message.
 * 
 * @param {Any} other  Any aditional information we want to include in the 
 *                     console warning (usually an element or an object).
 */
PWS.warn = function (msg, other) {
    msg = "PasswordStrength: " + msg;
    other ? console.warn(msg, other) : console.warn(msg);
}


/**
 * -----------------------------------------------------------------------------
 *                              _PWS
 * -----------------------------------------------------------------------------
 */

/**
 * _PWS constructor.
 * 
 * Only instantiated from within the PasswordStrength.init() method and stored 
 * in the PasswordStrength._PWSArray.
 * 
 * 1. HtmlElement:      The password input element.
 * 
 * 2. String:           The password input value.
 * 
 * 3. Array[Object]:    The list of rules which need to be applied to the 
 *                      password.
 * 
 * 4. Number (Integer): The current password strength score (from 0-4).
 * 
 * 5. String:           The current password strength label.
 * 
 * 6. Boolean:          The validity of the password (true if valid, otherwise 
 *                      false). Validity is defined by the number or rules 
 *                      passed by the password. (If all rules are met, password 
 *                      is valid, otherwise invalid).
 * 
 * @param {Element} elem The password strength component.
 */
function _PWS (elem) {
    var _pws = this;
    _pws.password = {
        elem: elem,                // [1]
        value: elem.value          // [2]
    };
    _pws.rules   = [];             // [3]
    _pws.score   = 0;              // [4]
    _pws.label   = PWS.labels[0];  // [5]
    _pws.isValid = false;          // [6]
    _pws.regex   = null;           // [7]

    _pws.init();
};


/**
 * Adds the password strength rules.
 * 
 * @return {_PWS} This _PWS instance. Allows for method chaining.
 */
_PWS.prototype.addRules = function () {
    var _pws = this;

    // Mnimum length.
    if (PWS.rules.length) {
        _pws.rules.push({
            name: "length",
            regex: "^.{" + PWS.rules.length + ",}$",
        });
    }

    // Minimum numerical characters.
    if (PWS.rules.number) {
        _pws.rules.push({
            name: "number",
            regex: "(.*[0-9]){" + PWS.rules.number + "}"
        });
    }

    // Minimum upper case characters.
    if (PWS.rules.upper) {
        _pws.rules.push({
            name: "upper",
            regex: "(.*[A-Z]){" + PWS.rules.upper + "}"
        });
    }

    // Minimum lower case characters.
    if (PWS.rules.lower) {
        _pws.rules.push({
            name: "lower",
            regex: "(.*[a-z]){" + PWS.rules.lower + "}"
        });
    }

    // Minimum special characters.
    if (PWS.rules.special) {
        _pws.rules.push({
            name: "special",
            regex: "(.*[_\\W]){" + PWS.rules.special + "}"
        });
    }

    _pws.rules.map(function (rule) {
        rule.isPassed = function () {
            return new RegExp(this.regex, "g").test(_pws.password.value);
        }
        return rule;
    });

    return _pws;
};


/**
 * Updates all of the infotmation on the _PWS instance based on the value of the
 * password input.
 * 
 * @return {_PWS} This _PWS instance. Allows for method chaining.
 */
_PWS.prototype.update = function () {
    var _pws = this;
    
    /**
     * 1. Filter the rules down to only thise that have changed.
     * 
     * 2. If any of the rules have changed pass/fail status, dispatch an event 
     *    to notify listeners of the change(s).
     */
    function checkRules () {
        // [1]
        var rulesChanged = _pws.rules.filter(function (rule) {
            var wasPassing = rule.isPassing;
            rule.isPassing = rule.isPassed();
            return wasPassing != rule.isPassing;
        });

        if (rulesChanged.length) {
            // [2]
            PWS.events.ruleMatchChange.data = rulesChanged;
            _pws.password.elem.dispatchEvent(PWS.events.ruleMatchChange);
        }
    }

    /**
     * 1. If zxcvbn.js is available, use it to get the password strength score.
     * 
     * 2. If zxcvbn.js is unavailable, calculate the score based on the number
     *    of rules passed.
     * 
     * 3. If the score has changed, update the score property on the _PWS
     *    instance.
     * 
     * 4. If the score has changed, dispatch an event to notify listeners of
     *    the change.
     */
    function checkScore () {
        var score;

        try {
            // [1]
            score = zxcvbn(_pws.password.value).score;
        } catch (e) {
            // [2]
            score = Math.floor((_pws.rules.filter(function (rule) {
                return rule.isPassing;
            }).length / _pws.rules.length) * 4);
        }
        
        if (score != _pws.score) {
            // [3]
            _pws.score = score;

            // [4]
            PWS.events.scoreChange.data = score;
            _pws.password.elem.dispatchEvent(PWS.events.scoreChange);
        }
    }

    /**
     * 1. Get the new label value using the current score on the _PWS instance.
     * 
     * 2. If the label has changed, update the validity property on the _PWS
     *    instance.
     * 
     * 3. If the label has changed, dispatch an event to notify listeners of
     *    the change.
     */
    function checkLabel () {
        // [1]
        var label = PWS.labels[_pws.score];

        if (label != _pws.label) {
            // [2]
            _pws.label = label;

            // [3]
            PWS.events.labelChange.data = label;
            _pws.password.elem.dispatchEvent(PWS.events.labelChange);
        }
    }

    /**
     * 1. Check to see if the number of rules passed is equal to the total 
     *    number of rules. If so, the password is valid.
     * 
     * 2. If the validity has changed, update the validity property on the _PWS
     *    instance.
     * 
     * 3. If the validity has changed, dispatch an event to notify listeners of
     *    the change.
     */
    function checkValidity () {
        // [1]
        var isValid = new RegExp(_pws.regex, "g").test(_pws.password.value);

        if (isValid != _pws.isValid) {
            // [2]
            _pws.isValid = isValid;

            // [3]
            PWS.events.validityChange.data = isValid;
            _pws.password.elem.dispatchEvent(PWS.events.validityChange);
        }
    }

    checkRules();
    checkScore();
    checkLabel();
    checkValidity();

    return _pws;
};


/**
 * Binds events to the password input element.
 * 
 * @return {_PWS} This _PWS instance. Allows for method chaining.
 */
_PWS.prototype.bindEvents = function () {
    var _pws = this;

    /**
     * Update the _PWS information whenever the "input" event is fired on the 
     * password input.
     */
    _pws.password.elem.addEventListener("input", function (event) {
        _pws.password.value = event.target.value;
        _pws.update();
    });

    return _pws;
};


/**
 * Generate a regular expression which validates the whole password.
 * 
 * 1. Concatenate the regex strings.
 * 
 * 2. If the rule is for the minimum length, store the regex for that rule for 
 *    later because it needs to go on the end of the concatenated regex string.
 * 
 * 3. If there is a minimum length rule in place, add it to the end of the regex
 *    string.
 * 
 * 4. Add the concatenated regex string to the _PWS instance.
 * 
 * @return {_PWS} This _PWS instance. Allows for method chaining.
 */
_PWS.prototype.generateRegex = function () {
    var _pws = this,
        regex = "",
        lengthRegex;

    _pws.rules.map(function (rule) {
        if (rule.name != "length") {
            // [1]
            regex += "(?=" + rule.regex + ")";
        } else {
            // [2]
            lengthRegex = rule.regex;
        }
    });

    // [3]
    if (lengthRegex) {
        regex += lengthRegex.replace("^", "").replace("$", "");
    }

    // [4]
    _pws.regex = regex;

    return _pws;
};


/**
 * Initialise this _PWS instance.
 * 
 * @return {_PWS} This _PWS instance. Allows for method chaining.
 */
_PWS.prototype.init = function () {
    return this
        .addRules()
        .generateRegex()
        .bindEvents()
        .update();
};