const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.enfgege.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

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
        // Send a ping to confirm a successful connection


        const allBrandCollection = client.db('brandProductDB').collection('brands');


        // Display data READ/GET starts
        app.get('/brands', async (req, res) => {
            const cursor = allBrandCollection.find();
            const result = await cursor.toArray([]);
            res.send(result);
        })
        // Display data READ/GET ends



        app.get('/brands/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allBrandCollection.findOne(query);
            res.send(result);

        })

        // Backend CCREATE/POST starts
        app.post('/brands', async (req, res) => {
            const productAdded = req.body;
            console.log(allBrandCollection);
            const result = await allBrandCollection.insertOne(productAdded);
            res.send(result);
        })
        // Backend CCREATE/POST ends


         // Backend DELETE starts
         app.delete('/brands/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allBrandCollection.deleteOne(query);
            res.send(result);
        })
        // Backend DELETE ends



        // Backend PUT starts
        app.put('/brands/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedProduct = req.body;
            const product = {
                $set: {
                    imgUrl: updatedProduct.imgUrl,
                    brandName: updatedProduct.brandName,
                    name: updatedProduct.name,
                    type: updatedProduct.type,
                    productImg: updatedProduct.productImg,
                    shdetails: updatedProduct.shdetails,
                    description: updatedProduct.description,
                    price: updatedProduct.price,
                    rating: updatedProduct.rating
                }
            }

            const result = await allBrandCollection.updateOne(filter, product, options)
            res.send(result);

        })






        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('DressCharm server is runnig')
})

app.listen(port, () => {
    console.log(`DressCharm server is runnig on port: ${port}`);
})