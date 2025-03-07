/*jshint esversion: 8 */
//Step 1 - Task 2: Import necessary packages
const express = require('express');
const app = express();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');  // Import Pino logger

//Step 1 - Task 3: Create a Pino logger instance
const logger = pino();  // Create a Pino logger instance

dotenv.config();

//Step 1 - Task 4: Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
         // {{insert code here}}
         const db = await connectToDatabase();

        // Task 2: Access MongoDB collection
         // {{insert code here}}
         const collection = db.collection("users");

        //Task 3: Check for existing email
         // {{insert code here}}
        const existingEmail = await collection.findOne({ email: req.body.email });

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;

        // {{insert code here}} //Task 4: Save user details in database
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });
         // {{insert code here}} //Task 5: Create JWT authentication with user._id as payload
        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User registered successfully');
        res.json({authtoken,email});
    } catch (e) {
         return res.status(500).send('Internal server error');
    }
});

//Login Endpoint
router.post('/login', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`.
        const db = await connectToDatabase();

        // Task 2: Access MongoDB `users` collection
        const collection = db.collection("users");

        // Task 3: Check for user credentials in database
        const theUser = await collection.findOne({email: req.body.email });

        // Task 4: Task 4: Check if the password matches the encrypyted password and send appropriate message on mismatch
        if (theUser) {
            let result = await bcryptjs.compare(req.body.password, theUser.password)
          if(!result) {
                logger.error('Passwords do not match');
                return res.status(404).json({ error: 'Wrong password' });
            }
            //continue other tasks
            let payload = {
                user: {
                    id: theUser._id.toString(),
                },
            };

            // Task 5: Fetch user details from database
            const userName = theUser.firstName;
            const userEmail = theUser.email;

            // Task 6: Create JWT authentication if passwords match with user._id as payload
            const authtoken = jwt.sign(payload, JWT_SECRET);
            logger.info('User logged in successfully');
            return res.status(200).json({ authtoken, userName, userEmail });
        } else {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // Task 7: Send appropriate message if user not found
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

module.exports = router;