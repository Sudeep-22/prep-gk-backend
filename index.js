require('dotenv/config');
const connectToMongo = require('./db');
connectToMongo().catch(console.dir);
console.log("Entered index")

const express = require('express')
const app = express()
var cors = require('cors')
app.use(cors())
const port = process.env.PORT;
app.use(express.json())
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})