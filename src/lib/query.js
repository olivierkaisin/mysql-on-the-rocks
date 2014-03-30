"use strict";


var mysql = require("mysql");
var _ = require("lodash");



function orderSet(order)
{  
  var orderBy = "";
  if (order) {
    _.forEach(order, function (direction, column) {
      if (!direction || ["ASC", "DESC"].indexOf(direction.toUpperCase()) === -1) {
        throw new Error("Incorrect direction");
      }

      if (orderBy.length > 0) {
        orderBy += ",";
      }
      else {
        orderBy += "ORDER BY ";
      }
      orderBy += mysql.escapeId(column, direction) + " " + direction.toUpperCase(); 
    });
  }
  return orderBy;
}



function columnSet()
{
  if (_.values(arguments).length === 0) {
    return null;
  }

  var stems = [];

  _.forEach(arguments, function (value) {
    if (typeof value !== "string") {
      throw new Error("Expecting strings as column names");
    }

    stems.push(mysql.escapeId(value));
  });
  
  return "(" + stems.join(',') + ")";
}



function valueSet()
{
  if (_.values(arguments).length === 0) {
    return null;
  }

  var stems = [];

  _.forEach(arguments, function (value) {
    stems.push(mysql.escape(value));
  });
  
  return "(" + stems.join(',') + ")";
}



module.exports.orderSet = orderSet;
module.exports.columnSet = columnSet;
module.exports.valueSet = valueSet;
