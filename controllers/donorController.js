const con = require('../config/db');
const { getUserId, getUserRole } = require('../middleware/auth');

const getDonorDashboard = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const role = getUserRole(req);

    if (role !== 'donor' && role !== 'sponsor') {
      return res.status(403).json({ error: 'Access denied: Only donors or sponsors allowed' });
    }

    const donations = await con.query(
      `SELECT id, type, amount, description, created_at
       FROM donations
       WHERE donor_id = $1
       ORDER BY created_at DESC`,
      [user_id]
    );


    const sponsorships = await con.query(
      `SELECT s.amount, s.frequency, s.status, o.name AS orphan_name, o.photo_url
       FROM sponsorships s
       JOIN orphans o ON s.orphan_id = o.id
       WHERE s.sponsor_id = $1`,
      [user_id]
    );

    const transactions = await con.query(
      `SELECT amount, type, status, date
       FROM transactions
       WHERE donor_id = $1
       ORDER BY date DESC`,
      [user_id]
    );

    const updates = await con.query(
      `SELECT cu.update_type, cu.content, cu.photo_url, cu.created_at, o.name AS orphan_name
       FROM child_updates cu
       JOIN orphans o ON cu.orphan_id = o.id
       WHERE cu.orphan_id IN (
         SELECT orphan_id FROM sponsorships WHERE sponsor_id = $1
       )
       ORDER BY cu.created_at DESC`,
      [user_id]
    );

    res.status(200).json({
      donations: donations.rows,
      sponsorships: sponsorships.rows,
      transactions: transactions.rows,
      impact_updates: updates.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load donor dashboard' });
  }
};

module.exports = {
  getDonorDashboard,
};
