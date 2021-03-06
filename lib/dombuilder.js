// DOMBuilder - Utility to build PasswordWidget DOM objects
//
// Usage: new DOMBuilder.wrapper().addClass('foo');

// Chainable Wrapper {{{1
function DOMBuilder(element) {
  if (element instanceof DOMBuilder) { return element; }
  if (!(this instanceof DOMBuilder)) { return new DOMBuilder(element); }
  this.domElement = element;
}

// value {{{1
DOMBuilder.prototype.value = function() {
  try {
    return this.assertTag('input').domElement.value;
  } catch (e) {
    return this.domElement.innerText || this.domElement.textContent;
  }
};

DOMBuilder.value = function(element) {
  return DOMBuilder(element).value();
};

// assertTag (chainable) {{{1
DOMBuilder.prototype.assertTag = function(tagName) {
  var nodeName = (this.domElement.nodeName || '').toLowerCase();
  if (nodeName !== tagName) {
    throw new TypeError('expected ' + nodeName + ' element to be a ' + tagName + ' element.');
  }
  return this;
};

DOMBuilder.assertTag = function(element, tagName) {
  return DOMBuilder(element).assertTag(tagName).domElement;
};

// prepend (chainable) {{{1
DOMBuilder.prototype.prepend = function(newNode) {
  newNode = (newNode instanceof DOMBuilder) ? newNode.domElement : newNode;
  this.domElement.parentNode.insertBefore(newNode, this.domElement);
  return this;
};

DOMBuilder.prepend = function(element, newNode) {
  return DOMBuilder(element).prepend(newNode).domElement;
};

// append (chainable) {{{1
DOMBuilder.prototype.append = function(newNode) {
  newNode = (newNode instanceof DOMBuilder) ? newNode.domElement : newNode;
  // Cannot resuse this.prepend() since we have to manage nextSibling differently.
  this.domElement.parentNode.insertBefore(newNode, this.domElement.nextSibling);
  return this;
};

DOMBuilder.append = function(element, newNode) {
  return DOMBuilder(element).append(newNode).domElement;
};

// add (chainable) {{{1
DOMBuilder.prototype.add = function(child) {
  child = (child instanceof DOMBuilder) ? child.domElement : child;
  this.domElement.appendChild(child);
  return this;
};

DOMBuilder.add = function(element, child) {
  return DOMBuilder(element).add(child).domElement;
};

// remove (chainable) {{{1
DOMBuilder.prototype.remove = function() {
  if (this.domElement.parentNode) {
    this.domElement.parentNode.removeChild(this.domElement);
  }
  return this;
};

DOMBuilder.remove = function(element) {
  return DOMBuilder(element).remove().domElement;
};

// addClass (chainable) {{{1
DOMBuilder.prototype.addClass = function(className) {
  this.domElement.className = (this.domElement.className + ' ' + className).trim();
  return this;
};

DOMBuilder.addClass = function(element, className) {
  return DOMBuilder(element).addClass(className).domElement;
};

// setText (chainable) {{{1
DOMBuilder.prototype.setText = function(content, toolTip) {
  if (Array.isArray(content)) {
    toolTip = content[1];
    content = content[0];
  }
  this.domElement.innerHTML = content;
  if (toolTip) { this.setAttr('title', toolTip); }
  return this;
};

DOMBuilder.setText = function(element, content, toolTip) {
  return DOMBuilder(element).setText(content, toolTip).domElement;
};

// setAttr (chainable) {{{1
DOMBuilder.prototype.setAttr = function(atribute, value) {
  this.domElement[atribute] = value;
  return this;
};

DOMBuilder.setAttr = function(element, attribute, value) {
  return DOMBuilder(element).setAttr(attribute, value).domElement;
};

// proxyEvent (chainable) {{{1
DOMBuilder.prototype.proxyEvent = function(eventName, fn, shouldPreventDefault) {
  function wrappedFn(evt) {
    /* jshint expr:true */
    if (shouldPreventDefault) {
      (evt.preventDefault) ? evt.preventDefault() : evt.returnValue = false;
    }
    fn.apply(null, arguments);
    // ignore return value in events callbacks
  }

  if (this.domElement.addEventListener) {
    this.domElement.addEventListener(eventName, wrappedFn, false);
  } else {
    this.domElement.attachEvent('on' + eventName, wrappedFn);
  }

  return this;
};

DOMBuilder.proxyEvent = function(element, eventName, fn) {
  return DOMBuilder(element).proxyEvent(eventName, fn).domElement;
};

// findElement (static) {{{1
DOMBuilder.findElement = function(selector) {
  return document.querySelector(selector);
};

// find (static) {{{1
DOMBuilder.find = function(selector) {
  return DOMBuilder(DOMBuilder.findElement(selector));
};

// showAlert {{{1
DOMBuilder.showAlert = function(content) {
  // TODO: Don't use modal alert
  alert(content);
};

// Builders {{{1
// wrapper {{{2
DOMBuilder.wrapper = function() {
  var wrapper = document.createElement('div');
  return DOMBuilder(wrapper).addClass('pw-wrapper');
};

// button {{{2
DOMBuilder.button = function() {
  return DOMBuilder(document.createElement('a'))
    .addClass('pw-button');
};
// }}}1

module.exports = DOMBuilder;
/* vim:set ts=2 sw=2 et fdm=marker: */
