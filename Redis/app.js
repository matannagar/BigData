const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server)
const port = 3002

//------------ redis ------------
const redis = require('./redisConsume')


//------------ kafka------------
const kafka = require('./kafkaConsume');
const kafkaProducer = require('./kafkaProduce')
const bodyParser = require('body-parser');


kafka.consumer.on("data", async (data) => {
    try {
        redis.saveCallInfo(data)
        redis.updateRedis(data)
        kafkaProducer.publish(JSON.parse(data.value).currWaitingCalls)
    } catch {
        console.log(err)
    }
});
//------------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', (req, res) => res.send("<a href='/send'>Send</a>"));
app.get('/send', (req, res) => res.render('sender'));



//------------ Socket.io ----------------
// io.on("connection", (socket) => {
//     console.log("new user connected");
//     socket.on("totalWaitingCalls", (msg) => { console.log(msg.totalWaiting) });
//     socket.on("callDetails", (msg) => { console.log(msg); kafka.publish(msg) });
// });


server.listen(port, () => console.log(`Ariel app listening at http://localhost:${port}`));


