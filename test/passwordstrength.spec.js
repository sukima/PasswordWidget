var expect = chai.expect;
var PasswordStrength = require('../lib/passwordstrength');

describe('#score', function() {
  [
    ['',              0],
    ['abc',           0],
    ['abcdefgh',      1],
    ['AbCdefgh',      2],
    ['AbCd1234',      3],
    ['Ab$$1&^4',      4],
    ['Ab$$1&^4.....', 5]
  ]
  .forEach(function(testCase) {
    var password = testCase[0], expected = testCase[1];
    var message = 'returns ' + expected + ' for password "' +
      password + '" (' + password.length + ')';
    it(message, function() {
      expect( PasswordStrength.score(password) ).to.equal(expected);
    });
  });
});
/* vim:set ts=2 sw=2 et fdm=marker: */
