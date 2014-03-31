// PasswordWidget - Add a password strength metter to a password field
//
var Emitter          = require('aemitter');
var setWithDefaults  = require('./defaults');
var generatePassword = require('./generatepassword');
var PasswordStrength = require('./passwordstrength');
var CommonPasswords  = require('./commonpasswords');
var DOMBuilder       = require('./dombuilder');

// Default Constants {{{1
var defaults = {
  locale: {
    show:      ['Show',       'Display the password in plain text.'],
    mask:      ['Mask',       'Hide the password by masking it.'],
    generate:  ['Generate',   'Replace the password with a random one.'],
    tooCommon: ['too common', 'Well known common password. Very easy to guess.'],
    weak:      ['weak',       'Does not have enough complexity or is too short.'],
    medium:    ['medium',     'Has some complexity but is still kinda short.'],
    good:      ['good',       'Is complex and has an acceptible length. Could be longer.'],
    excelent:  ['excelent',   'Length and complexity is sufficient.'],
    secure:    ['secure',     'This password is concidered very secure.'],
    lower:     ['lower',      'Lower cased letters (a-z)'],
    upper:     ['upper',      'Upper cased letters (A-Z)'],
    digits:    ['digits',     'Numbers (0-9)'],
    special:   ['special',    'Symbols and punctuation'],
    entropic:  ['entropic',   'Does not have repeating sections and is not the same character'],
    info:      'TODO: fill in info text'
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
  this.options = setWithDefaults(options || {}, {
    showInfo:          true,
    showMask:          true,
    showGenerateLink:  true,
    showStrength:      true,
    showStrengthText:  true,
    showBlinkenlights: true
  });

  this.element_ = (typeof selector === 'string') ?
    DOMBuilder.find(selector) :
    DOMBuilder(selector);

  var emitUpdateEvent = (function() {
    this.emit('update', this.element_.value());
  }).bind(this);

  this.element_
    .assertTag('input')
    .addClass('pw-input')
    .proxyEvent('keyup', emitUpdateEvent);
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

// #attach {{{1
PasswordWidget.prototype.attach = function() {
  return this.attachTo(this.element_);
};

// #attachTo {{{1
PasswordWidget.prototype.attachTo = function(attachToElement) {
  // var opt     = this.options;
  var container = this.container();

  // if (opt.showInfo)          { container.add(this.infoButton()); }
  // if (opt.showMask)          { container.add(this.showHideButton()); }
  // if (opt.showGenerateLink)  { container.add(this.generateButton()); }
  // if (opt.showStrength)      { container.add(this.strengthMeterBar()); }
  // if (opt.showStrengthText)  { container.add(this.strengthMeterText()); }
  // if (opt.showBlinkenlights) { container.add(this.blinkenlights()); }

  DOMBuilder.append(attachToElement, container);

  return this;
};

// #detach {{{1
PasswordWidget.prototype.detach = function() {
  this.container().remove();
  return this;
};

// DOM Elements {{{1
// container {{{2
PasswordWidget.prototype.container = function() {
  if (this._container) { return this._container; }
  this._container = DOMBuilder.wrapper().addClass('password-widget');
  return this._container;
};
// }}}1

PasswordWidget.defaults         = defaults;
PasswordWidget.generatePassword = generatePassword;
PasswordWidget.PasswordStrength = PasswordStrength;
PasswordWidget.CommonPasswords  = CommonPasswords;

Emitter(PasswordWidget.prototype);

module.exports = PasswordWidget;
/* vim:set ts=2 sw=2 et fdm=marker: */
