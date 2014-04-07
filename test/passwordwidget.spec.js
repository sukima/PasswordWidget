var DomEvents = require('./support/domevents');
var DOMBuilder = require('../lib/dombuilder');
var PasswordWidget = require('../lib/passwordwidget');

describe('PasswordWidget', function() {
  beforeEach(function() {
    setFixtures('<input id="test-input" type="password" value="" />');
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

  describe('Event listeners', function() {
    describe('keyup on input element', function() {
      it('calls #updateIndicators', sinon.test(function() {
        var node                 = this.$pwNode.get(0);
        var updateIndicatorsStub = this.stub(PasswordWidget.prototype, 'updateIndicators');
        var test_obj             = new PasswordWidget(node);
        DomEvents.dispatchKeyup(node);
        sinon.assert.called(updateIndicatorsStub);
      }));
    });

    describe('click on show/hide button', function() {
      it('calls #setMask', sinon.test(function() {
        var node           = this.$pwNode.get(0);
        var setMaskStub    = this.stub(PasswordWidget.prototype, 'setMask');
        var test_obj       = new PasswordWidget(node);
        var showHideButton = test_obj.showHideButton();
        var $element       = $('a', showHideButton.domElement);
        DomEvents.dispatchClick($element.get(0));
        sinon.assert.calledWith(setMaskStub);
      }));
    });

    describe('click on info button', function() {
      it('calls #showInfo', sinon.test(function() {
        var node         = this.$pwNode.get(0);
        var showInfoStub = this.stub(PasswordWidget.prototype, 'showInfo');
        var test_obj     = new PasswordWidget(node);
        var infoButton   = test_obj.infoButton();
        var $element     = $('a', infoButton.domElement);
        DomEvents.dispatchClick($element.get(0));
        sinon.assert.calledWith(showInfoStub);
      }));
    });

    describe('click on generate button', function() {
      it('calls #generate', sinon.test(function() {
        var node           = this.$pwNode.get(0);
        var generateStub   = this.stub(PasswordWidget.prototype, 'generate');
        var test_obj       = new PasswordWidget(node);
        var generateButton = test_obj.generateButton();
        var $element       = $('a', generateButton.domElement);
        DomEvents.dispatchClick($element.get(0));
        sinon.assert.calledWith(generateStub);
      }));
    });
  });

  describe('#updateIndicators', function() {
    beforeEach(function() {
      this.callback = sinon.stub();
      this.pwWidget.on('update', this.callback);
      this.result = this.pwWidget.updateIndicators();
    });

    it('emits an "update" event with computed information values', function() {
      sinon.assert.calledWith(this.callback, sinon.match({
        password: sinon.match.string,
        score:    sinon.match.number,
        flags:    sinon.match.number,
        isCommon: sinon.match.bool
      }));
    });

    testChainability();
  });

  describe('#setMask', function() {
    beforeEach(function() {
      this.callback = sinon.stub();
      this.pwWidget.on('showHidePassword', this.callback);
      this.result = this.pwWidget.setMask();
    });

    it('sets input type ("password"/"text")', sinon.test(function() {
      var setAttrStub = this.stub(DOMBuilder.prototype, 'setAttr');
      this.pwWidget.setMask(true);
      sinon.assert.calledWith(setAttrStub, 'type', 'password');
      this.pwWidget.setMask(false);
      sinon.assert.calledWith(setAttrStub, 'type', 'text');
    }));

    it('emits an "showHidePassword" event with {isMasked: boolean}', function() {
      sinon.assert.calledWith(this.callback, sinon.match({isMasked: sinon.match.bool}));
    });

    testChainability();
  });

  describe('#showInfo', function() {
    var sandbox = sinon.sandbox.create();

    beforeEach(function() {
      this.showAlertStub = sandbox.stub(DOMBuilder, 'showAlert');
      this.result = this.pwWidget.showInfo();
    });

    afterEach(function() {
      sandbox.restore();
    });

    testChainability();

    describe('without attached "showInfo" event listener', function() {
      it('displays an alert', function() {
        sinon.assert.called(this.showAlertStub);
      });
    });

    describe('with attached "showInfo" event listener', function() {
      beforeEach(function() {
        this.showAlertStub.reset();
        this.showInfoCallback = sandbox.spy();
        this.pwWidget.on('showInfo', this.showInfoCallback);
        this.pwWidget.showInfo();
      });

      it('does not display an alert', function() {
        sinon.assert.notCalled(this.showAlertStub);
      });

      it('fires a "showInfo" event with {infoText: string}', function() {
        sinon.assert.calledWith(this.showInfoCallback, sinon.match({infoText: sinon.match.string}));
      });
    });
  });

  describe('#generate', function() {
    beforeEach(function() {
      this.callback = sinon.stub();
      this.pwWidget.on('generatePassword', this.callback);
      this.$pwNode.val('foobar');
      this.result = this.pwWidget.generate();
    });

    it('fires a "generatePassword" event with {password: string}', function() {
      sinon.assert.calledWith(this.callback, sinon.match({password: sinon.match.string}));
    });

    it('changes the input element\'s value', function() {
      $expect(this.$pwNode)
        .to.not.have.value('')
        .and.not.have.value('foobar');
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

    describe('#showHideButton', function() {
      beforeEach(function() {
        this.pwWidget.isMasked = true;
        this.setMaskStub       = sandbox.stub(PasswordWidget.prototype, 'setMask');
        this.showHideButton    = this.pwWidget.showHideButton();
        this.triggerEvent      = this.proxyEventSpy.getCall(0).args[1];
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

      it('has the classes "pw-show-mask pw-button"', function() {
        $expect(this.showHideButton.domElement)
          .to.have['class']('pw-show-mask');
        $expect(this.showHideButton.domElement)
          .to.have['class']('pw-button');
      });

      it('calls #setMask', function() {
        this.triggerEvent.call(null, mockEvent);
        sinon.assert.called(this.setMaskStub);
      });
    });

    describe('#infoButton', function() {
      beforeEach(function() {
        this.infoButton = this.pwWidget.infoButton();
      });

      it('has the classes "pw-info pw-button"', function() {
        $expect(this.infoButton.domElement)
          .to.have['class']('pw-info');
        $expect(this.infoButton.domElement)
          .to.have['class']('pw-button');
      });
    });

    describe('#generateButton', function() {
      beforeEach(function() {
        this.generateButton = this.pwWidget.generateButton();
      });

      it('has the classes "pw-generate pw-button"', function() {
        $expect(this.generateButton.domElement)
          .to.have['class']('pw-generate')
          .and.to.have['class']('pw-button');
      });
    });
  });

});
/* vim:set ts=2 sw=2 et fdm=marker: */
