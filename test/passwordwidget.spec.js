var DomEvents = require('./support/domevents');
var PasswordWidget = require('../lib/passwordwidget');

describe('PasswordWidget', function() {
  beforeEach(function() {
    setFixtures('<input id="test-input" type="password"/>');
    this.$pwNode = $('#test-input');
    this.pwWidget = new PasswordWidget(this.$pwNode.get(0));
  });

  afterEach(function() {
    mocha.getFixtures().cleanUp();
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

  function testChainability() {
    it('is chainable', function() {
      expect(this.result).to.be(this.pwWidget);
    });
  }

  function testAttachBehaviour() {
    it('appends a container below the input element', function() {
      $expect(this.container).to.have['class']('password-widget');
      $expect(this.container).to.have['class']('pw-wrapper');
    });
  }

  describe('#attach', function() {
    beforeEach(function() {
      this.result = this.pwWidget.attach();
      this.container = this.$pwNode.next();
    });

    testAttachBehaviour();
    testChainability();
  });

  describe('#attachTo', function() {
    beforeEach(function() {
      appendSetFixtures('<div id="test-attachTo"></div>');
      var attachToElement = $('#test-attachTo');
      this.result = this.pwWidget.attachTo(attachToElement.get(0));
      this.container = attachToElement.children().get(0);
    });

    testAttachBehaviour();
    testChainability();
  });

  describe('#detach', function() {
    beforeEach(function() {
      this.result = this.pwWidget.attach().detach();
    });

    it('removes an attached element from the DOM', function() {
      expect(this.$pwNode.next().get(0))
        .to.not.be(this.pwWidget.container().domElement);
    });

    testChainability();
  });

  describe('Events', function() {
    it('emits a "update" event when input emits a "keyup" event', function() {
      var callback = sinon.stub();
      this.pwWidget.on('update', callback);
      DomEvents.dispatchKeyup(this.$pwNode.get(0));
      sinon.assert.called(callback);
    });
  });
});
/* vim:set ts=2 sw=2 et fdm=marker: */
