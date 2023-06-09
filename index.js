require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');

const app = express();
app.use(bodyParser.json());

// Routes
const users = require('./routes/users');
const contacts = require('./routes/contacts');

// Use routes
app.use('/users', users);
app.use('/contacts', contacts);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});