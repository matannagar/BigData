/*

*/

// EXPRESS APP SETUP
const express = require('express');
const app = express();
var server = require('http').createServer(app);
const redis = require('redis')
const io = require("socket.io")(server)
const kafka = require('./kafkaProduce');
const bodyParser = require('body-parser');

// port
const port = 3000

//REDIS
let redisClient = redis.createClient();
let redisSender = redisClient.duplicate()
redisClient.connect();
redisSender.connect();
// let redisPublisher = redisClient.duplicate()
redisClient.subscribe(['calls'])

redisClient.on("message", async (channel, data) => {
    console.log("inside redisClient!")
    // const pack = JSON.parse(data);
    // // do things with the data
    // pack.variable1 = 3;
    // pack.variable2 = "hello";
    // console.log(pack.message);
    // io.emit('update', totalWaiting)
});

redisClient.on('connect', function () {
    console.log('Redis Reciver is connected!');
});

redisSender.on('connect', function () {
    console.log('Redis Sender is connected!')
})

redisSender.on('message', async (channel, message) => {
    const call = JSON.parse(message);
    console.log("im inside redisSender!" + channel)
})
//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Kafka Configuration Consumer
//unique user ID
const uuid = require("uuid");

//getting kafka for node.js
const Kafka = require("node-rdkafka");

// configuartion of karafka user
//credentials
const kafkaConf = {
    "group.id": "cloudkarafka-example",
    "metadata.broker.list": "moped-01.srvs.cloudkafka.com:9094,moped-02.srvs.cloudkafka.com:9094,moped-03.srvs.cloudkafka.com:9094".split(","),
    "socket.keepalive.enable": true,
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": "mo0oa5gi",
    "sasl.password": "4ozx-X3Eaj0H9bvA96qmmD9MY-WRMkIA",
    "debug": "generic,broker,security"
};

const prefix = "mo0oa5gi-";
//topic name
const topic = `${prefix}new`;
const topics = [topic];

//setting consumer client
const kafkaConsumer = new Kafka.KafkaConsumer(kafkaConf, {});

kafkaConsumer.on("error", function (err) {
    // console.error(err);
});

// consuming data from kafka and passing it on to relevant channel
kafkaConsumer.on("ready", function (arg) {
    console.log(`kafkaConsumer ${arg.name} ready`);
    kafkaConsumer.subscribe(topics);
    kafkaConsumer.consume();
})
    .on('data', async (data) => {
        const call = JSON.parse(data.value)["id"]
        redisSender.set('MATAN', "27", function (err, reply) {
            console.log(reply);
        });
        console.log("hereeeeeee" + call)
    })

kafkaConsumer.on("data", function (m) {
    console.log(m.value.toString());
    console.log("printing data from kafka")
});


kafkaConsumer.on("disconnected", function (arg) {
    process.exit();
});
// kafkaConsumer.on('event.error', function (err) {
//     console.error(err);
//     process.exit(1);
// });
// kafkaConsumer.on('event.log', function (log) {
//     console.log(log);
// });

//start consuming
kafkaConsumer.connect();

// register view engine 
app.set('view engine', 'ejs');
app.use(express.static("public"));

let myVar = 10;
/*Express - Rendering the main page */
const home = app.get('/', (req, res) => {
    res.send("<a href='/send'>Send</a> <br/><a href='/dashboard'>View</a>")
});
const sender = app.get('/send', (req, res) => res.render('sender'));
const dashboard = app.get('/dashboard', (req, res) => {
    res.render('dashboard', { myVar })
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

/* SocketIO connection */
io.on("connection", (socket) => {
    console.log("IO: new user connected");
    socket.on("totalWaitingCalls", (msg) => {
        console.log("Total waiting calls: " + msg.totalWaiting);
        io.emit(msg)
    });
    socket.on("callDetails", (msg) => {
        console.log(msg);
        io.emit(msg);
        kafka.publish(msg);
        const delay = Math.floor(Math.random() * 5000 + (1000));

        setTimeout(() => {  // For each package, according to it's district, timing the semi-randomized arrival time
            myVar = "in HERE";
            dashboard
        }, delay)
    });
});

//listen for requests
server.listen(port, () => {
    console.log(`Server: Ariel app listening at http://localhost:${port}`)
});


