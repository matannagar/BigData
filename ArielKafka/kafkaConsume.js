// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה
/**
 * This is the main server app of express. it handles the ongoing trackable Packages.
 * it updates the dashboard and the charts pages.
 */

//unique user ID
const uuid = require("uuid");

//getting kafka for node.js
const Kafka = require("node-rdkafka");

// configuartion of karafka user
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
const topic = `${prefix}new`;
// const producer = new Kafka.Producer(kafkaConf);

// const genMessage = m => new Buffer.alloc(m.length, m);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// const express = require("express");
// const SocketIO = require('socket.io')
// const app = express();
// const server = express().use(app).listen(3000, () => {
//   console.log(`Listening Socket on http://localhost:3000`);

// })

// /* SocketIO connection */
// const io = SocketIO(server)
// io.on('connection', (socket) => {
//   socket.on('update', (msg) => {
//     console.log(msg)
//     io.emit(msg)
//   })
// })

// //connection to redis and kefka
// const broker = require('redis').createClient()

// const client = broker.duplicate()
// client.subscribe([topic])
// app.use(express.static('public'))
// app.set('view engine', 'ejs')

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//const prefix = process.env.CLOUDKARAFKA_USERNAME;

const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
  "auto.offset.reset": "beginning"
});

consumer.on("error", function (err) {
  console.error(err);
});


consumer.connect();
// consuming data from kafka and passing it on to relevant channel
consumer.on("ready", function (arg) {
  console.log(`Consumer ${arg.name} ready`);
  consumer.subscribe(topics);
  consumer.consume();
})

consumer.on("data", function (m) {
  console.log(m.value.toString());
});
consumer.on("disconnected", function (arg) {
  process.exit();
});
consumer.on('event.error', function (err) {
  console.error(err);
  process.exit(1);
});
consumer.on('event.log', function (log) {
  console.log(log);
});




// /*Express - Rendering the main page - Dashboard */
// const home = app.get('/', (req, res) => {
//   res.render("pages/dashboard", { status })
// })

// /*Express - Rendering the charts page */
// const charts = app.get('/charts', (req, res) => {
//   res.render("pages/charts", { status, getSizeAvg, getTaxAvg })
// })

// /*Express - Rendering the analytics page */
// app.get('/analytics', analytics)
