Password Strength Utility
=========================
A lightweight, dependency-free password strength utility.

[DEMO!](https://codepen.io/ryanmaffey/pen/OmzyWE)

## Contents

- [Rationale](#rationale)
- [Features](#features)
- [Usage](#usage)
    - [Install and Reference](#install-and-reference)
    - [Markup](#markup)
    - [Setup](#setup)
        - [Adding Labels (Optional)](#adding-labels-optional)
        - [Adding Rules (Required)](#adding-rules-required)
    - [Getting Password Strength Data](#getting-password-strength-data)
    - [Events](#events)
- [Using zxcvbn.js (Optional)](#using-zxcvbnjs-optional)
- [Browser Support](#browser-support)
- [Version History](#version-history)
- [To Do](#to-do)

<a id="rationale"></a>

## Rationale

This utility was created to enable users to:
1. Easily get password strength and validity information.
2. Do something (anything) using the provided information.

This utility is designed to be completely reusable across projects requiring the minimal amount of changes to the existing project code. 

This utility does not force the use of any specific markup (besides a single data attribute) or styles, making it easy to create bespoke components on different projects.

<a id="features"></a>

## Features
- Choose from a selection of rules that the password needs to match.
- Optionally provide strength labels to be assigned at different password strengths.
- Calculate the strength score using zxcvbn.js for a more accurate representation of password strength (or just use the basic strength calculator in this utility).
- Easily access the password's value, validity, strength score, strength label and rule information.
- Listen for custom events whenever the password's value, validity, strength score, strength label and rule information. changes.
- Lots of validation and error handling in case you mess anything up!

<a id="usage"></a>

## Usage

<a id="install-and-reference"></a>

### Install and Reference

Install using npm:

`npm install password-strength-utility` [(link to npm package)](https://www.npmjs.com/package/password-strength-utility)

Distributable file location:

`/node_modules/password-strength-utility/dist/password-strength.min.js`

<a id="markup"></a>

### Markup
In order to use the password strength utility, add the `data-pws` attribute onto a password input.

Example markup:

```
<input type="password" id="password-input" data-pws />
```

<a id="setup"></a>

### Setup

You will need to use the `PasswordStrength.setup()` method to setup the password strength rules and labels.

You pass in a setup object with the `labels` (optional) and `rules` properties.

Example usage:

```
PasswordStrength.setup({
    labels: {
        0: "Very weak"
        1: "Weak", 
        2: "Average", 
        3: "Strong,
        4: "Very strong"
    },
    rules: {
        length: 8,
        number: 2,
        lower: 1,
        upper: 1,
        special: 1
    }
});
```

<a id="adding-labels-optional"></a>

#### Adding Labels (Optional)

If you don't want to add labels in then that's ok - nothing will break.

The `labels` property must contain an `Object` with properties from 0-4. 

The values of 0-4 correspond with the password strength score. The value of `0` is the label shown when the password strength score is 0, etc.

The value of each property on the `labels` object must be of type `String`.

<a id="adding-rules-required"></a>

#### Adding Rules (Required)

The `rules` property must contain an `Object` with one or more of the following properties:

| Property  | Description                     | Type               |
| --------- | ------------------------------- | ------------------ |
| `length`  | Minimum total character length. | `Number (Integer)` |
| `number`  | Minimum numeric characters.     | `Number (Integer)` |
| `upper`   | Minimum upper case characters.  | `Number (Integer)` |
| `lower`   | Minimum lower case characters.  | `Number (Integer)` |
| `special` | Minimum special characters.     | `Number (Integer)` |

<a id="get-data"></a>

### Getting Password Strength Data

You can select a the password strength object for a password input in a similar way to using a jQuery selector.

Using an ID selector:

```
PasswordStrength("#password-input");
```

Using an HTML element:

```
PasswordStrength(passwordInputElement);
```

From there you can access all of the data you'd need, including:

| Property   | Description                                                          | Type               |
| ---------- | -------------------------------------------------------------------- | ------------------ |
| `password` | The password input value.                                            | `Number (Integer)` |
| `score`    | The password strength score (from 0-4).                              | `Number (Integer)` |
| `label`    | The password strength label.                                         | `String`           |
| `isValid`  | The validity of the password (i.e. does it pass all of the rules?).  | `Boolean`          |
| `rules`    | All of the rules and whether they are being passed/failed.           | `Object`           |
| `regex`    | A regular expression which validates the password.                   | `String`           |

<a id="events"></a>

### Events

The data for all events can be accessed by adding an event listener onto the password input. For all events, the data returned is on the `data` property on the event object.

Example:

```
passwordInputElement.addEventListener("passwordStrengthChange", function (event) {
    alert(event.data);
});
```

**Note:** If you're using jQuery to attach event listeners you'll need to access the `originalEvent` in order to access the `data` property.

Example: 

```
$(passwordInputElement).on("passwordStrengthChange", function (event) {
    alert(event.originalEvent.data);
});
```

| Event                | Dispatches                                                         | Type     |
| -------------------- | ------------------------------------------------------------------ | -------- |
| `pwsScoreChange`     | When the password strength value changes.                          | `Number` |
| `pwsLabelChange`     | When the password strength label changes.                          | `String` |
| `pwsRuleMatchChange` | When at least one of the strength rules' pass/fail status changes. | `Object` |
| `pwsValidityChange`  | When the password validity status changes.                         | `Object` |

<a id="using-zxcvbnjs-optional"></a>

## Using zxcvbn.js (Optional)

This is a great password strength checking tool. [Check it out on GitHub](https://github.com/dropbox/zxcvbn).

Fun fact: the tool was names after a crappy password! (zxcvbn is the qwerty equivalent when using the bottom row of alpha chars on your keyboard).

One thing to bear in mind is that it's nearly 1 MB minified (lots of dictionary information, etc.) so it's a tad heavy.

This utility will work with or without zxcvbn.js, so if you want to use it all you have to do is drop it into the project. Otherwise it will base the strength purely on the number of rules passed (but a valid password does not necessarily mean a strong password - which is why using zxcvbn.js is better).

<a id="browser-support"></a>

## Browser Support

According to [jscc.info](http://jscc.info/).

- Chrome 4+
- Edge 12+
- Firefox 3.5+
- Firefox for Android 49+
- IE 9+
- iOS Safari 3.2+
- Opera 10.0-10.1+
- Opera Mini all
- Safari 3.1+
- UC Browser for Android 11+

<a id="version-history"></a>

## Version History

### 1.1.0

**New:** Now access a regular expression which can be used to validate your password (e.g. use it for the value of the `pattern` attribute on password inputs).

### 1.0.2

**Update:** Improved the gulp task for processing the JS to form the distributable file.

**Update:** Added link to npm module into distributable file comment.

### 1.0.1

**Fix:** The utility wasn't working in IE because NodeList.forEach() is not supported. The NodeList has been cast to an Array to fix this issue.

### 1.0.0

First release!

<a id="to-do"></a>

## To Do