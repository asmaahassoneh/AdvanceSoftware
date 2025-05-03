const con = require('../config/db');

const createPhysicalDonation = async (req, res) => {
  const { donation_id, orphanage_id, tracking_info } = req.body;

  try {
    const result = await con.query(
      `INSERT INTO physical_donations (donation_id, orphanage_id, tracking_info) 
       VALUES ($1, $2, $3) RETURNING *`,
      [donation_id, orphanage_id, tracking_info]
    );

    res.status(201).json({ message: 'Physical donation created', donation: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create physical donation' });
  }
};

const updateDeliveryStatus = async (req, res) => {
  const { id } = req.params; // physical_donation id
  const { status, tracking_info } = req.body;

  try {
    const result = await con.query(
      `UPDATE physical_donations 
       SET status = $1, tracking_info = COALESCE($2, tracking_info)
       WHERE id = $3 RETURNING *`,
      [status, tracking_info, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Physical donation not found' });

    res.json({ message: 'Status updated', donation: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

const getAllDeliveries = async (req, res) => {
  try {
    const result = await con.query(
      `SELECT pd.*, o.name AS orphanage_name, o.location 
       FROM physical_donations pd
       JOIN orphanages o ON pd.orphanage_id = o.id
       ORDER BY pd.created_at DESC`
    );

    res.json({ deliveries: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
};

module.exports = {
    createPhysicalDonation,
    updateDeliveryStatus,
    getAllDeliveries,
  };
  