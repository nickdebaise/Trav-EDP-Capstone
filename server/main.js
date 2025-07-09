const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const DB_URL = "";

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})