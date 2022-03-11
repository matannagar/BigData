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

consumer.connect();
// consumer

// consuming data from kafka and passing it on to relevant channel
consumer.on('ready', () => {
    console.log('Hot Connection is Ready!')
    // kafkaConsumer.subscribe(['packages'])
    // kafkaConsumer.consume()
    consumer.subscribe(topics);
    consumer.consume();
})
    .on('data', async (data) => {
        console.log("hereeeeeeeee")
        // const district = JSON.parse(data.value).District
        // broker.publish(district, data.value)
        // broker.HSET(JSON.parse(data.value).TrackID, district, data.value, (err, reply) => {
        //     if (err) console.error(err)
        // })
    })

consumer.on("data", function (m) {
    console.log('Hot Connection is Ready inside data!')
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

var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var redis = require('redis');
var redisClient = redis.createClient();
var sub = redis.createClient()

// for explanations : https://www.sitepoint.com/using-redis-node-js/

app.get('/test', function (req, res) {

    // Store string  
    redisClient.set('NumberOfCars', "390", function (err, reply) {
        console.log(reply);
    });

    //Store and get Hash i.e. object( as keyvalue pairs)
    redisClient.hmset('Sections', "one", 'Sorek', "two", 'Nesharim', "three", 'BenShemen', "four", 'nashonim', "five", 'kesem');
    redisClient.hgetall('Sections', function (err, object) {
        console.log(object);
    });
    /*
    also ok:
    redisClient.hmset('Sections', {
                        'javascript': 'AngularJS',
                        'css': 'Bootstrap',
                        'node': 'Express'
                        });
    */

    // lists : rpush or lpush
    /* client.rpush(['frameworks', 'angularjs', 'backbone'], function(err, reply) {
        console.log(reply); //prints 2
    });
    
    // -1= get all
    client.lrange('frameworks', 0, -1, function(err, reply) {
        console.log(reply); // ['angularjs', 'backbone']
    }); */

    redisClient.publish("message", "{\"message\":\"Hello from Redis\"}", function () {
    });

    res.send('תקשרתי עם רדיס....')
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


redisClient.on('connect', function () {
    console.log('Sender connected to Redis');
});
server.listen(6062, function () {
    console.log('Sender is running on port 6062');
});

