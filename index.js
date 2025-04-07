require('dotenv').config(); // Load env variables early
const express = require('express');
const con = require('./config/db'); // ← use the db connection
const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log("Server is running.....")
});
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // Prefix your routes with '/api/auth'