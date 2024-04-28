const express = require("express");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5001;
const cors = require("cors");

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.avssyq6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const touristsCollection = client
      .db("touristsDb")
      .collection("touristsData");

    app.get("/tourists", async (req, res) => {
      const tourists = touristsCollection.find();
      const result = await tourists.toArray();
      res.send(result);
    });
    app.get("/tourists/:id", async (rew, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await touristsCollection.findOne(filter);
      res.send(result);
    });

    app.post("/touristSpot", async (req, res) => {
      const tourist = req.body;
      const result = await touristsCollection.insertOne(tourist);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("the server is running");
});

app.listen(port, () => {
  console.log(`the server is running port on : ${port}`);
});
