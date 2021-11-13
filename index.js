const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ibdox.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db('camera_site');
    const productsCollection = database.collection('products');
    const usersCollection = database.collection('users');

     // GET API
     app.get('/products', async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
  });

    app.get('/user', async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      console.log(query);
      const cursor = usersCollection.find(query);
      const userinfo = await cursor.toArray();
      res.json(userinfo);
    });

    app.post('/user', async (req, res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello customers!');
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
