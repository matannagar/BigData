const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server)
const bodyParser = require('body-parser');

// port
const port = 3000

// --------------- Kafka
const kafka = require('./kafka/kafkaConsume');
const kafkaConsume = kafka.consumer

// --------------- Redis
// const redis = require('./redis/Redis')

// consuming data from kafka and passing it on to relevant channel
kafkaConsume
    .on('data', async (data) => {
        try {
            io.emit('stats', JSON.parse(data.value))
        } catch {
            console.log("an error occured!")
        }
    })

// ---------------- WebView
//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.send("<a href='/dashboard'>View</a>")
});
app.get('/Dashboard', (req, res) => {
    res.render('dashboard')
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//listen for requests
server.listen(port, () => {
    console.log(`Server: Ariel app listening at http://localhost:${port}`)
});

