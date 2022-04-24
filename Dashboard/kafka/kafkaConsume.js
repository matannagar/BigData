
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
    "group.id": "BigDataProject",
    "metadata.broker.list": "rocket-01.srvs.cloudkafka.com:9094,rocket-02.srvs.cloudkafka.com:9094,rocket-03.srvs.cloudkafka.com:9094".split(","),
    "socket.keepalive.enable": true,
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": "oocfu1ti",
    "sasl.password": "N9yyfVowKAlQNlyr1cSavQARLAJ7GTRM",
    "debug": "generic,broker,security"
};

const prefix = "oocfu1ti-";
const topic = `${prefix}dashboard`;
const topics = [topic];

//setting consumer client
const kafkaConsumer = new Kafka.KafkaConsumer(kafkaConf, {});

kafkaConsumer.on("ready", function (arg) {
    console.log(`Consumer ${arg.name} ready`);
    kafkaConsumer.subscribe(topics);
    kafkaConsumer.consume();
});

// kafkaConsumer.on("data", function (m) {
//     console.log(m.value.toString());
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

// kafkaConsumer.on("error", function (err) {
//     console.error(err);
// });

//start consuming
kafkaConsumer.connect();

module.exports = {
    consumer: kafkaConsumer
}
