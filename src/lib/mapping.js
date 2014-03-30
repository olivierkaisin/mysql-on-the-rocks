"use strict";


var _ = require("lodash");
var stringUtils = require('mout/string');



function mapRowToObj(row) 
{
  if (row === null) {
    return null;
  }

  if (!_.isObject(row)) {
    throw new Error("Invalid row type");
  }

  var obj = {};
  _.forEach(row, function (value, column) {
    obj[stringUtils.camelCase(column)] = value;
  });
  return obj;
}



function mapObjToRow(obj) 
{
  if (obj === null) {
    return null;
  }
  
  if (!_.isObject(obj)) {
    throw new Error("Invalid object type");
  }

  var row = {};
  _.forEach(obj, function (value, key) {
    row[stringUtils.underscore(key)] = value;
  });
  return row;
}



module.exports.mapRowToObj = mapRowToObj;
module.exports.mapObjToRow = mapObjToRow;
