var DomEvents = require('./support/domevents');
var DOMBuilder = require('../lib/dombuilder');
var PasswordWidget = require('../lib/passwordwidget');

describe('PasswordWidget', function() {
  beforeEach(function() {
    setFixtures('<input id="test-input" type="password"/>');
    this.$pwNode = $('#test-input');
    this.pwWidget = new PasswordWidget(this.$pwNode.get(0), {
      showInfo:          false,
      showMask:          false,
      showGenerateLink:  false,
      showStrength:      false,
      showStrengthText:  false,
      showBlinkenlights: false
    });
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
    it('appends a wrapper with class "password-widget"', function() {
      $expect(this.container).to.have['class']('pw-wrapper');
      $expect(this.container).to.have['class']('password-widget');
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

  describe('#updateIndicators', function() {
    beforeEach(function() {
      this.callback = sinon.stub();
      this.pwWidget.on('update', this.callback);
      this.result = this.pwWidget.updateIndicators();
    });

    it('emits an "update" event', function() {
      sinon.assert.called(this.callback);
    });

    testChainability();
  });

  describe('UI Components', function() {
    var sandbox = sinon.sandbox.create();
    var mockEvent = {
      preventDefault: function() { }
    };

    beforeEach(function() {
      this.proxyEventSpy = sandbox.spy(DOMBuilder.prototype, 'proxyEvent');
      this.actionCallback = sandbox.spy();
    });

    afterEach(function() {
      sandbox.restore();
    });

    describe('#infoButton', function() {
      beforeEach(function() {
        this.showAlertStub = sandbox.stub(DOMBuilder, 'showAlert');
        this.infoButton = this.pwWidget.infoButton();
        this.triggerEvent = this.proxyEventSpy.getCall(0).args[1];
      });

      describe('without attached "showInfo" event listener', function() {
        beforeEach(function() {
          this.triggerEvent.call(null, mockEvent);
        });

        it('displays an alert', function() {
          sinon.assert.called(this.showAlertStub);
        });
      });

      describe('with attached "showInfo" event listener', function() {
        beforeEach(function() {
          this.showInfoCallback = sandbox.spy();
          this.pwWidget.on('showInfo', this.showInfoCallback);
          this.triggerEvent.call(null, mockEvent);
        });

        it('does not display an alert', function() {
          sinon.assert.notCalled(this.showAlertStub);
        });

        it('fires a "showInfo" event with {infoText: string}', function() {
          sinon.assert.calledWith(this.showInfoCallback, sinon.match({infoText: sinon.match.string}));
        });
      });
    });

    describe('#showHideButton', function() {
      beforeEach(function() {
        this.showHideButton = this.pwWidget.showHideButton();
        this.triggerEvent = this.proxyEventSpy.getCall(0).args[1];
        this.actionCallback = sandbox.spy();
        this.pwWidget.on('showHidePassword', this.actionCallback);
        this.pwWidget.isMasked = true;
      });

      it('fires "showHidePassword" event with {isMasked: boolean}', function() {
        this.triggerEvent.call(null, mockEvent);
        sinon.assert.calledWith(this.actionCallback, sinon.match({isMasked: sinon.match.bool}));
      });

      it('toggles isMasked state', function() {
        this.triggerEvent.call(null, mockEvent);
        expect(this.pwWidget.isMasked).to.be(false);

        this.triggerEvent.call(null, mockEvent);
        expect(this.pwWidget.isMasked).to.be(true);
      });

      it('toggles button state', function() {
        var $element    = $('a', this.showHideButton.domElement);
        var origContent = $element.text();
        var origTitle   = $element.attr('title');

        this.triggerEvent.call(null, mockEvent);
        $expect($element).to.not.contain(origContent);
        $expect($element).to.not.have.attr('title', origTitle);

        this.triggerEvent.call(null, mockEvent);
        $expect($element).to.contain(origContent);
        $expect($element).to.have.attr('title', origTitle);
      });
    });
  });

});
/* vim:set ts=2 sw=2 et fdm=marker: */
