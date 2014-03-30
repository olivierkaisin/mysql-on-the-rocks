"use strict";

/* global it, describe */

var assert = require("chai").assert;


describe("query", function () {

  var query = require("../src/lib/query");


  describe("#orderSet", function () {
    it("should serialize order correctly", function () {
      var orderBy = {
        id: "desc",
        first_name: "asc",
        last_name: "asc"
      };

      var orderStatement = query.orderSet(orderBy);

      assert.strictEqual(
        orderStatement, "ORDER BY `id` DESC,`first_name` ASC,`last_name` ASC"
      );
    });


    it("should fail on incorrect order directions", function () {
      assert.throws(function () {
        query.orderSet({
          id: "xxx"
        });
      });

      assert.throws(function () {
        query.orderSet({
          id: null
        });
      });

      assert.throws(function () {
        query.orderSet({
          id: 1
        });
      });

      assert.throws(function () {
        query.orderSet({
          id: false
        });
      });

      assert.throws(function () {
        query.orderSet({
          id: undefined
        });
      });

      assert.throws(function () {
        query.orderSet({
          id: []
        });
      });

      assert.throws(function () {
        query.orderSet({
          id: {}
        });
      });
    });


    it("should accept standard order directions", function () {
      assert.doesNotThrow(function () {
        query.orderSet({
          id: "desc"
        });
        
        query.orderSet({
          id: "DESC"
        });
        
        query.orderSet({
          id: "asc"
        });

        query.orderSet({
          id: "ASC"
        });
      });
    });
  });

  
  describe("#columnSet", function () {
    it("should serialize to a correct column set", function () {
      assert.strictEqual(
        query.columnSet("id", "first_name", "last_name"),
        "(`id`,`first_name`,`last_name`)"
      );
    });

    it("should fail on incorrect column name", function () {
      assert.throws(function () {
        query.columnSet(null);
      });

      assert.throws(function () {
        query.columnSet(false);
      });

      assert.throws(function () {
        query.columnSet(12);
      });

      assert.throws(function () {
        query.columnSet([]);
      });

      assert.throws(function () {
        query.columnSet({});
      });
    });

    it("should return an null if no arguments are given", function () {
      assert.strictEqual(query.columnSet(), null);
    });
  });


  describe("#columnSet", function () {
    it("should serialize to a correct column set", function () {
      assert.strictEqual(
        query.valueSet(1, "Olivier", "Kaisin"),
        "(1,'Olivier','Kaisin')"
      );
    });

    it("should return an null if no arguments are given", function () {
      assert.strictEqual(query.valueSet(), null);
    });
  });
});
