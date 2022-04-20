

let stats = {
    endOftheDay: {
        Joining: 0,
        Service: 0,
        Complaint: 0,
        Disconnecting: 0
    },
    avarageWaitingTime: 0,
    tenMinWaitTime: 0,
    waitTimeArray: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    fiveMinWaitTime: 0,
    totalCalls: 0,
}

//------------ Redis
const redis = require('redis')
let redisClient = redis.createClient();
redisClient.connect();

async function syncDashboard() {

    const waitAVGperHour = await redisClient.lRange('waitTimeArray', 0, -1)
    waitAVGperHour.forEach(function(value,i){
        stats.waitTimeArray[i] = value;
    })
    console.log(stats.waitTimeArray)
    await redisClient.get('totalCalls').then((message) => {
        stats.totalCalls = message
    })

    await redisClient.get('waitingTime').then((message) => {
        stats.avarageWaitingTime = message;
    })

    await redisClient.get('tenMinWaitTime').then((message) => {
        stats.tenMinWaitTime = message;
    })

    //this should be a list object [3,20,50....]
    await redisClient.get('fiveMinWaitTime').then((message) => {
        stats.fiveMinWaitTime = message;
    })

    my_list = ["Joining", 'Disconnecting', 'Service', 'Complaint']
    for (const item of my_list) {
        await redisClient.get(item).then((message) => {
            let callTopic = item;
            stats.endOftheDay[callTopic] = message;
        })
    }
    return stats
}

module.exports = {
    syncDashboard: syncDashboard,
}
