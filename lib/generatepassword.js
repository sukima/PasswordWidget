// generatePassword - Return a randomized password

function getRand(max) {
  return (Math.floor(Math.random() * max));
}

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

module.exports = function() {
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
/* vim:set ts=2 sw=2 et fdm=marker: */
