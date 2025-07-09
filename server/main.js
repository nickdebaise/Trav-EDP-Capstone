const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();

const employeeRoutes = require('./routes/employees.routes')


const DB_URL = `${process.env.MONGO_DB_URL}/${process.env.MONGO_DB}`;

mongoose.connect(DB_URL)
const db = mongoose.connection;

db.on('error', (error) => {
    console.log(error)
})

db.once('connected', () => {
    console.log('Database Connected');
})

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.post("/login", (req, res) => {
    res.send("Logged IN")
})

app.use("/employees", employeeRoutes)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})