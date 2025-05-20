const con = require('../config/db');
const { getUserRole, getUserId } = require('../middleware/auth'); 


const sponsorOrphan = async (req, res) => {
  const { orphan_id, amount, frequency } = req.body;

  if (!orphan_id || !amount || !frequency) {
    return res.status(400).json({ error: 'Orphan ID, amount, and frequency are required' });
  }

  const validFrequencies = ['monthly', 'yearly'];
  if (!validFrequencies.includes(frequency)) {
    return res.status(400).json({ error: 'Invalid frequency. Use "monthly" or "yearly".' });
  }

  try {
    const role = getUserRole(req);
    if (role !== 'sponsor') {
      return res.status(403).json({ error: 'Only sponsors can create sponsorships.' });
    }

    const sponsor_id = getUserId(req); 

    const orphanCheck = await con.query('SELECT id FROM orphans WHERE id = $1', [orphan_id]);
    if (!orphanCheck.rows.length) {
      return res.status(404).json({ error: 'Orphan not found' });
    }

    const insertSponsorship = `
      INSERT INTO sponsorships (sponsor_id, orphan_id, amount, frequency, status)
      VALUES ($1, $2, $3, $4, 'active') RETURNING *;
    `;
    const values = [sponsor_id, orphan_id, amount, frequency];
    const result = await con.query(insertSponsorship, values);

    await con.query(
      `INSERT INTO transactions (user_id, amount, transaction_type, status)
       VALUES ($1, $2, 'sponsorship', 'completed');`,
      [sponsor_id, amount]
    );

    res.status(201).json({ message: 'Sponsorship created successfully', sponsorship: result.rows[0] });
  } catch (err) {
    console.error('Sponsor Orphan Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  sponsorOrphan,
};
