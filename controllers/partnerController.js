const con = require('../config/db');
const { getUserRole } = require('../services/authService');


const createPartner = async (req, res) => {
  const { name, email, phone, website, address, description } = req.body;

  try {
    const role = getUserRole(req);

    if (role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create a partner.' });
    }

    const insertQry = `
      INSERT INTO partners (name, email, phone, website, address, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const result = await con.query(insertQry, [name, email, phone, website, address, description]);
    res.status(201).json({ message: 'Partner created successfully', partner: result.rows[0] });
  } catch (err) {
    console.error('Create Partner Error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token. Please log in.' });
    }
    res.status(500).json({ error: err.message });
  }
};


const getAllPartners = async (req, res) => {
  try {
    const result = await con.query('SELECT * FROM partners');
    res.json(result.rows);
  } catch (err) {
    console.error('Get All Partners Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


const getPartnerById = async (req, res) => {
  try {
    const result = await con.query('SELECT * FROM partners WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Partner not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get Partner Error:', err);
    res.status(500).json({ error: err.message });
  }
};


const updatePartner = async (req, res) => {
  const { name, email, phone, website, address, description } = req.body;

  try {
    const role = getUserRole(req);

    if (role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update a partner.' });
    }

    const updateQry = `
      UPDATE partners
      SET name = $1, email = $2, phone = $3, website = $4, address = $5, description = $6
      WHERE id = $7
      RETURNING *;
    `;

    const result = await con.query(updateQry, [name, email, phone, website, address, description, req.params.id]);

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json({ message: 'Partner updated successfully', partner: result.rows[0] });
  } catch (err) {
    console.error('Update Partner Error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token. Please log in.' });
    }
    res.status(500).json({ error: err.message });
  }
};


const deletePartner = async (req, res) => {
  try {
    const role = getUserRole(req);

    if (role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete a partner.' });
    }

    const result = await con.query('DELETE FROM partners WHERE id = $1 RETURNING *', [req.params.id]);

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json({ message: 'Partner deleted successfully' });
  } catch (err) {
    console.error('Delete Partner Error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token. Please log in.' });
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPartner,
  getAllPartners,
  getPartnerById,
  updatePartner,
  deletePartner
};
