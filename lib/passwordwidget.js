// @preserve
// PasswordWidget - Add a password strength metter to a password field
//
require('es5-shim');
var generatePassword = require('./generatepassword');
var CommonPasswords = require('./commonpasswords');

// Default Constants {{{1
var defaults = {
  locale: {
    show:     'Show',
    mask:     'Mask',
    generate: 'Generate',
    weak:     'weak',
    medium:   'medium',
    good:     'good',
    excelent: 'excelent'
  },

  colors: [
    '#cccccc',
    '#ff0000',
    '#ff5f5f',
    '#56e500',
    '#4dcd00',
    '#399800'
  ]
};

// Constructor {{{1
function PasswordWidget(selector, options) {
  if (typeof selector === 'string') {
    selector = document.querySelect(selector);
  }
  if (!selector) {
    throw new ReferenceError('' + selector + ' element not found.');
  }
  if (!options) {
    options = {};
  }
}

// #scoreColor {{{1
PasswordWidget.scoreColor = function(score) {
  var len = defaults.colors.length;

  if (score < 0)    { return defaults.colors[0]; }
  if (score >= len) { return defaults.colors[len -1]; }

  return defaults.colors[score];
};

// #scoreText {{{1
PasswordWidget.scoreText = function(score) {
  if (score < 0) {
    return defaults.locale.tooCommon;
  }
  else if (score < 1) {
    return '';
  }
  else if (score < 3) {
    return defaults.locale.weak;
  }
  else if (score < 4) {
    return defaults.locale.medium;
  }
  else if (score < 5) {
    return defaults.locale.good;
  }
  else {
    return defaults.locale.excelent;
  }
};

// #scoreMeterWidth {{{1
PasswordWidget.scoreMeterWidth = function(score) {
  if (score <= 0) { return 0; }
  return (score + 1) * 10 + 'px';
};

// }}}1

PasswordWidget.defaults = defaults;
PasswordWidget.generatePassword = generatePassword;
PasswordWidget.CommonPasswords = CommonPasswords;

module.exports = PasswordWidget;
/* vim:set ts=2 sw=2 et fdm=marker: */
