require('dotenv').config(); // Loads environment variables from .env file
const express = require('express'); // Imports Express, a web framework used for handling routes and HTTP requests
const mongoose = require('mongoose'); // Imports Mongoose for MongoDB connection and schema/model definition
const bodyParser = require('body-parser'); // Middleware for parsing incoming request bodies, usually form data
const bcrypt = require('bcryptjs'); // For hashing passwords before storing in the database
const User = require('./model/User'); // Mongoose model representing user

const app = express(); // Creates an instance of an Express application

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Add this line to handle JSON bodies
app.use(express.static('public'));
app.set('view engine', 'ejs'); // Correct view engine setting


// Connect to MongoDB (Removed deprecated options)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error", err));

// Routes
// Signup route (GET) - Displays the sign-up form when the user accesses /signup
app.get('/signup', (req, res) => res.render('signup'));

// Login route (GET) - Displays the login form when the user accesses /login
app.get('/login', (req, res) => res.render('login')); 

// SIGNUP ROUTE (POST)
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!password) {
        return res.status(400).send('Password is required'); // Check if password is provided
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        const user = new User({
            name,
            email, 
            password: hashedPassword,
        });

        await user.save(); // Save the user to the database
        res.redirect('/login');
    } catch (error) {
        console.error('Error signing up:', error); // Log the error for debugging
        res.status(500).send('Error signing up'); // Send a generic error message
    }
});

// LOGIN ROUTE (POST)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.send('Login successful');
        } else {
            res.status(401).send('Invalid email or password'); // Improved error message
        }
    } catch (error) {
        console.error('Error logging in:', error); // Log the error for debugging
        res.status(500).send('Internal server error'); // Send a generic error message
    }
});

// Start the server
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
