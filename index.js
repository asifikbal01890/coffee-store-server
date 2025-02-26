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
    await client.connect();


    const coffeeCollections = client.db("coffee_store").collection("coffee");


    app.get('/coffee', async(req, res)=>{
      const result = await coffeeCollections.find().toArray()
      res.send(result)
    })
    app.get('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollections.findOne(query);
      res.send(result)
    })

    app.post('/coffee', async(req, res)=>{
        const data = req.body;
        const result = await coffeeCollections.insertOne(data);
        res.send(result)
    })

    app.delete('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollections.deleteOne(query)
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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