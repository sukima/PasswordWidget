// domEvents - Utility for dispatching events

// dispatchClick {{{1
exports.dispatchClick = function(node) {
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

// dispatchKeyup {{{1
exports.dispatchKeyup = function(node) {
  var evt;
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
};
// }}}1

/* vim:set ts=2 sw=2 et fdm=marker: */
