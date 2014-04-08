(function() {
  var loginWidget, registrationWidget;
  var commonPasswordsUrl = '/commonPasswords.json';

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

  $.getJSON(commonPasswordsUrl)
    .done(function(data) {
      PasswordWidget.CommonPasswords.setPasswords(data);
      $.AlertBox.success('Common password list downloaded and activated.');
    })
    .fail(function(reason) {
      $.AlertBox.danger(
        'Error downloading "' + commonPasswordsUrl + '" ' +
        reason.responseText
      );
    });

})();
