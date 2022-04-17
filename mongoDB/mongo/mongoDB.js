const MongoClient = require("mongodb").MongoClient;

require("dotenv").config();

const client = new MongoClient(
    process.env.MONGO_URL,
);
