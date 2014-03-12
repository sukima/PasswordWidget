// PasswordStrength - utility to test the stength of a password

// #strengthScore {{{1
exports.score = function(password) {
  var score = 0;

  if (password.length > 6)          { score++; }
  if ((password.match(/[a-z]/)) &&
    (password.match(/[A-Z]/)))      { score++; }
  if (password.match(/\d+/))        { score++; }
  if (password.match(/[^a-z\d]+/i)) { score++; }
  if (password.length > 12)         { score++; }

  return score;
};
// }}}1

/* vim:set ts=2 sw=2 et fdm=marker: */
