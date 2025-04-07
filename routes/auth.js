const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;


// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const pool = require('../db'); // Ensure you're importing the pool object
// require('dotenv').config();
// const router = express.Router();

// router.post('/register', async (req, res) => {
//     const { name, email, phone, address, password, role } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const insertQry = `INSERT INTO users (name, email, phone, address, password_hash, role)
//                            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
//         const result = await pool.query(insertQry, [name, email, phone, address, hashedPassword, role]);
//         res.status(201).json({ message: 'User registered', user: result.rows[0] });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//         if (result.rows.length === 0)
//             return res.status(401).json({ error: 'Invalid email or password' });

//         const user = result.rows[0];
//         const validPass = await bcrypt.compare(password, user.password_hash);
//         if (!validPass)
//             return res.status(401).json({ error: 'Invalid email or password' });

//         const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
//         res.json({ message: 'Login successful', token });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;




// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const con = require('../db'); // Adjust this path to where db.js is located
// require('dotenv').config();
// const router = express.Router();

// // Register route
// router.post('/register', async (req, res) => {
//     const { name, email, phone, address, password, role } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const insertQry = `INSERT INTO users (name, email, phone, address, password_hash, role)
//                            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
//         const result = await con.query(insertQry, [name, email, phone, address, hashedPassword, role]);
//         res.status(201).json({ message: 'User registered', user: result.rows[0] });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Login route
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const result = await con.query('SELECT * FROM users WHERE email = $1', [email]);
//         if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

//         const user = result.rows[0];
//         const validPass = await bcrypt.compare(password, user.password_hash);
//         if (!validPass) return res.status(401).json({ error: 'Invalid email or password' });

//         const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
//         res.json({ message: 'Login successful', token });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;


// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const con = require('../db'); // your database connection file
// require('dotenv').config();
// const router = express.Router();

// router.post('/postData', async (req, res) => {
//     const { name, email, phone, address, password, role } = req.body;
    
//     // Ensure password is hashed before insertion
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10); // Hash the plaintext password
//         const insertQry = `INSERT INTO users (name, email, phone, address, password_hash, role) 
//                            VALUES ($1, $2, $3, $4 , $5, $6);`;

//         // Run the query with the hashed password
//         const result = await con.query(insertQry, [name, email, phone, address, hashedPassword, role]);

//         console.log('Data inserted successfully:', result);
//         res.send("POSTED DATA");
//     } catch (err) {
//         // Log the error message for debugging
//         console.error('Database error:', err.message);

//         // Send a detailed error message
//         res.status(500).send(`Database error: ${err.message}`);
//     }
// });
// router.post('/postDataa', async (req, res) => {
//     const { name, email, phone, address, password, role } = req.body;

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // SQL query for inserting user data
//     const insertQry = `INSERT INTO users (name, email, phone, address, password_hash, role) 
//                        VALUES ($1, $2, $3, $4, $5, $6);`;

//     try {
//         // Use async/await for database query
//         const result = await con.query(insertQry, [name, email, phone, address, hashedPassword, role]);

//         console.log('Data inserted successfully:', result);
//         res.send("POSTED DATA");
//     } catch (err) {
//         console.error('Database error:', err.message);
//         res.status(500).send(`Database error: ${err.message}`);
//     }
// });




// router.post('/register', async (req, res) => {
//     const { name, email, phone, address, password, role } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const insertQry = `INSERT INTO users (name, email, phone, address, password_hash, role)
//                            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
//         const result = await con.query(insertQry, [name, email, phone, address, hashedPassword, role]);
//         res.status(201).json({ message: 'User registered', user: result.rows[0] });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const result = await con.query('SELECT * FROM users WHERE email = $1', [email]);
//         if (result.rows.length === 0)
//             return res.status(401).json({ error: 'Invalid email or password' });

//         const user = result.rows[0];
//         const validPass = await bcrypt.compare(password, user.password_hash);
//         if (!validPass)
//             return res.status(401).json({ error: 'Invalid email or password' });

//         const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
//         res.json({ message: 'Login successful', token });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;



// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// require('dotenv').config(); // loads .env vars

// const router = express.Router();


// app.post('/register', async (req, res) => {
//     const { name, email, phone, address, password, role } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const insertQry = `INSERT INTO users (name, email, phone, address, password_hash, role)
//                            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
//         const result = await con.query(insertQry, [name, email, phone, address, hashedPassword, role]);
//         res.status(201).json({ message: 'User registered', user: result.rows[0] });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const result = await con.query('SELECT * FROM users WHERE email = $1', [email]);
//         if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

//         const user = result.rows[0];
//         const validPass = await bcrypt.compare(password, user.password_hash);
//         if (!validPass) return res.status(401).json({ error: 'Invalid email or password' });

//         const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
//         res.json({ message: 'Login successful', token });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;
