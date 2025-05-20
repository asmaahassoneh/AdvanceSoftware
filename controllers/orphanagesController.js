const { getUserRole } = require('../middleware/auth');
const con = require('../config/db');


const addOrphanage = async (req, res) => {
    const { name, location, contact_email, phone } = req.body;

    try {
        const role = getUserRole(req);
        if (role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can add orphanages.' });
        }

        const insertQry = `INSERT INTO orphanages (name, location, contact_email, phone) VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [name, location, contact_email, phone];
        const result = await con.query(insertQry, values);

        res.status(201).json({ message: 'Orphanage added successfully', orphanage: result.rows[0] });
    } catch (err) {
        console.error('Add Orphanage Error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

const updateOrphanage = async (req, res) => {
    const orphanageName = req.params.name;
    const { location, contact_email, phone } = req.body;

    try {
        const role = getUserRole(req);
        if (role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can update orphanages.' });
        }

        const updateQry = `
            UPDATE orphanages 
            SET location = $1, contact_email = $2, phone = $3 
            WHERE name = $4 RETURNING *`;
        const values = [location, contact_email, phone, orphanageName];

        const result = await con.query(updateQry, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Orphanage not found' });
        }

        res.json({ message: 'Orphanage updated successfully', orphanage: result.rows[0] });
    } catch (err) {
        console.error('Update Orphanage Error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

const deleteOrphanage = async (req, res) => {
    const orphanageName = req.params.name;

    try {
        const role = getUserRole(req);
        if (role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can delete orphanages.' });
        }

        const deleteQry = `DELETE FROM orphanages WHERE name = $1 RETURNING *`;
        const result = await con.query(deleteQry, [orphanageName]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Orphanage not found' });
        }

        res.json({ message: 'Orphanage deleted successfully' });
    } catch (err) {
        console.error('Delete Orphanage Error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

const verifyOrhanage = async (req, res) => {
    const orphanageName = req.params.name;

    try {
        const role = getUserRole(req);
        if (role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can verify orphanages.' });
        }

        const verifyQry = `UPDATE orphanages SET verified = true WHERE name = $1 RETURNING *`;
        const result = await con.query(verifyQry, [orphanageName]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Orphanage not found' });
        }

        res.json({ message: 'Orphanage verified successfully', orphanage: result.rows[0] });
    } catch (err) {
        console.error('Verify Orphanage Error:', err.message);
        res.status(500).json({ error: err.message});
    }
};


module.exports = {
    addOrphanage,
    updateOrphanage,
    deleteOrphanage,
    verifyOrhanage,
};
