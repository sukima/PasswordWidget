var DOMBuilder = require('../lib/dombuilder');

var clickElement = function (node){
  var evt;
  if (node.dispatchEvent) {
    // Everybody but IE8
    evt = document.createEvent('MouseEvent');
    evt.initMouseEvent(
      'click',
      true, /* bubble */
      true, /* cancelable */
      window, null,
      0, 0, 0, 0, /* coordinates */
      false, false, false, false, /* modifier keys */
      0, /*left*/
      null
    );
    node.dispatchEvent(evt);
  } else {
    // IE8
    evt = document.createEventObject('MouseEvent');
    node.fireEvent('onclick', evt);
  }
};

describe('DOMBuilder', function() {
  beforeEach(function() {
    setFixtures('<div id="test-wrapper"><div id="test-element"></div></div>');
    this.test_element = $('#test-element');
    this.test_wrapper = $('#test-wrapper');
    this.test_obj     = DOMBuilder(this.test_element.get(0));
  });

  afterEach(function() {
    mocha.getFixtures().cleanUp();
  });

  describe('#value', function() {
    it('returns the value of input elements', function() {
      var input_el = document.createElement('input');
      input_el.type = 'text';
      input_el.value = 'test_value';

      expect(DOMBuilder(input_el).value()).to.be('test_value');
      expect(DOMBuilder.value(input_el)).to.be('test_value');
    });

    it('returns innerText/textContent on non input elements', function() {
      var div_el = document.createElement('div');
      div_el.innerHTML = '<b>test_value</b>';

      expect(DOMBuilder(div_el).value()).to.be('test_value');
      expect(DOMBuilder.value(div_el)).to.be('test_value');
    });
  });

  describe('#assertTag', function() {
    beforeEach(function() {
      this.input_element = document.createElement('input');
    });

    it('is a noop when the element matches the tested type', function() {
      var _this = this;

      expect(function() { DOMBuilder(_this.input_element).assertTag('input'); })
        .to.not.throwError();
      expect(function() { DOMBuilder.assertTag(_this.input_element, 'input'); })
        .to.not.throwError();
    });

    it('throws a TypeError when element does not match the tested type', function() {
      var _this = this;

      function checkTypeError(err) { expect(err).to.be.a(TypeError); }

      expect(function() { DOMBuilder(_this.input_element).assertTag('div'); })
        .to.throwError(checkTypeError);
      expect(function() { DOMBuilder.assertTag(_this.input_element, 'div'); })
        .to.throwError(checkTypeError);
    });

    it('is chainable', function() {
      expect(this.test_obj.assertTag('div')).to.be(this.test_obj);
    });
  });

  describe('#prepend', function() {
    it('inserts an element before the target element', function() {
      var new_element = document.createElement('div');
      this.test_obj.prepend(new_element);
      expect(this.test_element.prev().get(0)).to.be(new_element);

      new_element = document.createElement('p');
      DOMBuilder.prepend(this.test_element.get(0), new_element);
      expect(this.test_element.prev().get(0)).to.be(new_element);
    });

    it('is chainable', function() {
      expect(this.test_obj.prepend(document.createElement('div')))
        .to.be(this.test_obj);
    });
  });

  describe('#append', function() {
    it('inserts an element after the target element', function() {
      var new_element = document.createElement('div');
      this.test_obj.append(new_element);
      expect(this.test_element.next().get(0)).to.be(new_element);

      new_element = document.createElement('p');
      DOMBuilder.append(this.test_element.get(0), new_element);
      expect(this.test_element.next().get(0)).to.be(new_element);
    });

    it('is chainable', function() {
      expect(this.test_obj.append(document.createElement('div')))
        .to.be(this.test_obj);
    });
  });

  describe('#add', function() {
    it('appends an element into the target element', function() {
      var new_element = document.createElement('div');
      DOMBuilder(this.test_wrapper.get(0)).add(new_element);
      expect(this.test_wrapper.children().last().get(0)).to.be(new_element);

      new_element = document.createElement('p');
      DOMBuilder.add(this.test_wrapper.get(0), new_element);
      expect(this.test_wrapper.children().last().get(0)).to.be(new_element);
    });

    it('is chainable', function() {
      expect(this.test_obj.add(document.createElement('div')))
        .to.be(this.test_obj);
    });
  });

  describe('#addClass', function() {
    it('adds a class to an element', function() {
      var el = this.test_element.get(0);

      this.test_obj.addClass('test-class1');
      $expect(el).to.have['class']('test-class1');

      DOMBuilder.addClass(el, 'test-class2');
      $expect(el).to.have['class']('test-class2');
    });

    it('is chainable', function() {
      expect(this.test_obj.addClass('foo')).to.be(this.test_obj);
    });
  });

  describe('#proxyEvent', function() {
    it('attaches a function to an event', function() {
      var callback = sinon.stub();
      this.test_obj.proxyEvent('click', callback);
      clickElement(this.test_element.get(0));
      sinon.assert.called(callback);
    });

    it('is chainable', function() {
      expect(this.test_obj.proxyEvent('click', sinon.stub())).to.be(this.test_obj);
    });
  });

  describe('#findElement', function() {
    it('returns a DOM element', function() {
      expect(DOMBuilder.findElement('#test-element'))
        .to.be(this.test_element.get(0));
    });
  });

  describe('#find', function() {
    it('returns a DOMBuilder object', function() {
      var result = DOMBuilder.find('#test-element');
      expect(result).to.be.a(DOMBuilder);
      expect(result.domElement).to.be(this.test_element.get(0));
    });
  });

  describe('#wrapper', function() {
    beforeEach(function() {
      this.test_wrapper = DOMBuilder.wrapper();
    });

    it('returns a DOMBuilder', function() {
      expect(this.test_wrapper).to.be.a(DOMBuilder);
    });

    it('adds a "pw-wrapper" class', function() {
      $expect(this.test_wrapper.domElement).to.have['class']('pw-wrapper');
    });
  });

});
/* vim:set ts=2 sw=2 et fdm=marker: */