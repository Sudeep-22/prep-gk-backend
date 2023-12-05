require('dotenv/config');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// async function connectToMongo() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     // const database = client.db('GK-Prep');
//     // const collection = database.collection('notes');

//     // const documents = await collection.find({}).toArray();
//     // console.log(documents);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
async function connectToMongo() {
  try {
    await client.connect();
      await client.db("admin").command({ ping: 1 }); 
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
connectToMongo().catch(console.dir);
module.exports = connectToMongo;

