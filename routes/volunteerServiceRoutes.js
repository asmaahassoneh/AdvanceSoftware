const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const volunteerServiceController = require('../controllers/volunteerServiceController');

// Route to offer a new service (volunteer must be authenticated)
router.post('/offer', verifyToken, async (req, res) => {
  try {
    const volunteerId = req.user.id;

    // ✅ CHANGED: serviceType → category
    const { category, description, available } = req.body;

    const newService = await volunteerServiceController.offerService(
      volunteerId, category, description, available
    );

    res.status(201).json({
      message: 'Service offered successfully',
      service: newService
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to offer service',
      error: err.message
    });
  }
});

// Route to get all services offered by the logged-in volunteer
router.get('/my-services', verifyToken, async (req, res) => {
  try {
    const volunteerId = req.user.id;

    const services = await volunteerServiceController.getAllServices(volunteerId);
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch services',
      error: err.message
    });
  }
});


// Add the route
router.get('/matches', volunteerServiceController.getMatchingHelpRequests);

module.exports = router;
