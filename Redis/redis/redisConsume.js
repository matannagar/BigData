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


//set expiration time for Ten Minutes Avarage Waiting Time
async function set10MinExpire(avg) {
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
    redisClient.get('fiveMinWaitTime').then((data) => {
        if (data === null) {
            redisClient.set('fiveMinWaitTime', avg, (err, reply) => {
                if (err) console.log(err)
            })
            redisClient.rPush('waitTimeArray', avg, (err, reply) => {
                if (err) console.log(err)
            })
            redisClient.PEXPIRE('fiveMinWaitTime', 3600000, (err, resp) => {
                if (err) console.log(err)
            })
        } else {
            redisClient.set('fiveMinWaitTime', avg, { KEEPTTL: true })
            redisClient.lSet('waitTimeArray', -1, avg)
        }
    });
}

async function setExpireCalls(expire) {
    my_list = ["Joining", 'Disconnecting', 'Service', 'Complaint', 'WaitTimeArray']
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
        redisClient.PEXPIRE('totalCalls', 600000, (err, resp) => {
            if (err) console.log(err)
        })
        redisClient.rPush('totalCallsArray', data, (err, reply) => {
            if (err) console.log(err)
        })
    })

    await redisClient.get('totalCalls').then((data) => {
        redisClient.lSet('totalCallsArray', -1, data)
    })

    // increment type of call 
    await redisClient.incr(call.topic, { KEEPTTL: true }, function (err, id) {
        redisClient.set(call.topic, 1);
    })

    await redisClient.set('lastWaitingTime', call.waitTime)

    await redisClient.set('currWaitingCalls', call.currWaitingCalls)

    let avg = Math.floor((Date.now() - parseInt(call.id)) / 1000);
    await redisClient.get('waitingTime').then((data) => {
        if (data !== null) {
            avg = (Math.floor(data) + avg) / 2
        }
        redisClient.set('waitingTime', avg, { KEEPTTL: true })
    })

    // 24 Hours Time Expiration
    var nd = new Date().setHours(23, 59, 59);
    var expire = Math.floor((nd - Date.now()) / 1000);
    setExpireCalls(expire)

    set10MinExpire(avg)
    set5MinExpire(avg)

    console.log("New call inserted to redis!")
}

module.exports = {
    consumer: redisClient,
    setExpireCalls: setExpireCalls,
    updateRedis: updateRedis,
}
