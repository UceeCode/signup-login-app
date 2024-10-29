require('dotenv').config(); //loads environment variables from env file
const express = require('express'); //imports express, web framework used for handling routes and http requests
const mongoose = require('mongoose'); //imports mongoose which is used to connect mongoDB and define schema and models
const bodyParser = require('body-parser'); //middleware used to parse incoming request bodies usually form data
const bcrypt = require('bcryptjs'); //for hashing passwords before storing in database
const User = require('./model/User'); //mongoose model representing user.

const app = new express(); //creates an instance of an express application for handling http requests, routes and middleware

//middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view-engine', 'ejs');

//connect to mongodb
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDb connected"))
    .catch(err => console.error("MongoDb connection error", err));