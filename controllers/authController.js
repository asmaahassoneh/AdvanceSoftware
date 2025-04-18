const nodemailer = require('nodemailer');
const authService = require('../services/authService');
const con = require('../config/db');
require('dotenv').config();


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


const sendVerificationEmail = async (email, verificationToken) => {
    const verificationUrl = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Email Verification',
        text: `Please click on the following link to verify your email address: ${verificationUrl}`,
    };

    try {
      await transporter.sendMail(mailOptions);
  } catch (error) {
      console.error('Error sending email:', error); 
      throw new Error('Failed to send verification email');
  }  
};

const registerUser = async (req, res) => {
    const { name, email, phone, address, password, role } = req.body;

    if (!authService.isValidEmail(email)) {
        return res.status(400).json({
            error: 'Invalid email format',
            success: false,
        });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({
            error: 'Password must be at least 6 characters long',
            success: false,
        });
    }

    try {
        const existingUser = await con.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        const hashedPassword = await authService.hashPassword(password);

        const insertQry = `INSERT INTO users (name, email, phone, address, password_hash, role)
                           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;

        const result = await con.query(insertQry, [name, email, phone, address, hashedPassword, role]);
        const user = result.rows[0];

        const verificationToken = authService.generateToken({ id: user.id }, '1d');  
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'User registered. A verification email has been sent.', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: 'Verification token is required' });
    }

    try {
        const decoded = await authService.verifyToken(token);
        const { id } = decoded;
        const updateQry = 'UPDATE users SET verified = $1 WHERE id = $2 RETURNING *;';
        const updatedUser = await con.query(updateQry, [true, id]);

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Email verified successfully', user: updatedUser.rows[0] });
    } catch (err) {
        console.error('Error during email verification:', err);
        res.status(500).json({ error: 'Failed to verify email' });
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
      const isMatch = await authService.comparePassword(password, user.password_hash);
      if (!isMatch) {
          return res.status(401).json({ error: 'Invalid email or password' });
      }
      await con.query('UPDATE users SET status = $1 WHERE email = $2', ['online', email]);

      const token = authService.generateToken(
          { id: user.id, role: user.role },
          '2h'
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
  const { email, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
      const result = await con.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'User not found' });
      }

      const hashedPassword = await authService.hashPassword(newPassword);
      const updateQry = 'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING *;';
      const updatedUser = await con.query(updateQry, [hashedPassword, email]);

      res.json({ message: 'Password reset successful', user: updatedUser.rows[0] });
  } catch (err) {
      console.error('Error during password reset:', err);
      res.status(500).json({ error: 'Server error during password reset' });
  }
};

const logoutUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required for logout" });
  }

  try {
    const updateQuery = 'UPDATE users SET status = $1 WHERE email = $2';
    await con.query(updateQuery, ['offline', email]);

    res.json({ message: 'Logout successful, user is now offline' });

  } catch (err) {
    console.error('Logout Error:', err);
    res.status(500).json({ error: 'Server error during logout' });
  }
};

module.exports = { registerUser, loginUser, resetPassword, logoutUser, verifyEmail };
