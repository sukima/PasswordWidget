var expect = chai.expect;
var CommonPasswords = require('../lib/commonpasswords');

describe('CommonPasswords', function() {
  var sandbox = sinon.sandbox.create();

  afterEach(function() {
    sandbox.restore();
  });

  describe('#isCommon', function() {
    it('returns false when password list is empty (default)', function() {
      CommonPasswords.setPasswords({});
      expect( CommonPasswords.isCommon('monkey') ).to.be.false;
    });

    it('returns boolean based on password existence in dictionary lookup', function() {
      CommonPasswords.addPasswords(['monkey']);
      expect( CommonPasswords.isCommon('monkey') ).to.be.true;
      expect( CommonPasswords.isCommon('__password_not_in_list__') ).to.be.false;
    });
  });

  describe('#fetchList', function() {
    var responses = {
      good: [
        ["/200/good.json", [200, {'Content-Type': 'application/json'}, '{"test_pass":true}']]
      ],
      bad: [
        ["/404/good.json", [404, {'Content-Type': 'application/json'}, '{}']],
        ["/200/bad.json",  [200, {'Content-Type': 'application/json'}, 'this is bad JSON']],
        ["/200/html",      [200, {'Content-Type': 'text/html'},        'OK']],
        ["/500/html",      [500, {'Content-Type': 'text/html'},        'Not OK']]
      ]
    };

    beforeEach(function() {
      function registerResponse(response) {
        sandbox.server.respondWith(response[0], response[1]);
      }

      this.callback = sandbox.spy();
      sandbox.useFakeServer();
      responses.good.forEach(registerResponse);
      responses.bad.forEach(registerResponse);
    });

    describe('with success', function() {
      beforeEach(function() {
        CommonPasswords.fetchList('/200/good.json', this.callback);
        sandbox.server.respond();
      });

      it('calls a callback with a null argument', function() {
        sinon.assert.calledWith(this.callback, null);
      });

      it('registers the passwords as common', function() {
        expect( CommonPasswords.isCommon('test_pass') ).to.be.true;
      });
    });

    responses.bad.forEach(function(response) {
      describe('with request "' + response[0] + '"', function() {
        it('calls a callback with an Error argument', function() {
          CommonPasswords.fetchList(response[0], this.callback);
          sandbox.server.respond();
          sinon.assert.calledWith(this.callback, sinon.match.instanceOf(Error));
          this.callback.reset();
        });
      });
    });
  });
});

/* vim:set ts=2 sw=2 et fdm=marker: */
