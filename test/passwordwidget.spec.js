var expect = chai.expect;
var PasswordWidget = require('../lib/passwordwidget');

describe('PasswordWidget', function() {
  var sandbox = sinon.sandbox.create();

  afterEach(function() {
    sandbox.restore();
  });

  describe('Constructor', function() {
    it('takes a selector as a string');
    it('takes a DOMElement');
    it('assignes DOMElements to elements property');
  });

  describe('::attach', function() {
    it('throws an exception when PasswordWidget was destroyed');
  });

  describe('::detach', function() {
    it('throws an exception when PasswordWidget was destroyed');
  });

  describe('::destroy', function() {
    it('sets the DOMElements to null');
  });
});
/* vim:set ts=2 sw=2 et fdm=marker: */
