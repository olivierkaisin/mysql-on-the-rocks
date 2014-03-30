
MySQL On The Rocks ![alt text](https://olivierkaisin.s3.amazonaws.com/rocks.png) [![Build Status](https://travis-ci.org/olivierkaisin/mysql-on-the-rocks.svg)](https://travis-ci.org/olivierkaisin/mysql-on-the-rocks)
===================================================

A dead-simple Node.js module designed for handling storage / retrieval of Javascript objects to MySQL.


## Quick example

```javascript 
"use strict";


var mysql = require("mysql-io");


// First you need to create a connection to the db
mysql.create({
  host: "localhost",
  port: 3306,
  user: "admin", 
  password: "abcdefgh"
}).then(function (db) {

  // Retrieve an object
  return db.findObject("wallets", { 
    id: 123 
  }).then(function (obj) {

    // Update it
    obj.dollars += 100;
    
    // Save to the db
    return db.save(obj);
  });

}).fail(function (error) {
  // ...
}).done();
```


## Documentation


##### `mysql.findObjects(tableName, query, [order, count, offset])`

Finds an object in the database.

|  Argument                 | Type                    | Description                                                   |
|---------------------------|-------------------------|---------------------------------------------------------------|
|  tableName                | String                  | Name of the table to query on                                 | 
|  query                    | Object                  | An object describing the query                                |
|  order                    | Object                  | An object with fields as keys and order direction as values.  |
|  count                    | Number                  | The max amount of objects to return                           |
|  offset                   | Number                  | The starting offset of the result set                         |

__Returns__  `Promise<Object>`

-----------------------------------------------------------------------------------------------------------------------------

##### `mysql.findObject(tableName, query, [order, offset])`

Alias of `mysql.findObjects` with count set at 1.

-----------------------------------------------------------------------------------------------------------------------------

##### `mysql.save(tableName, obj)`

|  Argument                 | Type                    | Description                                                   |
|---------------------------|-------------------------|---------------------------------------------------------------|
|  tableName                | String                  | Name of the table to query on                                 | 
|  obj                      | Object                  | The object to save                                            |

__Returns__  `Promise<Object>`

If the object has an `id` already, it will be updated, otherwise it will be inserted and the `id` will be appended.


----------------------------------------------------------------------------------------------------------------------------

##### `mysql.insertObject(tableName, obj)`

and 

##### `mysql.updateObject(tableName, obj)`

__See__ ``mysql.save()``

----------------------------------------------------------------------------------------------------------------------------

##### `mysql.deleteObject(tableName, object)`

|  Argument                 | Type                    | Description                                                   |
|---------------------------|-------------------------|---------------------------------------------------------------|
|  tableName                | String                  | Name of the table to query on                                 | 
|  obj                      | Object                  | The object to delete (id must be defined)                     |

__Returns__  `Promise<Object>`

Deletes the object from the table. 


----------------------------------------------------------------------------------------------------------------------------

##### `mysql.findObjectsWithQuery(queryString)`

|  Argument                 | Type                    | Description                                                   |
|---------------------------|-------------------------|---------------------------------------------------------------|
|  queryString              | String                  | The MySQL query                                               | 

__Returns__  `Promise<Object>`

Use this method if you want to retrieve objects and not use the internal query builder.

----------------------------------------------------------------------------------------------------------------------------

##### `mysql.query(queryString)`

|  Argument                 | Type                    | Description                                                   |
|---------------------------|-------------------------|---------------------------------------------------------------|
|  queryString              | String                  | The MySQL query                                               | 

__Returns__  `Promise<Object>`


You probably won't use this method that much, but it allows you to call manually the internal `query()` method of the MySQL driver.



### Examples


#### Save and update an object

```javascript
mysql.save("users", {
  email: "hello@olivierkaisin.co"
}).then(function (user) {
  // .. user.id is now defined!
  
  // Let's update the email now
  user.email = "hi@olivierkaisin.co";
  return mysql.save("users", user);
}).fail(function (error) {
  // ...
}).done();
```


#### Retrieve a set of objects

```javascript
var tableName = "users";

var query = { 
  planCode: "pro"
};

var order = {
  created: "desc"
};


mysql.findObjects(
  tableName, query, order, 100
).then(function (users) {
  // .. do something with the received users  
}).fail(function (error) {
  // .. handle the error
}).done();
``` 

## License

MIT
