const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6ouqbod.mongodb.net/?retryWrites=true&w=majority`;

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

    const FootwearMarketCollection = client.db('footwearDB').collection('addProduct');
    const AddToCardCollection = client.db('footwearDB').collection('myCart');


    // app.get('/SlipperItem', async (req, res) => {
    //     const result = await FootwearMarketCollection.find().toArray();
    //     res.send(result);
    //   })
    // app.get('/SlipperItem', async (req, res) => {
    //     const result = await SixItemCollection.find().toArray();
    //     res.send(result);
    //   })
    // id niye kaj

    // app.get('/Slipperitem/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) }
    //   const result = await FootwearMarketCollection.findOne(query);
    //   res.send(result);

    // })


    // end
    // app.get('/slipperItem/:email', async (req, res) => {
    //   const email = req.params.email;
    //   // console.log(email);
    //   const query = { email: email };
    //   console.log(query);
    //   const user = await FootwearMarketCollection.find(query).toArray();
    //   // console.log(user);
    //   res.send(user)
    // })

    app.post('/addProduct', async (req, res) => {
      const addNewProduct = req.body;
      console.log(addNewProduct);
      const result = await FootwearMarketCollection.insertOne(addNewProduct)
      res.send(result);
    })

    app.post('/myAddCard', async (req, res) => {
      const myAddCard = req.body;
      console.log(myAddCard);
      const result = await AddToCardCollection.insertOne(myAddCard)
      res.send(result);
    })
    // details er kaj

    app.get('/details/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await FootwearMarketCollection.findOne(query);
      res.send(result);
    })



    // end

    // search er kaj 
    app.get('/search', async (req, res) => {
      const filter = req.query;
      console.log(filter);
      let query = {}
      if (filter.search) {
        query = {
          brand: { $regex: filter.search, $options: 'i' }
        };
      }
      const cursor = await FootwearMarketCollection.find(query).toArray();
      res.send(cursor)
    })


    // end

    app.get('/slipperItem', async (req, res) => {
      const result = await FootwearMarketCollection.find().toArray();
      res.send(result);
    })
    app.get('/addProduct', async (req, res) => {
      const result = await FootwearMarketCollection.find().toArray();
      res.send(result);
    })

    app.get('/getAddToCard', async (req, res) => {
      const result = await AddToCardCollection.find().toArray();
      res.send(result);
    })

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await AddToCardCollection.deleteOne(query);
      res.send(result);
    })


    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('Footwear Market is be running')
})

app.listen(port, () => {
  console.log(`Footwear Market is running on port ${port}`);
})