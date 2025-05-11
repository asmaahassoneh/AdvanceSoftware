const db = require('../config/db');

// POST /api/donations
exports.createDonation = async (req, res) => {
  try {
    const { type, amount, description, location } = req.body;
    const donorId = req.user.id;

    if (!type || (type === 'money' && (!amount || amount <= 0))) {
      return res.status(400).json({ message: 'Invalid donation data' });
    }

    const query = `
      INSERT INTO donations (donor_id, type, amount, description, location, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;

    const values = [donorId, type, amount || null, description || null, location || null];
    const result = await db.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create donation' });
  }
};

// GET /api/donations
exports.getUserDonations = async (req, res) => {
  try {
    const donorId = req.user.id;

    const query = `
      SELECT * FROM donations
      WHERE donor_id = $1
      ORDER BY created_at DESC;
    `;

    const result = await db.query(query, [donorId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch donations' });
  }
};
