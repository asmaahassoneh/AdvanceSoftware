const con = require('../config/db');
const { getUserRole } = require('../services/authService');

// Create a new transaction
const createTransaction = async (req, res) => {
    const { amount, donor_id, orphan_id, partner_id, type, description, date } = req.body;

    try {
        const role = getUserRole(req);

        if (role !== 'admin' && role !== 'donor') {
            return res.status(403).json({ error: 'Unauthorized to add a transaction.' });
        }

        const insertQry = `
            INSERT INTO transactions (amount, donor_id, orphan_id, partner_id, type, description, date)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;

        const result = await con.query(insertQry, [amount, donor_id, orphan_id, partner_id, type, description, date]);

        res.status(201).json({ message: 'Transaction created successfully', transaction: result.rows[0] });
    } catch (err) {
        console.error('Create Transaction Error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get all transactions
const getAllTransactions = async (req, res) => {
    try {
        const result = await con.query('SELECT * FROM transactions');
        res.json(result.rows);
    } catch (err) {
        console.error('Get All Transactions Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get transaction by ID
const getTransactionById = async (req, res) => {
    try {
        const result = await con.query('SELECT * FROM transactions WHERE id = $1', [req.params.id]);

        if (!result.rows[0]) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Get Transaction Error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Update a transaction
const updateTransaction = async (req, res) => {
    const { amount, donor_id, orphan_id, partner_id, type, description, date } = req.body;

    try {
        const role = getUserRole(req);

        if (role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can update a transaction.' });
        }

        const updateQry = `
            UPDATE transactions
            SET amount = $1, donor_id = $2, orphan_id = $3, partner_id = $4, type = $5, description = $6, date = $7
            WHERE id = $8 RETURNING *;`;

        const result = await con.query(updateQry, [
            amount, donor_id, orphan_id, partner_id, type, description, date, req.params.id
        ]);

        if (!result.rows[0]) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({ message: 'Transaction updated successfully', transaction: result.rows[0] });
    } catch (err) {
        console.error('Update Transaction Error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
    try {
        const role = getUserRole(req);

        if (role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can delete a transaction.' });
        }

        const deleteQry = 'DELETE FROM transactions WHERE id = $1 RETURNING *;';
        const result = await con.query(deleteQry, [req.params.id]);

        if (!result.rows[0]) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        console.error('Delete Transaction Error:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
};
