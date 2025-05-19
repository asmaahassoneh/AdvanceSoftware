const con = require('../config/db'); 

exports.matchVolunteers = async (req, res) => {
  try {
    console.log('Starting volunteer matching...');

    

   
    const { rows: helpRequests } = await con.query(`
      SELECT * FROM help_requests WHERE status = 'pending'
    `);

    let totalMatches = 0;

    for (const request of helpRequests) {
      const { id: helpRequestId, category } = request;

      
      const { rows: matchingVolunteers } = await con.query(`
        SELECT * FROM volunteer_services 
        WHERE category = $1 AND available = true
      `, [category]);

      for (const volunteer of matchingVolunteers) {
        const volunteerId = volunteer.volunteer_id;

        
        const { rowCount: exists } = await con.query(`
          SELECT 1 FROM volunteer_matches 
          WHERE volunteer_id = $1 AND help_request_id = $2
        `, [volunteerId, helpRequestId]);

        if (!exists) {
          await con.query(`
            INSERT INTO volunteer_matches (volunteer_id, help_request_id) 
            VALUES ($1, $2)
          `, [volunteerId, helpRequestId]);

          totalMatches++;
        }
      }
    }

    res.status(200).json({ message: `${totalMatches} matches created.` });

  } catch (error) {
    console.error('Volunteer matching error:', error.stack || error);
    res.status(500).json({ error: 'Server error during matching.' });
  }
};
