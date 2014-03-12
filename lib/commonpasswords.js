// CommonPasswords - Utility to fetch and manage a list of common passwords

var paswordList = {};

// #addPasswords {{{1
exports.addPasswords = function(passwords) {
  var i, len;
  for (i = 0, len = passwords.length; i < len; i++) {
    paswordList[ passwords[i] ] = true;
  }
};

// #setPasswords {{{1
exports.setPasswords = function(obj) {
  paswordList = obj;
};

// #isCommon {{{1
exports.isCommon = function(password) {
  return paswordList[password] === true;
};

// #fetchList {{{1
exports.fetchList = function(url, callback) {
  if (typeof callback !== 'function') {
    callback = function() {};
  }

  function failed(e) {
    callback.call(this, e);
  }

  function success(e) {
    if (this.status >= 200 && this.status < 300) {
      try {
        exports.setPasswords(JSON.parse(this.responseText));
        callback.call(this, null);
      } catch (error) {
        failed.call(this, error);
      }
    } else {
      failed.call(this,
        new Error('Unable to handle server response (' +
          this.status + '): ' + this.responseText)
      );
    }
  }

  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', success);
  xhr.addEventListener('error', failed);

  xhr.open('GET', url);
  xhr.send();

  return xhr;
};
// }}}1

/* vim:set ts=2 sw=2 et fdm=marker: */
