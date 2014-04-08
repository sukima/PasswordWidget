// AlertBox - An abstraction around Twitter Bootstrap alerts.
(function($) {

  var autoHideTimeout = 5000;

  function AlertBox(selector) {
    this.element_ = $(selector || '#password-widget-alert')
      .clone().prependTo('body');
  }

  AlertBox.prototype.clearClasses = function() {
    this.element_.removeClass('alert-success alert-info alert-warning alert-danger');
    return this;
  };

  AlertBox.prototype.type = function(type) {
    this.element_.addClass('alert-' + type);
    return this;
  };

  AlertBox.prototype.setMessage = function(message) {
    $('.content', this.element_).html(message);
    return this;
  };

  AlertBox.prototype.show = function() {
    this.element_.show('slow');
    setTimeout(this.hide.bind(this), autoHideTimeout);
    return this;
  };

  AlertBox.prototype.hide = function() {
    this.element_.hide('slow');
    return this;
  };

  ['success', 'info', 'warning', 'danger'].forEach(function(type) {
    AlertBox[type] = function(message) {
      return new AlertBox()
        .setMessage(message)
        .type(type)
        .show();
    };
  });

  $.AlertBox = AlertBox;

})(jQuery);
/* vim:set ts=2 sw=2 et fdm=marker: */
