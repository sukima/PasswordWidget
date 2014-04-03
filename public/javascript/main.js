(function() {
  var loginWidget, registrationWidget;

  function showInfoPopup(e) {
    var dialog = $('#password-widget-info-dialog');
    $('.modal-body', dialog).html(e.infoText);
    dialog.modal('show');
  }

  function attachWidgets() {
    loginWidget = new PasswordWidget('#login-pass', {
      showInfo:     false,
      showGenerate: false
    })
    .attach();

    registrationWidget = new PasswordWidget('#reg-pass')
      .on('showInfo', showInfoPopup)
      .attach();
  }

  $(attachWidgets);
})();
