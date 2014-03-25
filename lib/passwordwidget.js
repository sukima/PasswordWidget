// PasswordWidget - Add a password strength metter to a password field
//
var setWithDefaults  = require('./defaults');
var generatePassword = require('./generatepassword');
var PasswordStrength = require('./passwordstrength');
var CommonPasswords  = require('./commonpasswords');

// Default Constants {{{1
var defaults = {
  locale: {
    show:      'Show',
    mask:      'Mask',
    generate:  'Generate',
    tooCommon: 'too common',
    weak:      'weak',
    medium:    'medium',
    good:      'good',
    excelent:  'excelent',
    secure:    'secure'
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
  this.input = (typeof selector === 'string') ?
    document.querySelect(selector) :
    selector;
  if (!this.input || ('' + this.input.nodeName).toLowerCase() !== 'input') {
    throw new TypeError('' + (selector.nodeName || selector) + ' element is not of type <INPUT>.');
  }
  this.options = setWithDefaults(options, {
    showMask:         true,
    showGenerateLink: true,
    showStrength:     true,
    showStrengthText: true
  });
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
  else if (score < 6) {
    return defaults.locale.excelent;
  }
  else {
    return defaults.locale.secure;
  }
};

// #scoreMeterWidth {{{1
PasswordWidget.scoreMeterWidth = function(score) {
  if (score <= 0) { return 0; }
  return (score + 1) * 10 + 'px';
};
// }}}1

PasswordWidget.defaults         = defaults;
PasswordWidget.generatePassword = generatePassword;
PasswordWidget.PasswordStrength = PasswordStrength;
PasswordWidget.CommonPasswords  = CommonPasswords;

module.exports = PasswordWidget;
/* vim:set ts=2 sw=2 et fdm=marker: */
