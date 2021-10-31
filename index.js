const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qc9ei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tourX');
        const servicesCollection = database.collection('services');
        const orderCollection = database.collection('orders');

        //    GET Services
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        //    POST Services
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        // Post Order 
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log('Hit the post api', order);

            const result = await orderCollection.insertOne(order);
            console.log(result);
            res.json(result);
        });

        // GET Orders
        app.get("/orders", async (req, res) => {
            const cursor = await orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // DELETE Orders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            console.log('deleting order with id ', id)
            res.send(result);
        })


    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running My Tour-X server')
});

app.listen(port, () => {
    console.log('Running Tour-X server on port', port);
});