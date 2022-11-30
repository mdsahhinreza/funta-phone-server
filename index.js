const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.epiqiul.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const userCollection = client.db("funtaPhone").collection("users");
    const productsCollection = client.db("funtaPhone").collection("products");
    const bookingCollection = client.db("funtaPhone").collection("bookings");
    const wishCollection = client.db("funtaPhone").collection("withItems");
    const categoriesCollection = client
      .db("funtaPhone")
      .collection("categories");

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const hasData = await userCollection.find(query).toArray();
      if (hasData[0]?.email) {
        return res.send({ status: "Already Has Data" });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const email = req.query.email;
      const type = req.query.userType;
      let query = {};
      if (email) {
        query = { email: email };
      }

      if (type) {
        query = { userType: type };
      }

      const result = await userCollection.find(query).toArray();
      res.send(result);
    });

    // app.get("/sellers", async (req, res) => {
    //   const query = { userType: "seller" };
    //   const result = await userCollection.find(query).toArray();
    //   res.send(result);
    // });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/user/admin/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          userType: "admin",
        },
      };
      const result = await userCollection.updateOne(query, updateDoc, option);
      res.send(result);
    });

    app.put("/user/verify/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          isVerified: true,
        },
      };
      const result = await userCollection.updateOne(query, updateDoc, option);
      res.send(result);
    });

    app.get("/categories", async (req, res) => {
      const query = {};
      const categories = await categoriesCollection.find(query).toArray();
      res.send(categories);
    });

    app.get("/products", async (req, res) => {
      const email = req.query.email;
      let filter = {};
      if (email) {
        filter = { sellerEmail: email };
      }
      const products = await productsCollection.find(filter).toArray();
      res.send(products);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/report/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          reportedItem: true,
        },
      };
      const result = await productsCollection.updateOne(
        query,
        updateDoc,
        option
      );
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    app.get("/products/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { productCategory: id };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/wish", async (req, res) => {
      const wishItem = req.body;
      const result = await wishCollection.insertOne(wishItem);
      res.send(result);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { buyerEmail: email };
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.log);

app.get("/", (req, res) => {
  res.send("Funta Phone Server is Runnig");
});

app.listen(port, () => {
  console.log(`Funta Phone Server is Running on ${port}`);
});
