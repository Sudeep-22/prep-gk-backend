require('dotenv/config');
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
// async function connectToMongo() {
//   try {
//     mongoose.connect(uri);
//       await client.db("admin").command({ ping: 1 });
//       const db = client.db("GK-Prep");
//          // Reference the "people" collection in the specified database
//          const users = db.collection("users"); 
//          const notes = db.collection("notes"); 
//         } catch (error) {
//       console.error(`Error connecting to MongoDB: ${error.message}`);
//       await new Promise(resolve => setTimeout(resolve, 1000));
//     }
//   }
async function connectToMongo(){
  mongoose.connection.on('connected', () => console.log('connected'));
  try {
    await mongoose.connect(uri);
    console.log('Connected');
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectToMongo;



