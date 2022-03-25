/*
This page is responsible for connecting to Kafka Consumer, Redis Consumer&Producers, IO.
The data from the consumer will pass through Kafka which will use the IO to pass it on to the website.
Data from Kafka Producer will be stored inside Redis with a given expiration time of 24 Hours.

Information Calls that will be saved inside the system:
╔════════╤════════════╤══════╤══════╤═════╤════════╤═══════════════╤═══════════════╗
║ Period │ Start Call │ Name │ City │ Age │ Gender │ Product       │ Topic         ║
╠════════╪════════════╪══════╪══════╪═════╪════════╪═══════════════╪═══════════════╣
║        │            │      │      │     │        │ Home Internet │ Joining       ║
╟────────┼────────────┼──────┼──────┼─────┼────────┼───────────────┼───────────────╢
║        │            │      │      │     │        │ Cables        │ Service       ║
╟────────┼────────────┼──────┼──────┼─────┼────────┼───────────────┼───────────────╢
║        │            │      │      │     │        │ Cellular      │ Complaint     ║
╟────────┼────────────┼──────┼──────┼─────┼────────┼───────────────┼───────────────╢
║        │            │      │      │     │        │ All Products  │ Disconnecting ║
╚════════╧════════════╧══════╧══════╧═════╧════════╧═══════════════╧═══════════════╝


Data that needs to be calculated in this page:
1. Total Waiting Calls RIGHT NOW
2. Avarage waiting times in the last ten minutes

End of the day data:
1. Total Incoming Calls
    - Joing Calls
    - Complaints
    - Disconnecting
    - Service

REQUIRED FUNCTIONS:
1.Number of calls waiting RIGHT NOW
2. Waiting time for answer
3. total number of calls per day
    * calls regarding joining, complaints, disconnect requests
4. the data will be stored for AI purposes
5. real time AI 
*/

var tools = require('./try')

tools.hoursToMidnight()

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

/*
╔═══════════════╗
║ Express Setup ║
╚═══════════════╝
*/
const express = require('express');
const app = express();
var server = require('http').createServer(app);
const redis = require('redis')
const io = require("socket.io")(server)
const kafka = require('./kafkaProduce');
const bodyParser = require('body-parser');

// port
const port = 3000

/*
╔══════╗
║Redis ║
╚══════╝
*/

//REDIS CLIENT
let redisClient = redis.createClient();
// redisClient.subscribe('Joining');
redisClient.connect();

// REDIS SENDER
let redisSender = redisClient.duplicate()
redisSender.connect();

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


/*
╔══════╗
║KAFKA ║
╚══════╝
*/
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

async function syncStats() {
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
syncStats()

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

async function updateRedis(call) {
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

// consuming data from kafka and passing it on to relevant channel
kafkaConsumer.on("ready", function (arg) {
    console.log(`kafkaConsumer ${arg.name} ready`);
    kafkaConsumer.subscribe(topics);
    kafkaConsumer.consume();
})
    .on('data', async (data) => {
        //data.value is a JSON string
        // e.g: {"id":"1647855224006","name":"Orya","city":"Modii'n","gender":"male","age":"22","totalCalls":"1","products":"Home Internet","topic":"Complaint","totalTime":1.126}
        const call = JSON.parse(data.value)

        updateRedis(call)
        io.emit("stats", stats);

        // Inserting call data into the redis server
        redisSender.HSET('Ben',
            'Name', call.name, 'City', call.city, 'Gender', call.gender,
            'Products', call.products[0], 'Topic', call.topic, 'Total Time', call.totalTime,
            function (err, reply) {
                console.log(reply);
            });
    })


// kafkaConsumer.on("data", function (m) {
//     console.log(m.value.toString());
//     console.log("printing data from kafka")
// });


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
/*
╔══════════╗
║ Web-View ║
╚══════════╝
*/
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

/*
╔══════════╗
║ SocketIO ║
╚══════════╝
SocketIO connection
*/
io.on("connection", (socket) => {
    console.log("IO: new user connected");

    // listening for number of calls right now
    socket.on("totalWaitingCalls", (msg) => {
        console.log("Total waiting calls: " + msg.totalWaiting);
        io.emit("totalWaitingCalls", msg);
    });


    //listening for call details
    socket.on("callDetails", (msg) => {
        console.log(msg);
        io.emit(msg);
        kafka.publish(msg);
    });

});

//listen for requests
server.listen(port, () => {
    console.log(`Server: Ariel app listening at http://localhost:${port}`)
});

