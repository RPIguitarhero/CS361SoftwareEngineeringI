//this file include information needed to connect DB
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs361_kangka',
  password        : '9348',
  database        : 'cs361_kangka',
  multipleStatements:true //allow multiple statements in one querry
});

pool.getConnection(function(err, connection) {
  if (err) throw err
  console.log('You are now connected...')
});
module.exports.pool = pool;
