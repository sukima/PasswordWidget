(function() {
  var loginWidget, registrationWidget;

  function showInfoPopup(e) {
    var dialog = $('#password-widget-info-dialog');
    $('.modal-body', dialog).html(e.infoText);
    dialog.modal('show');
  }

  function attachWidgets() {
    loginWidget = new PasswordWidget('#login-pass', {
        showInfoButton:     false,
        showGenerateButton: false
      })
      .on('showInfo', showInfoPopup)
      .attach();

    registrationWidget = new PasswordWidget('#reg-pass')
      .on('showInfo', showInfoPopup)
      .attach();
  }

  $(attachWidgets);
})();
