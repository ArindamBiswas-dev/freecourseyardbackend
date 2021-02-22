const express = require("express");
const cors = require("cors");
const router = require("./routes/userRoutes");
require('dotenv').config();

const app = express();
var bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// let database; let collection;

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  await client.connect();
  console.log("database connected");

  app.listen(8000, () => {
    console.log("Server Started");
  });

  app.locals.database = client.db("freecourseyardbackend");
}
run().catch(console.dir);

app.use(cors());
app.use(express.json());

app.use("/", router);