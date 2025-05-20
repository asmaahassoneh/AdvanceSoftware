const con = require('../config/db');
const { getUserId, getUserRole } = require('../middleware/auth');

const deleteAccount = async (req, res) => {
  try {
    const adminId = getUserId(req);
    const role = getUserRole(req);

    if (role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete accounts.' });
    }

    const { userId } = req.params;

    if (parseInt(userId) === adminId) {
      return res.status(400).json({ error: 'Admins cannot delete their own account.' });
    }

    const check = await con.query(`SELECT id FROM users WHERE id = $1`, [userId]);
    if (check.rowCount === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await con.query(`DELETE FROM users WHERE id = $1`, [userId]);

    res.json({ message: `User with ID ${userId} has been deleted.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = {
  deleteAccount,
};
