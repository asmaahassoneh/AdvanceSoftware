const jwt = require('jsonwebtoken');
const con = require('../config/db');  

const JWT_SECRET = process.env.JWT_SECRET;


const registerOrphan = async (req, res) => {
    const { name, age, health_status, education_status, photo_url, orphanage_name } = req.body;

    try {
        const decoded = jwt.verify(req.header('Authorization')?.replace('Bearer ', ''), JWT_SECRET);
        const { role } = decoded;

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
  
  const updateOrphan = async (req, res) => {
    const { name, age, health_status, education_status, photo_url, orphanage_name } = req.body;

    try {
        const decoded = jwt.verify(req.header('Authorization')?.replace('Bearer ', ''), JWT_SECRET);
        const { role } = decoded;

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
        const decoded = jwt.verify(req.header('Authorization')?.replace('Bearer ', ''), JWT_SECRET);
        const { role } = decoded;

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

const addReport = async (req, res) => {
    const { update_type, content, photo_url } = req.body;
    const orphan_id = req.params.id;

    if (!orphan_id || !update_type || !content) {
        return res.status(400).json({ error: 'Orphan ID, update type, and content are required' });
    }

    const validUpdateTypes = ['photo', 'progress', 'medical'];
    if (!validUpdateTypes.includes(update_type)) {
        return res.status(400).json({ error: 'Invalid update type. Valid types are: photo, progress, medical.' });
    }

    try {
        const decoded = jwt.verify(req.header('Authorization')?.replace('Bearer ', ''), JWT_SECRET);
        const { role } = decoded;

        if (role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can add reports.' });
        }

        const reportQry = `
            INSERT INTO child_updates (orphan_id, update_type, content, photo_url)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const values = [orphan_id, update_type, content, photo_url || null]; 

        const result = await con.query(reportQry, values); 

        res.status(201).json({ message: 'Report added successfully', report: result.rows[0] });
    } catch (err) {
        console.error('Error:', err);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token. Please log in.' });
        }
        res.status(500).json({ error: 'Failed to add report' });
    }
};

  module.exports = {
    registerOrphan,
    updateOrphan,
    deleteOrphan,
    addReport,
  };