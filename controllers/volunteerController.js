const db = require('../db');  // assumes you have a db.js exporting a pg pool
const bcrypt = require('bcrypt');

exports.registerVolunteer = async (req, res) => {
  const { name, email, phone, address, password, skills, availability } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await db.query(
      'INSERT INTO users (name, email, phone, address, password, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, email, phone, address, hashedPassword, 'volunteer']
    );

    const userId = userResult.rows[0].id;

    await db.query(
      'INSERT INTO volunteers (user_id, skills, availability) VALUES ($1, $2, $3)',
      [userId, skills, availability]
    );

    res.status(201).json({ message: 'Volunteer registered successfully', userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register volunteer' });
  }
};
