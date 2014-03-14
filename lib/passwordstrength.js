// PasswordStrength - utility to test the stength of a password

var SCORE_FLAGS = {
  // Entropy
  LOWER_CASE: 1,
  UPPER_CASE: 2,
  DIGITS:     4,
  SPECIAL:    8,
  // Bad Patterns
  REPEATS:    16,
  SAME_CHAR:  32
};

function getFlags(password) {
  var flags = 0;
  if (/[a-z]/.test(password))     { flags |= SCORE_FLAGS.LOWER_CASE; }
  if (/[A-Z]/.test(password))     { flags |= SCORE_FLAGS.UPPER_CASE; }
  if (/\d/.test(password))        { flags |= SCORE_FLAGS.DIGITS; }
  if (/[^a-z\d]/i.test(password)) { flags |= SCORE_FLAGS.SPECIAL; }
  if (/(.)\1{5,}/.test(password)) { flags |= SCORE_FLAGS.REPEATS; }
  if (/^(.)\1+$/.test(password))  { flags |= SCORE_FLAGS.SAME_CHAR; }
  return flags;
}

function getScore(password) {
  var score = 0;
  var flags = getFlags(password);

  // Order of conditionals is important
  if (password.length <= 6)          { return 0; }
  if (flags & SCORE_FLAGS.SAME_CHAR) { return 1; }
  if (password.length > 20)          { return 6; }

  if (password.length > 12)           { score++; }
  if (password.length > 16)           { score++; }
  if (flags & SCORE_FLAGS.LOWER_CASE) { score++; }
  if (flags & SCORE_FLAGS.UPPER_CASE) { score++; }
  if (flags & SCORE_FLAGS.DIGITS)     { score++; }
  if (flags & SCORE_FLAGS.SPECIAL)    { score++; }
  if (flags & SCORE_FLAGS.REPEATS)    { score--; }

  return score;
}

module.exports = {
  SCORE_FLAGS: SCORE_FLAGS,
  flags:       getFlags,
  score:       getScore
};

/* vim:set ts=2 sw=2 et fdm=marker: */
