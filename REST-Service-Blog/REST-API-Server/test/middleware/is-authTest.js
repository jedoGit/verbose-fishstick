const { expect } = require("chai");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");
const isAuthMiddleware = require("../../middleware/is-auth");

describe("Is-Auth Middleware", function () {
  it("should throw an error if no authorization header is present", function () {
    const req = {
      get: function () {
        return null;
      },
    };
    expect(isAuthMiddleware.bind(this, req, {}, () => {}))
      .to.throw("Missing Authorization Header from received request.")
      .that.has.property("statusCode", 401);
  });

  it("should throw an error if the authorization header is only one string", function () {
    const req = {
      get: function () {
        return "oneString";
      },
    };
    expect(isAuthMiddleware.bind(this, req, {}, () => {}))
      .to.throw("jwt must be provided")
      .that.has.property("statusCode", 500);
  });

  it("should throw an error if the jwt.verify call returns a null or undefined", function () {
    // Create a dummy req object with a get function that returns a dummy authorization header
    const req = {
      get: function () {
        return "Bearer thisIsADummyTokenCommingFromTheClientService";
      },
    };

    // This mocks the jwt.verify() call in is-auth.js to return a userId property so we can check
    // if is-auth.js adds the userId during a successfull token verify
    sinon.stub(jwt, "verify");

    // Stub jwt.verify to return null
    jwt.verify.returns(null);

    // Check if jwt.verify returns a null
    expect(isAuthMiddleware.bind(this, req, {}, () => {}))
      .to.throw("Error with decoded user token.")
      .that.has.property("statusCode", 401);

    // Stub jwt.verify to return undefined
    jwt.verify.returns(undefined);

    // Check if jwt.verify returns an undefined
    expect(isAuthMiddleware.bind(this, req, {}, () => {}))
      .to.throw("Error with decoded user token.")
      .that.has.property("statusCode", 401);

    // Clean up the mocked function so it can be called by other unit tests
    jwt.verify.restore();
  });

  it("should yield a userId after decoding the token", function () {
    // Create a dummy req object with a get function that returns a dummy authorization header
    const req = {
      get: function () {
        return "Bearer thisIsADummyTokenCommingFromTheClientService";
      },
    };

    // This mocks the jwt.verify() call in is-auth.js to return a userId property so we can check
    // if is-auth.js adds the userId during a successfull token verify
    sinon.stub(jwt, "verify");

    // Stub jwt.verify to return userId
    jwt.verify.returns({ userId: "dummyUserId" });

    // Call the is-auth middleware. DO NOT BIND! similar to the calls above.
    // You only bind if you call the middleware inside the expect call.
    isAuthMiddleware(req, {}, () => {});

    // Then check if the req object have a userId property created
    // Check if the userId created is dummyUserId. This was set in the stubbed function above
    // Check if the verify function was actually called in the is-auth.js middleware
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "dummyUserId");
    expect(jwt.verify.called).to.be.true;

    // Clean up the mocked function so it can be called by other unit tests
    jwt.verify.restore();
  });
});
