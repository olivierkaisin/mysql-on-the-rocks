"use strict";



var _ = require("lodash");
var mysql = require("mysql");
var Q = require("q");

var mapping = require("./lib/mapping");
var query = require("./lib/query");
var connection = require("./lib/connection");



function CRUD(connection) 
{
  this.connection = connection;
}



CRUD.prototype.query = function (statement)
{
  return Q.ninvoke(this.connection, "query", statement);
};



CRUD.prototype.findObjectsWithQuery = function (queryString)
{
  return this.query(
    queryString
  ).then(function (results) {
    if (!results[0]) {
      throw new Error("Select didn't succeed");
    }

    return results[0].map(mapping.mapRowToObj);
  });
};



CRUD.prototype.findObjects = function (tableName, _query, order, count, offset)
{
  _query = mapping.mapObjToRow(_query);
  order  = mapping.mapObjToRow(order || {});

  var conditions = "";
  _.forEach(_query, function (value, key) {
    if (!conditions) {
      conditions = "WHERE";
    }
    conditions += " " + mysql.escapeId(key) + "=" + mysql.escape(value);
  });

  var orderBy = query.orderSet(order);

  var limit = "";    
  if (count) {
    limit = "LIMIT " + (offset || 0) + "," + count;
  }

  return this.findObjectsWithQuery(
    "SELECT * FROM " + mysql.escapeId(tableName) + " " + conditions + " " + orderBy + " " + limit
  );
};



CRUD.prototype.findObject = function (tableName, _query, order, offset) 
{
  return this.findObjects(tableName, _query, order, 1, offset).then(function (rows) {
    return rows[0];
  });
};



CRUD.prototype.save = function (tableName, obj)
{
  obj = mapping.mapObjToRow(obj);

  if (obj.id) {
    return this.updateObject(tableName, obj);
  }
  else {
    return this.insertObject(tableName, obj);
  }
};



CRUD.prototype.insertObject = function (tableName, obj)
{
  var columns = query.columnSet.apply(query.columnSet, _.keys(obj));
  var values  = query.valueSet.apply(query.valueSet, _.values(obj));

  return this.query(
    "INSERT INTO " + tableName + " " + columns + " VALUES " + values
  ).then(function (results) {
    if (!results[0]) {
      throw new Error("Insert didn't succeed");
    }
    obj.id = results[0].insertId;

    return obj;
  });
};



CRUD.prototype.updateObject = function(tableName, obj)
{
  var stems = [];
  _.forEach(obj, function (value, key) {
    stems.push(mysql.escapeId(key) + "=" + mysql.escape(value));
  });

  return this.query(
    "UPDATE " + tableName + " SET " + stems.join(',') + " WHERE `id`=" + obj.id
  ).then(function (results) {
    if (!results[0] || results[0].affectedRows <= 0) {
      throw new Error("Update didn't succeed");
    }

    return obj;
  });
};



CRUD.prototype.deleteObject = function (tableName, obj)
{
  if (!obj.id || ! _.isNumber(obj.id)) {
    throw new Error("Invalid or missing id");
  }

  return this.query(
    "DELETE FROM " + tableName + " WHERE `id`=" + mysql.escape(obj.id) 
  ).then(function (results) {
    if (!results[0] || results[0].affectedRows <= 0) {
      throw new Error("Delete didn't succeed");
    }

    obj.id = null;

    return obj;
  });
};



/**
 * Create a CRUD handler
 */
function create(config)
{
  return connection.createConnection(
    config
  ).then(function (connection) {
    return new CRUD(connection);
  });
}



module.exports.create = create;
