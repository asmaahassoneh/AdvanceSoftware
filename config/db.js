require('dotenv').config();
const { Client } = require('pg');
const express = require('express');

const con = new Client({
    host: process.env.HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


con.connect()
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch((err) => console.error('❌ DB connection error', err));

module.exports = con; 
