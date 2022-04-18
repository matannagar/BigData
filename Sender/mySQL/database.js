var mysql = require('mysql');
require("dotenv").config();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.SQL_PASS
});

customers = []

var sqlQuery = 'SELECT * FROM callcenter.customers;'
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = {
    con: con,
    customers: customers
}
