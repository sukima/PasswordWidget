var expect = chai.expect;
var laplace = require('laplace');
var generatePassword = require('../lib/generatepassword');

describe('generatePassword', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(function() {
    this.rand = sandbox.stub(Math, 'random', laplace.createMock(100));
    this.password = '@@aaABaB@000@'; // seeded by laplace
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("returns a string", function() {
    expect( generatePassword() ).to.equal(this.password);
  });
});

/* vim:set ts=2 sw=2 et fdm=marker: */
