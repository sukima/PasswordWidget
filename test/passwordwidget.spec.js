var PasswordWidget = require('../lib/passwordwidget');

describe('PasswordWidget', function() {
  beforeEach(function() {
    fixtures.set('<input id="test-input" type="password"/>');
    this.$pwNode = $('#test-input',  fixtures.window().document);
    this.pwWidget = new PasswordWidget(this.$pwNode.get(0));
  });

  afterEach(function() {
    fixtures.cleanUp();
  });

  describe('Constructor', function() {
    it('adds "pw-input" class to input element', function() {
      $expect(this.$pwNode).to.have.class('pw-input');
    });

    it('throws a TypeError if element is not an input field', function() {
      var el = document.createElement('div');

      function newPasswordWidget() {
        new PasswordWidget(el);
      }

      expect(newPasswordWidget).to.throwError(function(e) {
        expect(e).to.be.a(TypeError);
      });
    });
  });

  describe('::attach', function() {
  });

  describe('::attachTo', function() {
  });

  describe('::detach', function() {
  });
});
/* vim:set ts=2 sw=2 et fdm=marker: */
