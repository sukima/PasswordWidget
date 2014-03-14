var PasswordWidget = require('../lib/passwordwidget');

describe('PasswordWidget Utilities', function() {

  describe('defaults object', function() {
    it('exports a locale object', function() {
      expect( PasswordWidget.defaults.locale ).to.be.an('object');
    });

    it('exports a colors array', function() {
      expect( PasswordWidget.defaults.colors ).to.be.an(Array);
    });
  });

  describe('static methods', function() {

    describe('#scoreColor', function() {
      before(function() {
        this.origColors = PasswordWidget.defaults.colors;
        PasswordWidget.defaults.colors = ['red', 'green', 'blue'];
      });

      after(function() {
        PasswordWidget.defaults.colors = this.origColors;
      });

      it('returns a string based on score value', function() {
        [
          [-1, 'red'],
          [0,  'red'],
          [1,  'green'],
          [2,  'blue'],
          [3,  'blue']
        ]
        .forEach(function(testCase) {
          expect( PasswordWidget.scoreColor(testCase[0]) ).to.equal(testCase[1]);
        });
      });
    });

    describe('#scoreText', function() {
      it('returns tooCommon string with a score below 0 (edge case)', function() {
        expect( PasswordWidget.scoreText(-1) )
          .to.equal(PasswordWidget.defaults.locale.tooCommon);
      });

      it('returns an empty string with a 0 score', function() {
        expect( PasswordWidget.scoreText(0) ).to.equal('');
      });

      it('returns the strength as text based on score', function() {
        var text = PasswordWidget.defaults.locale;
        [
          [-1, text.tooCommon],
          [ 0, ''],
          [ 1, text.weak],
          [ 2, text.weak],
          [ 3, text.medium],
          [ 4, text.good],
          [ 5, text.excelent]
        ]
        .forEach(function(testCase) {
          expect( PasswordWidget.scoreText(testCase[0]) ).to.equal(testCase[1]);
        });
      });
    });

    describe('#scoreMeterWidth', function() {
      it('returns a css size based on score', function() {
        expect( PasswordWidget.scoreMeterWidth(-1) ).to.equal(0);
        expect( PasswordWidget.scoreMeterWidth( 0) ).to.equal(0);
        for (var i = 1; i < 5; i++) {
          expect( PasswordWidget.scoreMeterWidth(i) ).to.match(/^\d+px$/);
        }
      });
    });
  });
});
/* vim:set ts=2 sw=2 et fdm=marker: */
