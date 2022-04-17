const express = require('express');
const app = express();
const port = 3003


// --------------- MongoDB
var mongo = require('./mongo/mongoDB')
const db = require('./mongo/mongoose');

// --------------- Kafka
const kafka = require('./kafka/kafkaConsume');
const kafkaConsume = kafka.consumer

// consuming data from kafka and passing it on to relevant channel
/* Kafka */
kafkaConsume.on("data", function (message) {
    const phoneCall = new db.callExport(JSON.parse(message.value));

    phoneCall.save()
        .then(() => console.log("Inserted to MongoDB"))
        .catch((err) => console.log(err));
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(port, function () {
    console.log('Server started on port 3003')
})
