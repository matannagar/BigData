//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Kafka Configuration
//unique user ID
const uuid = require("uuid");

//getting kafka for node.js
const Kafka = require("node-rdkafka");

// configuartion of karafka user
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
const topic = `${prefix}new`;
const producer = new Kafka.Producer(kafkaConf);

const genMessage = m => new Buffer.alloc(m.length, m);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ kafka-configuration
// CONSUMER 
const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
    "auto.offset.reset": "beginning"
});

consumer.on("error", function (err) {
    console.error(err);
});


// consuming data from kafka and passing it on to relevant channel
consumer.on("ready", function (arg) {
    console.log(`Consumer ${arg.name} ready`);
    consumer.subscribe(topics);
    consumer.consume();
})
consumer.on("data", function (m) {
    console.log(m.value.toString());
});
consumer.on("disconnected", function (arg) {
    process.exit();
});
consumer.on('event.error', function (err) {
    console.error(err);
    process.exit(1);
});
consumer.on('event.log', function (log) {
    console.log(log);
});
consumer.connect();
// consumer


// REDIS
var express = require('express')();
var axios = require('axios');

var app = require('express')();
var server = require('http').Server(app);
var redis = require('redis');
var redisClient = redis.createClient();


var sub = redis.createClient()

redisClient.subscribe('message');

app.get('/', (req, res) => res.send('Hello World!'))




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


redisClient.on("message", function (channel, data) {
    var data = JSON.parse(data);
    // do things with the data
    data.variable1 = 3;
    data.variable2 = "hello";
    console.log(data.message);
});

redisClient.on('connect', function () {
    console.log('Reciver connected to Redis');
});


server.listen(6061, function () {
    console.log('reciver is running on port 6061');
});

