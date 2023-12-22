const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.naursbo.mongodb.net/?retryWrites=true&w=majority`;

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


    const taskCollection = client.db('jobTask').collection('task')


    app.get('/tasks', async (req, res) =>{
        const cursor = taskCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.post('/tasks', async (req, res) =>{
        const item = req.body;
        const result = await taskCollection.insertOne(item)
        res.send(result)
    })

    app.delete('/tasks/:id', async (req, res) =>{

        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await taskCollection.deleteOne(query);
        res.send(result)
    })

    app.get('/tasks/:id', async (req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await taskCollection.findOne(query)
        res.send(result)
    })

    app.patch('/tasks/:id', async (req, res) =>{
        const item = req.body;
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const updateDoc = {
            $set: {
                title: item.title,
                category: item.category,
                deadline: item.deadline, 
                description: item.description
            }
        }
        const result = await taskCollection.updateOne(filter, updateDoc)
        res.send(result)
    })










    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




















app.get('/', (req, res)=>{
    res.send('job task server is running')
})

app.listen(port, ()=>{
    console.log(`job task server is running on port ${port}`)
})