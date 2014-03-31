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

  describe.skip('::detach', function() {
  });

  describe('Events', function() {
    it('emits a "update" event when input emits a "keyup" event', function() {
      var evt;
      var callback = sinon.stub();
      var node = this.$pwNode.get(0);
      this.pwWidget.on('update', callback);

      // Have to use dispatchEvent/fireEvent because jQuery.trigger will not
      // fire an event attached via addEventListener. Each environment has an
      // unusual way to trigger a keyup event.
      if (node.dispatchEvent) {
        // Sane browsers
        try {
          // Chrome, Safari, Firefox
          evt = new KeyboardEvent('keyup');
        } catch (e) {
          // PhantomJS (wat!)
          evt = document.createEvent('KeyboardEvent');
          evt.initEvent('keyup', true, false);
        }
        evt.keyCode = 32;
        node.dispatchEvent(evt);
      } else {
        // IE 8
        evt = document.createEventObject('KeyboardEvent');
        evt.keyCode = 32;
        node.fireEvent('onkeyup', evt);
      }

      sinon.assert.called(callback);
    });
  });

  describe.skip('Unobtrusive DOM manipulations', function() {
  });
});
/* vim:set ts=2 sw=2 et fdm=marker: */
