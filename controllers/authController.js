const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const con = require('../config/db'); 
const validator = require('validator'); 

const registerUser = async (req, res) => {
    const { name, email, phone, address, password, role } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
          error: 'Invalid email format', 
          success: false 
      });
  }

  // Password Length Check
  if (password.length < 6) {
      return res.status(400).json({ 
          error: 'Password must be at least 6 characters long', 
          success: false 
      });
  }
    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }
    
    try {
      const existingUser = await con.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "User already exists with this email" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
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
  const { email, password } = req.body;

  try {
      const result = await con.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
          return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
          return res.status(401).json({ error: 'Invalid email or password' });
      }
      await con.query('UPDATE users SET status = $1 WHERE email = $2', ['online', email]);

      const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '2h' }
      );
      delete user.password_hash;

      res.json({
          message: 'Login successful',
          token,
          user
      });

  } catch (err) {
      console.error('Login Error:', err);
      res.status(500).json({ error: 'Server error during login' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await con.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'User not found' });
      }

      const user = result.rows[0];
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateQry = 'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING *;';
      const updatedUser = await con.query(updateQry, [hashedPassword, user.id]);
      res.json({ message: 'Password reset successful', user: updatedUser.rows[0] });
  } catch (err) {
      console.error('Error during password reset:', err);
      res.status(500).json({ error: 'Server error during password reset' });
  }
};

const logoutUser = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;  
    const updateQuery = 'UPDATE users SET status = $1 WHERE email = $2';
    await con.query(updateQuery, ['offline', email]);

    res.json({ message: 'Logout successful, user is now offline' });

  } catch (err) {
    console.error('Logout Error:', err);
    res.status(500).json({ error: 'Server error during logout' });
  }
};



module.exports = { registerUser, loginUser, resetPassword, logoutUser};
