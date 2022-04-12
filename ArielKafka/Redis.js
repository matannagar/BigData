

const redis = require('redis')
/*
╔══════╗
║Redis ║
╚══════╝
*/

let stats = {
    endOftheDay: {
        Joining: 0,
        Service: 0,
        Complaint: 0,
        Disconnecting: 0
    },
    avarageWaitingTime: 0,
    tenMinWaitTime: 0,
    totalCalls: 0,
}

//REDIS CLIENT
let redisClient = redis.createClient();
// redisClient.subscribe('Joining');
redisClient.connect();

// REDIS SENDER
let redisSender = redisClient.duplicate()
redisSender.connect();

//onLoad sync Dashboard stats with the stats object
async function syncStats(stats) {
    const delay = Math.floor(Math.random() * 5000 + (1000 * 20000))
    await redisSender.PEXPIRE('waitingTime', delay, (err, reply) => {
        if (err) console.error(err)
    })

    // await redisClient.get('tenMinWaitTime').then((message) => {
    //     if (message !== null) {
    //         stats.tenMinWaitTime = message;
    //     }
    // })

    await redisClient.get('totalCalls').then((message) => {
        stats.totalCalls = message
    })
    await redisClient.get('waitingTime').then((message) => {
        stats.avarageWaitingTime = message;
    })

    my_list = ["Joining", 'Disconnecting', 'Service', 'Complaint']
    for (const item of my_list) {
        await redisClient.get(item).then((message) => {
            let callTopic = item;
            stats.endOftheDay[callTopic] = message
        })
    }

    await io.emit('stats', stats)

}


//set expiration time for Ten Minutes Avarage Waiting Time
async function setExpire(bool, avg) {

    // const delay = 
    if (bool) {
        await redisSender.set('tenMinWaitTime', stats.tenMinWaitTime, (err, reply) => {
            if (err) console.log(err)
        })
        await redisSender.PEXPIRE('tenMinWaitTime', 600000, (err, resp) => {
            if (err) console.log(err)
        })
    } else {
        await redisSender.set('tenMinWaitTime', avg, { KEEPTTL: true })
    }
}

//set expiration time for the rest of the data in redis
async function setExpireCalls(expire) {

    await redisSender.EXPIRE('totalCalls', expire, (err, resp) => {
        if (err) console.log(err)
    })

    my_list = ["Joining", 'Disconnecting', 'Service', 'Complaint']
    for (const item of my_list) {
        await redisSender.EXPIRE(item, expire, (err, resp) => {
            if (err) console.log(err)
        })
    }
}

//On each phonecall, immidiately update Redis
async function updateRedis(call, stats) {
    //set total Number of calls for the day
    var nd = new Date().setHours(23, 59, 59);
    var expire = Math.floor((nd - Date.now()) / 1000);

    await redisSender.incr('totalCalls', { KEEPTTL: true }, function (err, id) {
        redisSender.set('totalCalls', 1);
    })
    setExpireCalls(expire)

    const delay = 600000;
    await redisSender.get('tenMinWaitTime').then((message) => {
        let avg = message;
        const millis = Math.floor((Date.now() - parseInt(call.id)) / 1000);
        stats.tenMinWaitTime = millis;

        var flag;

        if (message === null) {
            flag = 1;
            setExpire(flag, avg)
        }
        else {
            flag = 0;
            avg = (Math.floor(message) + millis) / 2;
            stats.tenMinWaitTime = avg;
            setExpire(flag, avg)
            // redisSender.set('tenMinWaitTime', avg)
        }
    })

    //emitting total number of calls 
    await redisClient.get('totalCalls').then((message) => {
        if (message !== null) stats.totalCalls = message;
    })

    //set avarage waiting time 
    await redisClient.get('waitingTime').then((data) => {
        let avg = data;
        const millis = Math.floor((Date.now() - parseInt(call.id)) / 1000);
        if (data !== null) {
            avg = (Math.floor(data) + millis) / 2
        }
        redisSender.set('waitingTime', avg, { KEEPTTL: true })
        stats.avarageWaitingTime = avg;
    })

    // Joining
    await redisSender.incr(call.topic, { KEEPTTL: true }, function (err, id) {
        redisSender.set(call.topic, 1);
    })

    await redisClient.get(call.topic).then((message) => {
        let callTopic = call.topic;
        stats.endOftheDay[callTopic] = message
    })

    await io.emit('stats', stats)

}

module.exports = {
    stats,
    redisClient,
    redisSender,
    syncStats,
    setExpire,
    setExpireCalls,
    updateRedis,
}
