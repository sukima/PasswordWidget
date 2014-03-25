// DOMBuilder - Utility to build PasswordWidget DOM objects
//
// Usage: new DOMBuilder(context).wrapper();

// Constructor {{{1
function DOMBuilder(context) {
  this.context = context;
}

// wrapper {{{1
DOMBuilder.prototype.wrapper = function(className) {
  var wrapper = document.createElement('div');
  wrapper.className = className + ' pw-wrapper';
  return wrapper;
};

DOMBuilder

// before {{{1
DOMBuilder.prototype.before = function(el, node, parentNode) {
  (parentNode || node.parentNode).insertBefore(el, node);
};

// after {{{1
DOMBuilder.prototype.after = function(el, node, parentNode) {
  this.before(el, node.nextSibling, (parentNode || node.parentNode));
};

// addTo {{{1
DOMBuilder.prototype.addTo = function(parentNode, element) {
  parentNode.appendChild(element);
};
// }}}1

module.exports = DOMBuilder;
/* vim:set ts=2 sw=2 et fdm=marker: */
