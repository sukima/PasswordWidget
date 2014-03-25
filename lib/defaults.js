// defaults - Simple object defaults
// Code modified from Underscore

function defaults(obj) {
  var values = Array.prototype.slice.call(arguments, 1);
  values.forEach(function(source) {
    if (source) {
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

module.exports = defaults;
/* vim:set ts=2 sw=2 et fdm=marker: */
