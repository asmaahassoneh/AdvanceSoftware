require('dotenv').config();
const { Client } = require('pg');
const express = require('express');

const con = new Client({
    host: "localhost",
    user: "postgres",
    port: 5433,
    password: "12345",
    database: "HopeConnectDataBase"
});


con.connect()
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch((err) => console.error('❌ DB connection error', err));

module.exports = con; 




// require("dotenv").config();

// const http = require("http");
// const { neon } = require("@neondatabase/serverless");

// const sql = neon(process.env.DATABASE_URL);

// const requestHandler = async (req, res) => {
//   const result = await sql`SELECT version()`;
//   const { version } = result[0];
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end(version);
// };

// http.createServer(requestHandler).listen(3000, () => {
//   console.log("Server running at http://localhost:3000");
// });
