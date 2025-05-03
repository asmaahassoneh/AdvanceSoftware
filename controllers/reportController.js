const con = require('../config/db');  
const { getUserRole } = require('../services/authService');


const addReport = async (req, res) => {
  const { orphan_name, update_type, content, photo_url } = req.body;

  if (!orphan_name || !update_type || !content) {
      return res.status(400).json({ error: 'Orphan name, update type, and content are required' });
  }

  const validUpdateTypes = ['photo', 'progress', 'medical'];
  if (!validUpdateTypes.includes(update_type)) {
      return res.status(400).json({ error: 'Invalid update type. Valid types are: photo, progress, medical.' });
  }

  try {
      const role = getUserRole(req);
      if (role !== 'admin') {
          return res.status(403).json({ error: 'Only admins can add reports.' });
      }

      const orphanQry = `SELECT id FROM orphans WHERE name = $1 LIMIT 1;`;
      const orphanResult = await con.query(orphanQry, [orphan_name]);

      if (!orphanResult.rows.length) {
          return res.status(404).json({ error: 'Orphan not found' });
      }

      const orphan_id = orphanResult.rows[0].id;

      const reportQry = `
          INSERT INTO child_updates (orphan_id, update_type, content, photo_url)
          VALUES ($1, $2, $3, $4) RETURNING *;
      `;
      const values = [orphan_id, update_type, content, photo_url || null];

      const result = await con.query(reportQry, values);

      res.status(201).json({ message: 'Report added successfully', report: result.rows[0] });
  } catch (err) {
      console.error('Add Report Error:', err.message);
      if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ error: 'Invalid token. Please log in.' });
      }
      res.status(500).json({ error:  err.message});
  }
};

const updateReport = async (req, res) => {
  const reportId = req.params.id;
  const { update_type, content, photo_url } = req.body;

  if (!update_type || !content) {
    return res.status(400).json({ error: 'Update type and content are required' });
  }

  const validUpdateTypes = ['photo', 'progress', 'medical'];
  if (!validUpdateTypes.includes(update_type)) {
    return res.status(400).json({ error: 'Invalid update type. Valid types are: photo, progress, medical.' });
  }

  try {
    const role = getUserRole(req);
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update reports.' });
    }

    const updateQry = `
      UPDATE child_updates
      SET update_type = $1, content = $2, photo_url = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [update_type, content, photo_url || null, reportId];
    const result = await con.query(updateQry, values);

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report updated successfully', report: result.rows[0] });
  } catch (err) {
    console.error('Update Report Error:', err.message);
    res.status(500).json({ error:  err.message});
  }
};

const deleteReport = async (req, res) => {
  const reportId = req.params.id;

  try {
    const role = getUserRole(req);
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete reports.' });
    }

    const deleteQry = `DELETE FROM child_updates WHERE id = $1 RETURNING *;`;
    const result = await con.query(deleteQry, [reportId]);

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    console.error('Delete Report Error:', err.message);
    res.status(500).json({ error:  err.message});
  }
};

const getReport = async (req, res) => {
    try {
      const orphanName = req.params.name; 
      const query = `
        SELECT cu.*
        FROM child_updates cu
        JOIN orphans o ON cu.orphan_id = o.id
        WHERE o.name = $1
        ORDER BY cu.created_at DESC;
      `;
      const result = await con.query(query, [orphanName]); 
      res.json(result.rows); 
    } catch (err) {
      console.error('Get Report Error:', err);
      res.status(500).json({ error:  err.message });
    }
  };


  const showAllReports = async (req, res) => {
    try {
      const query = `
        SELECT 
          cu.id, cu.update_type, cu.content, cu.photo_url, cu.created_at,
          o.name AS orphan_name, o.id AS orphan_id
        FROM child_updates cu
        JOIN orphans o ON cu.orphan_id = o.id
        ORDER BY cu.created_at DESC;
      `;
      
      const result = await con.query(query);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Show All Reports Error:', err.message);
      res.status(500).json({ error: 'Failed to retrieve reports' });
    }
  };

  module.exports = {
    addReport,
    updateReport,
    deleteReport,
    getReport,
    showAllReports,
  };