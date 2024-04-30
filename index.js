const express = require("express");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5001;
const cors = require("cors");

//middleware cors and express
app.use(cors({ origin: "*" }));
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
    // await client.connect();

    const touristsCollection = client
      .db("touristsDb")
      .collection("touristsData");

    const countriesCollection = client.db("touristsDb").collection("countries");
    const countriesCollection1 = client
      .db("touristsDb")
      .collection("countriesCategories");

    app.get("/tourists", async (req, res) => {
      const tourists = touristsCollection.find();
      const result = await tourists.toArray();
      res.send(result);
    });
    app.get("/tourists/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await touristsCollection.findOne(filter);
      res.send(result);
    });

    // countries
    app.get("/countries", async (req, res) => {
      const countries = countriesCollection.find();
      const result = await countries.toArray();
      // console.log(result);
      res.send(result);
    });
    app.get("/countriesDetails", async (req, res) => {
      const countries = countriesCollection1.find();
      const result = await countries.toArray();
      res.send(result);
    });
    app.get("/countriesCategories/:country_name", async (req, res) => {
      const country_name = req.params.country_name;
      const countries = await countriesCollection1.find().toArray();
      // console.log(country_name, countries);
      const query = countries.filter(
        (country) => country.country_name === country_name
      );
      console.log(query);
      res.send(query);
    });

    app.post("/touristSpot", async (req, res) => {
      const tourist = req.body;
      const result = await touristsCollection.insertOne(tourist);
      res.send(result);
    });
    app.put("/update/:id", async (req, res) => {
      const update = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const updateDoc = {
        $set: {
          name: update.name,
          email: update.email,
          image: update.image,
          tourist_spot_name: update.tourist_spot_name,
          country_name: update.country_name,
          location: update.location,
          short_description: update.short_description,
          average_cost: update.average_cost,
          seasonality: update.seasonality,
          travel_time: update.travel_time,
          totalVisitorsPerYear: update.totalVisitorsPerYear,
        },
      };

      const result = await touristsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    app.delete("/touristSpot/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await touristsCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
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
