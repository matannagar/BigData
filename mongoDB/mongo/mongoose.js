var mongoose = require('mongoose');

require("dotenv").config();

mongoose.connect('mongodb+srv://matanbn:1559MBN7553@cluster0.jotyi.mongodb.net/callCenter?retryWrites=true&w=majority');

const callSchema = mongoose.Schema({
    id: String,
    period: String,
    name: String,
    city: String,
    gender: String,
    age: String,
    totalCalls: String,
    products: String,
    topic: String,
    totalTime: String,
})


const callExport = mongoose.model('calls', callSchema)

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
    console.log("Connected to MongoDB");
});

module.exports = {
    callExport
}
