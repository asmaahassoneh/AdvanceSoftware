
const con = require('../config/db');


const offerService = async (volunteerId, serviceType, description, available) => {
  const query = `
    INSERT INTO volunteer_services (volunteer_id, category, description, available)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  try {
    
    const result = await con.query(query, [volunteerId, serviceType, description, available]);

   
    return result.rows[0];
  } catch (err) {
  console.error('Error inserting service:', err); 
  throw err; 
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


const getMatchingHelpRequests = async (volunteerId) => {
  try {
    const serviceTypesResult = await con.query(
      'SELECT DISTINCT category FROM volunteer_services WHERE volunteer_id = $1 AND available = true',
      [volunteerId]
    );
    const serviceTypes = serviceTypesResult.rows.map(row => row.category);

    if (serviceTypes.length === 0) return [];

    const placeholders = serviceTypes.map((_, i) => `$${i + 1}`).join(',');
    const helpRequestsResult = await con.query(
      `SELECT * FROM help_requests WHERE category IN (${placeholders})`,
      serviceTypes
    );

    return helpRequestsResult.rows;
  } catch (err) {
    console.error('Error fetching matching help requests:', err);
    throw err;
  }
};

module.exports = {
  offerService,
  getAllServices,
  getMatchingHelpRequests
};

