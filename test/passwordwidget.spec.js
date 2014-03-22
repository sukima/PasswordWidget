var PasswordWidget = require('../lib/passwordwidget');

describe('PasswordWidget', function() {
  var sandbox = sinon.sandbox.create();

  afterEach(function() {
    sandbox.restore();
  });

  describe('Constructor', function() {
    describe('type checking', function() {
      var testFn = function(selector) {
        return function() {
          return new PasswordWidget(selector);
        };
      };

      var typeCheck = function(e) {
        expect(e).to.be.a(TypeError);
      };

      it('throws a TypeError when selector is not found', function() {
        expect(testFn(null)).to.throwException(typeCheck);
        expect(testFn(undefined)).to.throwException(typeCheck);
        expect(testFn('')).to.throwException(typeCheck);
        expect(testFn('#element_does_not_exist')).to.throwException(typeCheck);
      });

      it('throws a TypeError when DOMElement is not of tye <INPUT>', function() {
        var dom_element = document.createElement('li');
        expect(testFn(dom_element)).to.throwException(typeCheck);
      });

      it('does not throw an error when selector is found and is of type <INPUT>', function() {
        var dom_element = document.createElement('input');
        expect(testFn(dom_element)).to.not.throwException();
      });
    });
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
