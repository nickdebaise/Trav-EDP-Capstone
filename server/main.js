const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require('passport');
const cors = require("cors");
require('dotenv').config();

const Employee = require('./models/employee');
const authRoutes = require('./routes/auth.routes');
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
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(Employee.createStrategy());

passport.serializeUser(Employee.serializeUser());
passport.deserializeUser(Employee.deserializeUser());

app.use("/", authRoutes);

app.use("/employees", employeeRoutes)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})