const db = require('../db');

exports.postRequest = async (req, res) => {
  const { orphanage_id, description, required_skills } = req.body;

  try {
    await db.query(
      'INSERT INTO volunteer_requests (orphanage_id, description, required_skills, status) VALUES ($1, $2, $3, $4)',
      [orphanage_id, description, required_skills, 'open']
    );

    res.status(201).json({ message: 'Request posted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to post request' });
  }
};

exports.getOpenRequests = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM volunteer_requests WHERE status = $1', ['open']);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch open requests' });
  }
};
