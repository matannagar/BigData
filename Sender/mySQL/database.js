var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1559MBN7553"
});

customers = []

var sqlQuery = 'SELECT * FROM callcenter.customers;'
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    // con.query(sqlQuery, function (err, rows, fields) {
    //     if (err) throw err;
    //     for (var i in rows) {
    //         customers.push(Object.values(JSON.parse(JSON.stringify(rows[i]))));
    //     }
    // });
});

module.exports = {
    con: con,
    customers: customers
}
