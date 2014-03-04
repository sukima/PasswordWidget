// PasswordWidget - Add a password strength metter to a password field
//
require('./pollyfills');

var commonPasswords = {};

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

// #constructor {{{1
function PasswordWidget() {
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

// #generatePassword {{{1
PasswordWidget.generatePassword = function() {
  var maxAlpha   = 26;
  var strSymbols = '~!@#$%^&*(){}?><` = -|][';
  var password   = '';

  for (i = 0; i < 3; i++) {
    password += String.fromCharCode('a'.charCodeAt(0) + getRand(maxAlpha));
  }
  for (i = 0; i < 3; i++) {
    password += String.fromCharCode('A'.charCodeAt(0) + getRand(maxAlpha));
  }
  for (i = 0; i < 3; i++) {
    password += String.fromCharCode('0'.charCodeAt(0) + getRand(10));
  }
  for (i = 0; i < 4; i++) {
    password += strSymbols.charAt(getRand(strSymbols.length));
  }

  password = shuffleString(password);
  password = shuffleString(password);
  password = shuffleString(password);

  return password;
};

// #addCommonPasswords {{{1
PasswordWidget.addCommonPasswords = function(passwords) {
  var i, len;
  for (i = 0, len = passwords.length; i < len; i++) {
    commonPasswords[ passwords[i] ] = true;
  }
};

// #setCommonPasswords {{{1
PasswordWidget.setCommonPasswords = function(obj) {
  commonPasswords = obj;
};

// #isACommonPassword {{{1
PasswordWidget.isACommonPassword = function(password) {
  return commonPasswords[password] === true;
};

// #fetchPasswordList {{{1
PasswordWidget.fetchPasswordList = function(url, callback) {
  if (typeof callback !== 'function') {
    callback = function() {};
  }

  function failed(e) {
    callback.call(null, e);
  }

  function success(e) {
    if (this.statusCode < 200 || this.statusCode >= 300) {
      failed.call(null, new Error('Unable to handle server response (' + this.statusCode + '): ' + this.responseText)); 
      return;
    }
    try {
      PasswordWidget.setCommonPasswords(JSON.parse(this.responseText));
      callback.call(null, null);
    } catch (error) {
      failed.call(null, error);
    }
  }

  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', success);
  xhr.addEventListener('error', failed);

  xhr.open('GET', url);
  xhr.send();

  return xhr;
};

// strengthScore {{{1
PasswordWidget.strengthScore = function(password) {
  var score = 0;

  if (password.length > 6)          { score++; }
  if ((password.match(/[a-z]/)) &&
    (password.match(/[A-Z]/)))      { score++; }
  if (password.match(/\d+/))        { score++; }
  if (password.match(/[^a-z\d]+/i)) { score++; }
  if (password.length > 12)         { score++; }

  return score;
};

// Utility Functions {{{1
// getRand {{{2
function getRand(max) {
  return (Math.floor(Math.random() * max));
}

// shuffleString {{{2
function shuffleString(mystr) {
  var arrPwd = mystr.split('');

  for (i = 0; i < mystr.length; i++) {
    var r1 = i;
    var r2 = getRand(mystr.length);

    var tmp    = arrPwd[r1];
    arrPwd[r1] = arrPwd[r2];
    arrPwd[r2] = tmp;
  }

  return arrPwd.join('');
}
// }}}1

PasswordWidget.defaults = defaults;

module.exports = PasswordWidget;
/* vim:set ts=2 sw=2 et fdm=marker: */
