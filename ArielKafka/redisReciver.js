var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var redis = require('redis');


var redisClient = redis.createClient();



app.get('/', (req, res) => {
    redisClient.on("message", function (channel, message) {
        console.log("yoyoy")

    });
    res.send('Hello World!')
}
)

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// // no stacktraces leaked to user
// app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });




redisClient.subscribe('Joining');

redisClient.on('connect', function () {
    console.log('Reciver connected to Redis');
});

redisClient.connect()

server.listen(6061, function () {
    console.log('reciver is running on port 6061');
});


// //REDIS CLIENT
// redisClient.subscribe('Joining')
// redisClient.connect();

// redisClient.on('connect', function () {
//     console.log('Redis Reciver is connected!');
// });
//redisClient is 'listening' for type of 'messages' that redisSenders emits

// redisClient.on("message", async (channel, message) => {

//     // const call = JSON.parse(message);
//     // console.log("Redis client just received a message!")
//     // ++endOftheDay[channel];
//     // console.log(endOftheDay[channel])
//     // console.log("inside redis client on message")

//     // redisSender.PEXPIRE(call.id, time, (err, reply) => {
//     //     if (err) console.error(err)
//     // })

// });
