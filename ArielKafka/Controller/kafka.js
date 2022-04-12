
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

kafkaConsumer.on("error", function (err) {
    // console.error(err);
});

//start consuming
kafkaConsumer.connect();

module.exports = {
	
}