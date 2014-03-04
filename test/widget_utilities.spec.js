require('../lib/pollyfills');
var expect = chai.expect;
var laplace = require('laplace');
var PasswordWidget = require('../lib/passwordwidget');

describe('PasswordWidget Utilities', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(function() {
    this.rand = sandbox.stub(Math, 'random', laplace.createMock(100));
    this.password = '@@aaABaB@000@'; // seeded by laplace
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('defaults object', function() {
    it('exports a locale object', function() {
      expect( PasswordWidget.defaults.locale ).to.be.an('object');
    });

    it('exports a colors array', function() {
      expect( PasswordWidget.defaults.colors ).to.be.an.instanceof(Array);
    });
  });

  describe('static methods', function() {
    describe('#generatePassword', function() {
      it("returns a string", function() {
        expect( PasswordWidget.generatePassword() ).to.equal(this.password);
      });
    });

    describe('#isACommonPassword', function() {
      it('returns false when commonPasswords is empty (default)', function() {
        PasswordWidget.setCommonPasswords({});
        expect( PasswordWidget.isACommonPassword('monkey') ).to.be.false;
      });

      it('returns boolean based on password existence in dictionary lookup', function() {
        PasswordWidget.addCommonPasswords(['monkey']);
        // Common password (monkey)
        expect( PasswordWidget.isACommonPassword('monkey') ).to.be.true;
        // Random password (seeded by laplace and generated through generatePassword)
        expect( PasswordWidget.isACommonPassword(this.password) ).to.be.false;
      });
    });

    describe('#fetchPasswordList', function() {
      var responses = [
        // Good responses:
        ["/200/good.json", [200, {'Content-Type': 'application/json'}, '{}']],
        // Bad responses:
        ["/404/good.json", [404, {'Content-Type': 'application/json'}, '{}']],
        ["/200/bad.json",  [200, {'Content-Type': 'application/json'}, 'this is bad JSON']],
        ["/200/html",      [200, {'Content-Type': 'text/html'},        'OK']],
        ["/500/html",      [500, {'Content-Type': 'text/html'},        'Not OK']]
      ];

      beforeEach(function() {
        this.callback = sandbox.spy();
        sandbox.useFakeServer();
        responses.forEach(function(response) {
          sandbox.server.respondWith(response[0], response[1]);
        });
      });

      describe('with success', function() {
        beforeEach(function() {
          sandbox.spy(PasswordWidget, 'setCommonPasswords');
          PasswordWidget.fetchPasswordList('/200/good.json', this.callback);
          sandbox.server.respond();
        });

        it('calls a callback with a null argument', function() {
          sinon.assert.calledWith(this.callback, null);
        });

        it('calls #setCommonPasswords', function() {
          sinon.assert.called(PasswordWidget.setCommonPasswords);
        });
      });

      responses.splice(1).forEach(function(response) {
        describe('with request "' + response[0] + '"', function() {
          it('calls a callback with an Error argument', function() {
              PasswordWidget.fetchPasswordList(response[0], this.callback);
              sandbox.server.respond();
              sinon.assert.calledWith(this.callback, sinon.match.instanceOf(Error));
              this.callback.reset();
          });
        });
      });
    });

    describe('#strengthScore', function() {
      it('returns 0 for password "" (0)', function() {
        expect( PasswordWidget.strengthScore('') ).to.equal(0);
      });

      it('returns 0 for password "abc" (3)', function() {
        expect( PasswordWidget.strengthScore('abc') ).to.equal(0);
      });

      it('returns 1 for password "abcdefgh" (8)', function() {
        expect( PasswordWidget.strengthScore('abcdefgh') ).to.equal(1);
      });

      it('returns 2 for password "AbCdEfGh" (8)', function() {
        expect( PasswordWidget.strengthScore('AbCdEfGh') ).to.equal(2);
      });

      it('returns 3 for password "AbCd1234" (8)', function() {
        expect( PasswordWidget.strengthScore('AbCd1234') ).to.equal(3);
      });

      it('returns 4 for password "Ab$$1&^4" (8)', function() {
        expect( PasswordWidget.strengthScore('Ab$$1&^4') ).to.equal(4);
      });

      it('returns 5 for password "Ab$$1&^4....." (> 12)', function() {
        expect( PasswordWidget.strengthScore('Ab$$1&^4.....') ).to.equal(5);
      });
    });

    describe('#scoreColor', function() {
      beforeEach(function() {
        this.origColors = PasswordWidget.defaults.colors;
        PasswordWidget.defaults.colors = ['red', 'green', 'blue'];
      });

      afterEach(function() {
        PasswordWidget.defaults.colors = this.origColors;
      });

      it('returns a string based on score value', function() {
        expect( PasswordWidget.scoreColor(-1) ).to.be.equal('red');
        expect( PasswordWidget.scoreColor( 0) ).to.be.equal('red');
        expect( PasswordWidget.scoreColor( 1) ).to.be.equal('green');
        expect( PasswordWidget.scoreColor( 2) ).to.be.equal('blue');
        expect( PasswordWidget.scoreColor( 3) ).to.be.equal('blue');
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
        expect( PasswordWidget.scoreText(1) )
          .to.equal(PasswordWidget.defaults.locale.weak);
        expect( PasswordWidget.scoreText(2) )
          .to.equal(PasswordWidget.defaults.locale.weak);
        expect( PasswordWidget.scoreText(3) )
          .to.equal(PasswordWidget.defaults.locale.medium);
        expect( PasswordWidget.scoreText(4) )
          .to.equal(PasswordWidget.defaults.locale.good);
        expect( PasswordWidget.scoreText(5) )
          .to.equal(PasswordWidget.defaults.locale.excelent);
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
