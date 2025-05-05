const db = require('../config/db');

// POST /api/donations
exports.createDonation = async (req, res) => {
  try {
    const { type, amount, description } = req.body;
    const donorId = req.user.id; // assuming auth middleware adds this

    if (!type || (type === 'money' && (!amount || amount <= 0))) {
      return res.status(400).json({ message: 'Invalid donation data' });
    }

    const query = `
      INSERT INTO donations (donor_id, type, amount, description, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;

    const values = [donorId, type, amount || null, description || null];
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
