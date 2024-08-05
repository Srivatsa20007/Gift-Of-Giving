// Import necessary modules
import express from "express";
import mongoose from "mongoose";
import { signup } from "./models/signup.js";
import cors from 'cors';
import { emp } from "./models/employee.js";
import nodemailer from "nodemailer";
// Create Express app
const app = express();

const port = 3000;
// app.use(express.json());
app.use(cors({
    origin: "http://127.0.0.1:3001",
    method: ["POST", "GET"]
}));
// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(__dirname));
let userData = {};

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/client")
    .then(() => console.log("Database Connected to client"))
    .catch((err) => console.error("Database Connection Error:", err));



// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'srikanthvarma6070@gmail.com',
        pass: 'bhyghgnklqymnxwz'
    }
});

// Function to send email
async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: 'srikanthvarma6070@gmail.com',
        to,
        subject,
        text
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}


// Define signup endpoint
app.post('/signup', async (req, res) => {
    const { username, email, password, isEmployee } = req.body;
    
    try {
        const newUser = new signup({
            name: username,
            email: email,
            password: password,
        });

        await newUser.save();
        res.status(200).send('Signup successful');
    } catch (error) {
        res.status(500).send('Error occurred: ' + error.message);
    }
});

// Define login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await signup.findOne({ email: email });
        if (user && user.password === password) {
            res.redirect("http://localhost:3001/index.html");
        } else {
            res.send('Invalid email or password');
        }
    } catch (error) {
        res.status(500).send('Error occurred: ' + error.message);
    }
});

// Endpoint for handling details submission
app.post('/details', (req, res) => {
    const { username, address, mobileno, message, donation } = req.body;

    if (!username || !address || !mobileno) {
        return res.status(400).send('Missing required fields');
    }

    userData = { username, address, mobileno, message, donation };
    res.status(200).send('Details received successfully');
});
app.post('/user-data', (req, res) => {
    if (!userData) {
        return res.status(404).send('No user data found');
    }
    res.json(userData);
});
let data=userData;

// Endpoint to serve map data
app.get('/map-data', (req, res) => {
    res.json(userData);
});

// Endpoint to get all employee locations
app.get('/employees', async (req, res) => {
    try {
        console.log('Fetching employees...');
        const employees = await emp.find({}, { _id: 0, name: 1, address: 1, email: 1, mobileno: 1 });
        console.log('Fetched employees:', employees);
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employee data:', error);
        res.status(500).send('Error fetching employee data: ' + error.message);
    }
});

app.post('/email', async (req, res) => {
    const { employeeEmail } = req.body;
    console.log(req.body)
    const emailText = `
        Hi,
        You have a new donation request from ${userData.username}.
        Address: ${userData.address}
        Mobile No: ${userData.mobileno}
        Message: ${userData.message}
        Donation: ${userData.donation}
    `;

    try {
        await sendEmail(employeeEmail, 'New Donation Request', emailText);
        console.log('email sent');
        res.status(200).send('Email sent to the nearest employee');
    } catch (error) {
        res.status(500).send('Error occurred: ' + error.message);
    }
});

app.get('*', (req, res) => {
    res.status(404).send('Page not found');
});

// Start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    console.log("hello");
});
