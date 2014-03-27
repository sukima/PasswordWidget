var PasswordWidget = require('../lib/passwordwidget');

describe('PasswordWidget', function() {
  beforeEach(function() {
    fixtures.set('<input id="test-input" type="password"/>');
    this.$pwNode = $('#test-input',  fixtures.window().document);
    this.pwWidget = new PasswordWidget(this.$pwNode.get(0));
  });

  afterEach(function() {
    fixtures.cleanUp();
  });

  describe('Constructor', function() {
  });

  describe('::attach', function() {
  });

  describe('::attachTo', function() {
  });

  describe('::detach', function() {
  });
});
/* vim:set ts=2 sw=2 et fdm=marker: */
