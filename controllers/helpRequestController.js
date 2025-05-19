const con = require('../config/db');


const createHelpRequest = async (req, res) => {
    const { title, description, category, orphanage_id } = req.body;
    const { role } = req.user;

    try {
        if (role !== 'orphanage' && role !== 'admin') {
            return res.status(403).json({ error: 'Only orphanages or admins can post requests.' });
        }

        
        console.log('🛠 Creating help request with:', {
            orphanage_id,
            title,
            description,
            category,
            role
        });

        const insertQry = `
            INSERT INTO help_requests (orphanage_id, title, description, category)
            VALUES ($1, $2, $3, $4) RETURNING *`;

        const result = await con.query(insertQry, [orphanage_id, title, description, category]);

        console.log(' Help request inserted:', result.rows[0]);

        res.status(201).json({
            message: 'Help request created.',
            request: result.rows[0]
        });

    } catch (err) {
        console.error(' Create Help Request Error:', err);
        res.status(500).json({ error: err.detail || err.message || 'Unknown error' });
    }
};



const getAllHelpRequests = async (req, res) => {
    const { role } = req.user;

    try {
        if (role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can view all help requests.' });
        }

        const result = await con.query('SELECT * FROM help_requests ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error while retrieving help requests.' });
    }
};


const updateHelpRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const { role } = req.user;

    try {
        if (role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can update help request status.' });
        }

        const result = await con.query(
            `UPDATE help_requests SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Help request not found.' });
        }

        res.json({
            message: 'Status updated.',
            request: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error while updating help request.' });
    }
};


const getHelpRequestsByOrphanage = async (req, res) => {
    const { role, orphanage_id } = req.user;
    const requestedName = req.params.name;

    try {
       
        const orphanageRes = await con.query('SELECT id FROM orphanages WHERE name = $1', [requestedName]);
        if (orphanageRes.rows.length === 0) {
            return res.status(404).json({ error: 'Orphanage not found.' });
        }
        const requestedOrphanageId = orphanageRes.rows[0].id;

       
        if (role === 'orphanage' && orphanage_id !== requestedOrphanageId) {
            return res.status(403).json({ error: 'Access denied to other orphanage data.' });
        }

        const result = await con.query(
            'SELECT * FROM help_requests WHERE orphanage_id = $1 ORDER BY created_at DESC',
            [requestedOrphanageId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error while fetching help requests.' });
    }
};

module.exports = {
    createHelpRequest,
    getAllHelpRequests,
    updateHelpRequestStatus,
    getHelpRequestsByOrphanage
};
