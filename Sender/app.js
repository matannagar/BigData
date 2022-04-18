const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server)
const port = 3001

//------------ kafka------------
const kafka = require('./kafka/kafkaProduce');
const bodyParser = require('body-parser');


//------------ mySQL------------
const db = require('./mySQL/database');
const { customers } = require('./mySQL/database');


//------------ webview 
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send("<a href='/send'>Send</a>"));
app.get('/send', (req, res) => {
    var sqlQuery = 'SELECT * FROM callcenter.customers;'
    db.con.query(sqlQuery, function (err, rows, fields) {
        if (err) throw err;
        for (var i in rows) {
            customers.push(rows[i]);
        }
        io.on("connection", (socket) => {
            socket.emit("customers", customers)
        })
        res.render('sender')
    })
});

//------------ Socket.io ----------------
io.on("connection", (socket) => {
    console.log("new user connected to IO");
    // socket.on("totalWaitingCalls", (msg) => { console.log(msg.totalWaiting) });
    socket.on("callDetails", (msg) => {
        console.log("A new call was sent via Kafka!: \n" + msg);
        kafka.publish(msg);
    });
});


server.listen(port, () => console.log(`Sender app listening at http://localhost:${port}`));
