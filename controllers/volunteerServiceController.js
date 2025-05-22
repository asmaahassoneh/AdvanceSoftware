const con = require('../config/db');

const offerService = async (volunteerId, category, description, available) => {
  const query = `
    INSERT INTO volunteer_services (volunteer_id, category, description, available)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  try {
    const result = await con.query(query, [volunteerId, category, description, available]);
    return result.rows[0];
  } catch (err) {
    console.error('Error inserting service:', err);
    throw new Error('Failed to offer service');
  }
};


const getAllServices = async (volunteerId) => {
  const query = 'SELECT * FROM volunteer_services WHERE volunteer_id = $1;';
  try {
    const result = await con.query(query, [volunteerId]);
    return result.rows;
  } catch (err) {
    console.error('Error fetching services:', err);
    throw new Error('Failed to fetch services');
  }
};



const getMatchingHelpRequests = async (req, res) => {
  try {
    const { rows } = await con.query(`
      SELECT 
        vs.volunteer_id,
        hr.id AS help_request_id,
        hr.title,
        hr.description,
        hr.category
      FROM help_requests hr
      JOIN volunteer_services vs 
        ON LOWER(TRIM(hr.category)) = LOWER(TRIM(vs.category))
      WHERE hr.status = 'pending' AND vs.available = true
    `);

    res.status(200).json({
      message: `${rows.length} match(es) found.`,
      matches: rows
    });

  } catch (error) {
    console.error('Error in getMatchingHelpRequests:', error.stack || error);
    res.status(500).json({ error: 'Server error while fetching matches.' });
  }
};


module.exports = {
  offerService,
  getAllServices,
  getMatchingHelpRequests 
};

