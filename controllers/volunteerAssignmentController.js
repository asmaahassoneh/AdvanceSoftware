const db = require('../db');

exports.assignVolunteer = async (req, res) => {
  const { volunteer_id, request_id } = req.body;

  try {
    await db.query(
      'INSERT INTO volunteer_assignments (volunteer_id, request_id) VALUES ($1, $2)',
      [volunteer_id, request_id]
    );

    await db.query(
      'UPDATE volunteer_requests SET status = $1 WHERE id = $2',
      ['matched', request_id]
    );

    res.status(201).json({ message: 'Volunteer assigned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to assign volunteer' });
  }
};

exports.getVolunteerAssignments = async (req, res) => {
  const volunteerId = req.params.id;

  try {
    const result = await db.query(
      `SELECT va.id, vr.description, vr.required_skills
       FROM volunteer_assignments va
       JOIN volunteer_requests vr ON va.request_id = vr.id
       WHERE va.volunteer_id = $1`,
      [volunteerId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};
