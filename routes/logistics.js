const express = require('express');
const router = express.Router();
const { getCoordinates, getRoute } = require('../services/mapquestService');

router.post('/pickup', async (req, res) => {
  try {
    const { address } = req.body;
    const coordinates = await getCoordinates(address);
    res.json({ message: 'Coordinates retrieved', coordinates });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to geocode address' });
  }
});

router.get('/route', async (req, res) => {
  try {
    const { from, to } = req.query;
    const routeInfo = await getRoute(from, to);
    res.json({ route: routeInfo });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get route' });
  }
});

module.exports = router;
