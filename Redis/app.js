const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server)
const port = 3002

//------------ redis ------------
const redis = require('./redis/redisConsume')


//------------ kafka------------
const kafka = require('./kafka/kafkaConsume');
const kafkaProducer = require('./kafka/kafkaProduce')
const bodyParser = require('body-parser');


kafka.consumer.on("data", async (data) => {
    try {
        redis.updateRedis(data)
        kafkaProducer.publish(JSON.parse(data.value).currWaitingCalls)
    } catch {
        console.log(err)
    }
});
//------------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.set('view engine', 'ejs');
// app.use(express.static("public"));

// app.get('/', (req, res) => res.send("<a href='/send'>Send</a>"));
// app.get('/send', (req, res) => res.render('sender'));


server.listen(port, () => console.log(`Redis app listening at http://localhost:${port}`));


