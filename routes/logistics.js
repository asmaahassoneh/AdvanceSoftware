const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../services/authMiddlewear'); 
const { getCoordinates, getDirections } = require('../services/mapquestService');

const getMapQuestLink = (latitude, longitude) => {
  return `https://www.mapquest.com/search/results?query=${latitude},${longitude}`;
};


router.get('/location/:id', authMiddleware, async (req, res) => {
  const donationId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const result = await db.query(
      'SELECT donor_id, latitude, longitude FROM donations WHERE id = $1',
      [donationId]
    );

    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    const { donor_id, latitude, longitude } = rows[0];

    if (donor_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized: Access denied' });
    }
    const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    res.json({ donationId, latitude, longitude, mapLink });
  } catch (error) {
    console.error('Error in /location/:id:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});



router.get('/:id', async (req, res) => {
  const orphanageId = req.params.id;
  const fromLocation = req.query.from;

  if (!fromLocation) {
    return res.status(400).json({ error: 'Missing "from" query parameter (user location).' });
  }

  try {
    const route = await getDirections(fromLocation, orphanageId, db);
    res.json(route);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
