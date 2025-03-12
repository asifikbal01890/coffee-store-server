const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x5lfl.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const coffeeCollections = client.db("coffee_store").collection("coffee");
    const usersCollections = client.db("coffee_store").collection("users");


    app.get('/coffee/:', async (req, res) => {
      const result = await coffeeCollections.find().sort({ price: 1 }).toArray()
      res.send(result)
    })

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollections.findOne(query);
      res.send(result)
    })

    app.post('/coffee', async (req, res) => {
      const data = req.body;
      const result = await coffeeCollections.insertOne(data);
      res.send(result)
    })

    app.get('/users', async(req, res)=>{
      const result = await usersCollections.find().toArray()
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const data = req.body;
      const result = await usersCollections.insertOne(data);
      res.send(result)
    })

    app.patch('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user.email }
      const update = {
        $set: {
          lastSignInTime: user.lastSignInTime
        }
      }
      const result = await usersCollections.updateOne(query, update)
      res.send(result)
    })

    app.patch("/coffee_update/:id", async (req, res) => {
      const id = req.params.id;
      const coffeeInfoFromClient = req.body;
      const query = { _id: new ObjectId(id) }

      const doc = {
        $set: {
          name: coffeeInfoFromClient.name,
          chef: coffeeInfoFromClient.chef,
          supplier: coffeeInfoFromClient.supplier,
          details: coffeeInfoFromClient.details,
          teste: coffeeInfoFromClient.teste,
          category: coffeeInfoFromClient.category,
          photo_url: coffeeInfoFromClient.photo_url,
          price: coffeeInfoFromClient.price
        }
      }
      const UpdateDoc = await coffeeCollections.updateOne(query, doc)
      res.send(UpdateDoc)
    })

    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollections.deleteOne(query)
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('surver is running')
})

app.listen(port, () => {
  console.log(`server i running in ${port}`)
})