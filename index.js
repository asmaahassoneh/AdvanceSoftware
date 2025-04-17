require('dotenv').config();
const express = require('express');
const con = require('./config/db'); 
const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log("Server is running.....")
});
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes); 