"use strict";

/* global it, describe */

var assert = require("chai").assert;


describe("mapping", function () {

  var mapping = require("../src/lib/mapping");


  describe("#mapObjToRow", function () {
    var sourceObj = {
      id: 1,
      firstName: "Olivier",
      lastName: "Kaisin",
      job: "Developer"
    };

    var destObj = {
      id: 1,
      first_name: "Olivier",
      last_name: "Kaisin",
      job: "Developer"
    };

    it("should turn properties into column names", function () {
      assert.deepEqual(mapping.mapObjToRow(sourceObj), destObj);
    });

    it("should return null if providing null as object", function () {
      assert.deepEqual(mapping.mapObjToRow(null), null);
    });

    it("should fail if providing wrong type as object", function () {
      assert.throws(function () {
        mapping.mapObjToRow(false);
      });
      assert.throws(function () {
        mapping.mapObjToRow(1);
      });
      assert.throws(function () {
        mapping.mapObjToRow();
      });
    });
  });


  describe("#mapRowToObj", function () {
    var sourceObj = {
      id: 1,
      first_name: "Olivier",
      last_name: "Kaisin",
      job: "Developer"
    };

    var destObj = {
      id: 1,
      firstName: "Olivier",
      lastName: "Kaisin",
      job: "Developer"
    };

    it("should turn column names into properties", function () {
      assert.deepEqual(mapping.mapRowToObj(sourceObj), destObj);
    });
    
    it("should return null if providing null as object", function () {
      assert.deepEqual(mapping.mapRowToObj(null), null);
    });

    it("should fail if providing wrong type as object", function () {
      assert.throws(function () {
        mapping.mapRowToObj(false);
      });
      assert.throws(function () {
        mapping.mapRowToObj(1);
      });
      assert.throws(function () {
        mapping.mapRowToObj();
      });
    });
  });
});
