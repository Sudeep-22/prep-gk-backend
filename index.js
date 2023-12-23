require('dotenv/config');
const connectToMongo = require('./db');
const express = require('express');
const app = express();
var cors = require('cors');
app.use(cors());
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

const startServer = async () => {
  try {
    await connectToMongo();
    app.get('/', (req, res) => {
      res.send('Hello World! The Changes have been deployed!!!');
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
  }
};

startServer();
