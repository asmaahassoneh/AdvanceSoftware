const con = require('../config/db');  
const { getUserRole } = require('../services/authService');

const registerOrphan = async (req, res) => {
    const { name, age, health_status, education_status, photo_url, orphanage_name } = req.body;

    try {
        const role = getUserRole(req);

        if (role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can add an orphan.' });
        }

        const insertQry = `INSERT INTO orphans (name, age, health_status, education_status, photo_url, orphanage_name)
                           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;

        const orphanResult = await con.query(insertQry, [name, age, health_status, education_status, photo_url, orphanage_name]);

        res.status(201).json({ message: 'Orphan added successfully', orphan: orphanResult.rows[0] });
    } catch (err) {
        console.error('Error:', err);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token. Please log in.' });
        }
        res.status(500).json({ error: 'Failed to add orphan' });
    }
};

const getAllOrphans = async (req, res) => {
    try {
      const result = await con.query('SELECT * FROM orphans');
      res.json(result.rows);
    } catch (err) {
      console.error('Get All Orphans Error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const getOrphanById = async (req, res) => {
    try {
      const result = await con.query('SELECT * FROM orphans WHERE id = $1', [req.params.id]);
      if (!result.rows[0]) {
        return res.status(404).json({ error: 'Orphan not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Get Orphan Error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const updateOrphan = async (req, res) => {
    const { name, age, health_status, education_status, photo_url, orphanage_name } = req.body;

    try {
      const role = getUserRole(req);

        if (role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can update an orphan.' });
        }

        const updateQry = `UPDATE orphans SET name=$1, age=$2, health_status=$3, education_status=$4, photo_url=$5, orphanage_name=$6
                           WHERE id=$7 RETURNING *;`;

        const orphanResult = await con.query(updateQry, [name, age, health_status, education_status, photo_url, orphanage_name, req.params.id]);

        if (!orphanResult.rows[0]) {
            return res.status(404).json({ error: 'Orphan not found' });
        }

        res.json({ message: 'Orphan updated successfully', orphan: orphanResult.rows[0] });
    } catch (err) {
        console.error('Error:', err);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token. Please log in.' });
        }
        res.status(500).json({ error: 'Failed to update orphan' });
    }
};

const deleteOrphan = async (req, res) => {
    try {
      const role = getUserRole(req);

        if (role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can delete an orphan.' });
        }

        const deleteQry = `DELETE FROM orphans WHERE id=$1 RETURNING *;`;
        const orphanResult = await con.query(deleteQry, [req.params.id]);

        if (!orphanResult.rows[0]) {
            return res.status(404).json({ error: 'Orphan not found' });
        }

        res.json({ message: 'Orphan deleted successfully' });
    } catch (err) {
        console.error('Error:', err);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token. Please log in.' });
        }
        res.status(500).json({ error: 'Failed to delete orphan' });
    }
};

  module.exports = {
    registerOrphan,
    getAllOrphans,
    getOrphanById,
    updateOrphan,
    deleteOrphan,
  };