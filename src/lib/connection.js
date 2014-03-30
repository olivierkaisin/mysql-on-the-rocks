"use strict";


var mysql = require("mysql");
var Q = require("q");
var _ = require("lodash");



function createConnection(config)
{
  if (!config || !_.isObject(config)) {
    throw new Error("Missing or invalid config");
  }

  // Setup connection
  var connection = mysql.createConnection({
    host     : config.host,
    port     : config.port,
    user     : config.user,
    password : config.password,
    database : config.database
  });

  process.on("exit", function () {
    connection.end();
  });

  return Q.ninvoke(connection, "connect").then(function () {
    return connection;
  });
}
  


module.exports.createConnection = createConnection;
