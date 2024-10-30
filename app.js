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

//routes
//signup route(GET) - sets a route to display sign up form when user accesses /signup.
app.get('/signup', (req, res) => res.render('signup'));

//login route(GET) - sets a route to display log in form when user accesses /login
app.get('/login', (req, res) => res.render('login')); 

//SIGNUP ROUTE (POST)

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);

    const user = new User ({
        name,
        email, 
        password: hashedpassword,
    });

    try {
        await user.save();
        res.redirect('/login');
    } catch (error) {
        res.status(500).send('error signing up');
    }
})

//LOGIN ROUTE (POST)

app.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))){
        res.send('Login sucesss');
    } else {
        res.status(401).send('invalid');
    }
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
