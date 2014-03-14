var expect = chai.expect;
var PasswordStrength = require('../lib/passwordstrength');

function toBinaryStr(num) {
  num = Number(num).toString(2);
  return ('000000' + num).slice(-6);
}

describe('PasswordStrength', function() {
  var f = PasswordStrength.SCORE_FLAGS; // alias

  var testCases = [
    ['',                          0, 0],
    ['abc',                       0, f.LOWER_CASE],
    ['Ab$1',                      0, f.LOWER_CASE | f.UPPER_CASE | f.SPECIAL | f.DIGITS],
    ['12345',                     0, f.DIGITS],
    ['12345678',                  1, f.DIGITS],
    ['abcdefgh',                  1, f.LOWER_CASE],
    ['ABCDEFGH',                  1, f.UPPER_CASE],
    ['abcdefghijklm',             2, f.LOWER_CASE],
    ['AbCdefgh',                  2, f.LOWER_CASE | f.UPPER_CASE],
    ['AbCdefghIJklM',             3, f.LOWER_CASE | f.UPPER_CASE],
    ['AbCd1234',                  3, f.LOWER_CASE | f.UPPER_CASE | f.DIGITS],
    ['abcd1234efgl8',             3, f.LOWER_CASE | f.DIGITS],
    ['AbCd1234EfgL8',             4, f.LOWER_CASE | f.UPPER_CASE | f.DIGITS],
    ['Ab$ 1&^4',                  4, f.LOWER_CASE | f.UPPER_CASE | f.SPECIAL | f.DIGITS],
    ['Tr0ub4dor&3',               4, f.LOWER_CASE | f.UPPER_CASE | f.SPECIAL | f.DIGITS],
    ['Tr0ub4dor&3#Z',             5, f.LOWER_CASE | f.UPPER_CASE | f.SPECIAL | f.DIGITS],
    ['qqqqqqqqq',                 1, f.LOWER_CASE | f.REPEATS | f.SAME_CHAR],
    ['qqqqqqqqqqqqq',             1, f.LOWER_CASE | f.REPEATS | f.SAME_CHAR],
    ['qqqqqqqqqqqqqqqqqqqqqqqqq', 1, f.LOWER_CASE | f.REPEATS | f.SAME_CHAR],
    ['D0g.....................',  6, f.LOWER_CASE | f.UPPER_CASE | f.SPECIAL | f.DIGITS | f.REPEATS],
    ['correcthorsebatterystaple', 6, f.LOWER_CASE]
  ];

  describe('#flags', function() {
    testCases.forEach(function(testCase) {
      var password = testCase[0], expected = testCase[2];
      var message = 'returns flags ' + toBinaryStr(expected) + ' for password "' +
        password + '" (' + password.length + ')';
      it(message, function() {
        expect( PasswordStrength.flags(password) ).to.equal(expected);
      });
    });
  });

  describe('#score', function() {
    testCases.forEach(function(testCase) {
      var password = testCase[0], expected = testCase[1];
      var message = 'returns ' + expected + ' for password "' +
        password + '" (' + password.length + ')';
      it(message, function() {
        expect( PasswordStrength.score(password) ).to.equal(expected);
      });
    });
  });
});
/* vim:set ts=2 sw=2 et fdm=marker: */
