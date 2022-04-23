const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server)
const port = 3002

//------------ redis ------------
const redisConsume = require('./redis/redisConsume')
const redisProduce = require('./redis/redisProduce')


//------------ kafka------------
const kafka = require('./kafka/kafkaConsume');
const kafkaProducer = require('./kafka/kafkaProduce')
const bodyParser = require('body-parser');


kafka.consumer.on("data", async (data) => {
    try {
        redisConsume.updateRedis(data)
        redisProduce.syncDashboard().then((stats) => {
            kafkaProducer.publish(stats)
        })
    } catch {
        console.log('An error occured!')
    }
});
//------------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


server.listen(port, () => console.log(`Redis app listening at http://localhost:${port}`));


