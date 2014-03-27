var PasswordWidget = require('../lib/passwordwidget');

describe('PasswordWidget', function() {
  beforeEach(function() {
    setFixtures('<input id="test-input" type="password"/>');
    this.$pwNode = $('#test-input');
    this.pwWidget = new PasswordWidget(this.$pwNode.get(0));
  });

  describe('Constructor', function() {
    it('adds "pw-input" class to input element', function() {
      $expect(this.$pwNode).to.have['class']('pw-input');
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

  describe('Events', function() {
    it('emits a "update" event when input emits a "keyup" event', function() {
      var callback = sinon.stub();
      this.pwWidget.on('update', callback);
      // Have to use dispatchEvent because jQuery.trigger will not fire an
      // event attached via addEventListener.
      this.$pwNode.get(0).dispatchEvent(new Event('keyup'));
      sinon.assert.called(callback);
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
