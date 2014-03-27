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
  return this.domElement.value;
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
DOMBuilder.prototype.prepend = function(node) {
  node = (node instanceof DOMBuilder) ? node.element : node;
  this.domElement.parentNode.insertBefore(this.domElement, node);
  return this;
};

DOMBuilder.prepend = function(element, node) {
  return DOMBuilder(element).prepend(node).domElement;
};

// append (chainable) {{{1
DOMBuilder.prototype.append = function(node) {
  DOMBuilder(this.domElement.nextSibling).prepend(node);
  return this;
};

DOMBuilder.append = function(element, node, parentNode) {
  return DOMBuilder(element).append(node, parentNode).domElement;
};

// add (chainable) {{{1
DOMBuilder.prototype.add = function(child) {
  child = (child instanceof DOMBuilder) ? child.value() : child;
  this.domElement.appendChild(child);
  return this;
};

DOMBuilder.add = function(element, child) {
  return DOMBuilder(element).add(child).domElement;
};

// proxyEvent (chainable) {{{1
DOMBuilder.prototype.proxyEvent = function(eventName, fn) {
  if (this.domElement.addEventListener) {
    this.domElement.addEventListener(eventName, fn, false);
  } else {
    this.domElement.attachEvent('on' + eventName, fn);
  }
  return this;
};

DOMBuilder.proxyEvent = function(element, eventName, fn) {
  return DOMBuilder(element).proxyEvent(eventName, fn).domElement;
};

// addClass (chainable) {{{1
DOMBuilder.prototype.addClass = function(className) {
  this.domElement.className = (this.domElement.className + ' ' + className).trim();
  return this;
};

DOMBuilder.addClass = function(element, className) {
  return DOMBuilder(element).addClass(className).domElement;
};

// findElement (static) {{{1
DOMBuilder.findElement = function(selector) {
  return document.querySelector(selector);
};

// find (static) {{{1
DOMBuilder.find = function(selector) {
  return DOMBuilder(DOMBuilder.findElement(selector));
};

// wrapper {{{1
DOMBuilder.wrapper = function() {
  var wrapper = document.createElement('div');
  return DOMBuilder(wrapper).addClass('pw-wrapper');
};
// }}}1

module.exports = DOMBuilder;
/* vim:set ts=2 sw=2 et fdm=marker: */
