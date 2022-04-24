// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");
require("dotenv").config();

const kafkaConf = {
  "group.id": "BigDataProject",
  "metadata.broker.list": "rocket-01.srvs.cloudkafka.com:9094,rocket-02.srvs.cloudkafka.com:9094,rocket-03.srvs.cloudkafka.com:9094".split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": process.env.KAFKA_USER,
  "sasl.password": process.env.KAFKA_PASS,
  "debug": "generic,broker,security"
};

const prefix = "oocfu1ti-";
const topic = `${prefix}default`;
const producer = new Kafka.Producer(kafkaConf);

const genMessage = m => new Buffer.alloc(m.length, m);

producer.on("ready", function (arg) {
  console.log(`Kafka producer is ready :)`);
});
producer.connect();

module.exports.publish = async function (msg) {
  m = JSON.stringify(msg);
  producer.produce(topic, -1, genMessage(m), uuid.v4());
  //producer.disconnect();   
}
