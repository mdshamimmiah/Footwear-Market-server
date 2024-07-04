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

console.log('MongoDB URI:', uri); // URI যাচাই করার জন্য

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect(); // Connect to MongoDB
    console.log("Connected to MongoDB");

    const FootwearMarketCollection = client.db('footwearDB').collection('addProduct');
    const FootwearMarketCollection1 = client.db('footwearDB').collection('gallary');
    const AddToCardCollection = client.db('footwearDB').collection('myCart');

    app.post('/addProduct', async (req, res) => {
      const addNewProduct = req.body;
      console.log(addNewProduct);
      const result = await FootwearMarketCollection.insertOne(addNewProduct);
      res.send(result);
    });

    app.post('/myAddCard', async (req, res) => {
      const myAddCard = req.body;
      console.log(myAddCard);
      const result = await AddToCardCollection.insertOne(myAddCard);
      res.send(result);
    });

    app.get('/details/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await FootwearMarketCollection.findOne(query);
      res.send(result);
    });

    app.get('/search', async (req, res) => {
      const filter = req.query;
      let query = {};
      if (filter.search) {
        query = {
          brand: { $regex: filter.search, $options: 'i' }
        };
      }
      const cursor = await FootwearMarketCollection.find(query).toArray();
      res.send(cursor);
    });

    app.get('/addItem/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await AddToCardCollection.findOne(query);
      res.send(result);
    });

    app.get('/slipperItem', async (req, res) => {
      const result = await FootwearMarketCollection.find().toArray();
      res.send(result);
    });

    app.get('/album', async (req, res) => {
      const result = await FootwearMarketCollection1.find().toArray();
      res.send(result);
    });

    app.get('/addProduct', async (req, res) => {
      const result = await FootwearMarketCollection.find().toArray();
      res.send(result);
    });

    app.get('/getAddToCard', async (req, res) => {
      const result = await AddToCardCollection.find().toArray();
      res.send(result);
    });

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await AddToCardCollection.deleteOne(query);
      res.send(result);
    });

    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const UpdateProduct = req.body;
      const product = {
        $set: {
          name: UpdateProduct.name,
          price: UpdateProduct.price,
          description: UpdateProduct.description,
        }
      };
      const result = await AddToCardCollection.updateOne(filter, product, options);
      res.send(result);
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Footwear Market is running');
});

app.listen(port, () => {
  console.log(`Footwear Market is running on port ${port}`);
});
