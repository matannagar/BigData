var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var redis = require('redis');
var redisClient = redis.createClient();
console.log("Don't forget to activate Docker")
redisClient.connect()

redisClient.on('error', function (err) {
    console.log(err)
});


redisClient.on('connect', function () {
    console.log('Reciver connected to Redis');
});


async function saveCallInfo(data) {
    const call = JSON.parse(data.value)
    console.log(call)
    await redisClient.HSET('storedCalls',
        'Name', call.name, 'City', call.city, 'Gender', call.gender,
        'Products', call.products[0], 'Topic', call.topic, 'Total Time', call.totalTime,
        function (err, reply) {
            console.log("error in HSET!")
            console.log(reply);
        });
}

//set expiration time for Ten Minutes Avarage Waiting Time
async function set10MinExpire(avg) {
    console.log("avg is :" + avg)
    redisClient.get('tenMinWaitTime').then((data) => {
        if (data === null) {
            redisClient.set('tenMinWaitTime', avg, (err, reply) => {
                if (err) console.log(err)
            })
            redisClient.PEXPIRE('tenMinWaitTime', 600000, (err, resp) => {
                if (err) console.log(err)
            })
        } else {
            redisClient.set('tenMinWaitTime', avg, { KEEPTTL: true })
        }
    });
}

async function set5MinExpire(avg) {
    console.log("avg is :" + avg)
    redisClient.get('fiveMinWaitTime').then((data) => {
        if (data === null) {
            redisClient.set('fiveMinWaitTime', avg, (err, reply) => {
                if (err) console.log(err)
            })
            redisClient.PEXPIRE('fiveMinWaitTime', 300000, (err, resp) => {
                if (err) console.log(err)
            })
        } else {
            redisClient.set('fiveMinWaitTime', avg, { KEEPTTL: true })
        }
    });
}

async function setExpireCalls(expire) {
    my_list = ["totalCalls", "Joining", 'Disconnecting', 'Service', 'Complaint']
    for (const item of my_list) {
        await redisClient.EXPIRE(item, expire, (err, resp) => {
            if (err) console.log(err)
        })
    }
}

async function updateRedis(data) {

    const call = JSON.parse(data.value)

    await redisClient.incr('totalCalls', { KEEPTTL: true }, function (err, id) {
        redisClient.set('totalCalls', 1);
    })

    // increment type of call 
    await redisClient.incr(call.topic, { KEEPTTL: true }, function (err, id) {
        redisClient.set(call.topic, 1);
    })

    await redisClient.set('lastWaitingTime', call.waitTime)

    let avg = Math.floor((Date.now() - parseInt(call.id)) / 1000);
    await redisClient.get('waitingTime').then((data) => {
        if (data !== null) {
            avg = (Math.floor(data) + avg) / 2
        }
        console.log(data)
        redisClient.set('waitingTime', avg, { KEEPTTL: true })
    })

    // 24 Hours Time Expiration
    var nd = new Date().setHours(23, 59, 59);
    var expire = Math.floor((nd - Date.now()) / 1000);
    setExpireCalls(expire)

    set10MinExpire(avg)
    set5MinExpire(avg)
}

// --------- APP VIEW -------------
app.get('/', (req, res) => res.send('Hello World!'))

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(6061, function () {
    console.log('reciver is running on port 6061');
});

module.exports = {
    consumer: redisClient,
    saveCallInfo: saveCallInfo,
    setExpireCalls: setExpireCalls,
    updateRedis: updateRedis,
}
