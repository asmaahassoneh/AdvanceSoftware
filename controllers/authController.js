const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const con = require('../config/db'); 

const registerUser = async (req, res) => {
    const { name, email, phone, address, password_hash, role } = req.body;
    if (!password_hash) {
        return res.status(400).json({ error: "Password is required" });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password_hash, 10);
        const insertQry = `INSERT INTO users (name, email, phone, address, password_hash, role)
                           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
        const result = await con.query(insertQry, [name, email, phone, address, hashedPassword, role]);
        res.status(201).json({ message: 'User registered', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password_hash } = req.body;
    try {
        const result = await con.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0)
            return res.status(401).json({ error: 'Invalid email or password' });

        const user = result.rows[0];
        const validPass = await bcrypt.compare(password_hash, user.password_hash);
        if (!validPass)
            return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { registerUser, loginUser };
