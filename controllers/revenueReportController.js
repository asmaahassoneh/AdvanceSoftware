const con = require('../config/db');
const { getUserRole } = require('../middleware/auth');


const getRevenueReport = async (req, res) => {
    const { startDate, endDate, donor_id, partner_id, orphan_id } = req.query;

    try {
        const role = getUserRole(req);
        if (role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can access revenue reports.' });
        }

      
        let whereClauses = [];
        let values = [];
        let idx = 1;

        if (startDate) {
            whereClauses.push(`date >= $${idx++}`);
            values.push(startDate);
        }
        if (endDate) {
            whereClauses.push(`date <= $${idx++}`);
            values.push(endDate);
        }
        if (donor_id) {
            whereClauses.push(`donor_id = $${idx++}`);
            values.push(donor_id);
        }
        if (partner_id) {
            whereClauses.push(`partner_id = $${idx++}`);
            values.push(partner_id);
        }
        if (orphan_id) {
            whereClauses.push(`orphan_id = $${idx++}`);
            values.push(orphan_id);
        }

        const whereSQL = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

     
        const totalRevenueQuery = `SELECT COALESCE(SUM(amount), 0) AS total_revenue FROM transactions ${whereSQL}`;
        const totalRevenueResult = await con.query(totalRevenueQuery, values);

        const revenueByTypeQuery = `
            SELECT type, COALESCE(SUM(amount), 0) AS total
            FROM transactions
            ${whereSQL}
            GROUP BY type`;
        const revenueByTypeResult = await con.query(revenueByTypeQuery, values);

        res.json({
            totalRevenue: totalRevenueResult.rows[0].total_revenue,
            breakdownByType: revenueByTypeResult.rows
        });
    } catch (err) {
        console.error('Revenue Report Error:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getRevenueReport,
};
