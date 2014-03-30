"use strict";

/* global it, describe, before, after */


var mockery = require("mockery");
var _ = require("lodash");
var assert = require("chai").assert;


var expectedCFG = {
  host: "host123",
  port: 2131
};

var mysqlMock = {
  createConnection: function (config) {
    if (config !== expectedCFG) {
      throw new Error("Config isn't matching");
    }
  }
};

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false
});



describe("connection", function () {

  before(function () {
    mockery.registerMock("mysql", mysqlMock);
  });


  var connection = require("../src/lib/connection");

  describe("#createConnection", function () {
    it("should give the correct configuration to mysql", function () {
      connection.createConnection(expectedCFG);
    });

    it("should attach a handler that closes the connection when process exits", function () {
      var amountOfListeners = process.listeners("exit").length;
      connection.createConnection(expectedCFG);      
      assert.strictEqual(process.listeners("exit").length - amountOfListeners, 1);
    });

    it("should fail if no or bad type of config is given", function (done) {
      assert.throws(function () {
        connection.createConnection(null);
      });
      assert.throws(function () {
        connection.createConnection();
      });
      assert.throws(function () {
        connection.createConnection(123);
      });
      assert.throws(function () {
        connection.createConnection("");
      });
      assert.throws(function () {
        connection.createConnection(false);
      });

      done();
    });
  });

  after(function () {
    mockery.registerMock("mysql", mysqlMock);
  });

});
