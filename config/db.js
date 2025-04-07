require('dotenv').config();
const { Client } = require('pg');
const express = require('express');

const con = new Client({
    host: "localhost",
    user: "postgres",
    port: 5433,
    password: "2004",
    database: "HopeConnectDataBase"
});


con.connect()
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch((err) => console.error('❌ DB connection error', err));

module.exports = con; 
