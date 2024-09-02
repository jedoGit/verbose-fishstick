const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const sinon = require("sinon");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const authController = require("../../controllers/auth");
const expect = chai.expect;

chai.use(chaiAsPromised);

//-----------------
// Constants
//-----------------
const BCRYPTSALT = 12;

describe("Auth Controller - Login", function () {
  it("should throw an error with statusCode 500 when accessing the database fails.", function (done) {
    // Set up the stubs
    sinon.stub(User, "findOne");
    User.findOne.throws(); //returns(Promise.reject(new Error()));

    const req = {
      body: {
        email: "test@test.com",
        password: "testPassword",
      },
    };

    // Call the login method
    authController
      .login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);

        done();
      })
      .catch(done);

    // Cleanupc

    User.findOne.restore();
  });

  it("should throw an error with status code 401 when user object is null.", function (done) {
    // Set up the stubs
    sinon.stub(User, "findOne");
    User.findOne.returns(null);

    const req = {
      body: {
        email: "test@test.com",
        password: "testPassword",
      },
    };

    // Call the login method
    authController
      .login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 401);

        // sinon.assert.calledWith(User.findOne);

        done();
      })
      .catch(done);

    // Cleanupc

    User.findOne.restore();
  });

  it("should throw an error with status code 401 when user object is undefined.", function (done) {
    // Set up the stubs
    sinon.stub(User, "findOne");
    User.findOne.returns(undefined);

    const req = {
      body: {
        email: "test@test.com",
        password: "testPassword",
      },
    };

    // Call the login method
    authController
      .login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 401);

        // sinon.assert.calledWith(User.findOne);

        done();
      })
      .catch(done);

    // Cleanupc

    User.findOne.restore();
  });

  it("should throw an error with status code 401 when bcrypt does not return a password match.", function (done) {
    // Set up the stubs
    sinon.stub(User, "findOne");
    User.findOne.returns({
      password: "testPassword123",
      name: "testName",
      email: "test@test.com",
      _id: uuidv4(),
    });

    sinon.stub(bcrypt, "compare");
    bcrypt.compare.resolves(true); // <==== this did not resolve to true!!!!! Why??

    const req = {
      body: {
        email: "test@test.com",
        password: "testPassword123",
      },
    };

    // Call the login method
    authController
      .login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 401);

        // sinon.assert.calledWith(bcrypt.compare);

        done();
      })
      .catch(done);

    // Cleanupc
    bcrypt.compare.restore();
    User.findOne.restore();
  });

  // it("should throw an error with status code 401 when jwt does not return a token.", function (done) {
  //   // Set up the stubs
  //   sinon.stub(User, "findOne");
  //   User.findOne.returns({
  //     password: "testPassword123",
  //     name: "testName",
  //     email: "test@test.com",
  //   });

  //   // sinon.stub(bcrypt, "compare");
  //   // bcrypt.compare.returns(true);

  //   const req = {
  //     body: {
  //       email: "test@test.com",
  //       password: "testPassword123",
  //     },
  //   };

  //   // Call the login method
  //   authController
  //     .login(req, {}, () => {})
  //     .then((result) => {
  //       expect(result).not.to.be.an("error");
  //       expect(result).to.have.property("statusCode", 401);

  //       // sinon.assert.calledWith(bcrypt.compare);

  //       done();
  //     })
  //     .catch(done);

  //   // Cleanupc

  //   // bcrypt.compare.restore();
  //   User.findOne.restore();
  // });
});
