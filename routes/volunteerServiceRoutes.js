const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const volunteerServiceController = require('../controllers/volunteerServiceController');


router.post('/offer', verifyToken, async (req, res) => {
  try {
    const volunteerId = req.user.id;
    const { serviceType, description, available } = req.body;

    const newService = await volunteerServiceController.offerService(
      volunteerId, serviceType, description, available
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

router.get('/matching-help-requests', verifyToken, async (req, res) => {
  try {
    const volunteerId = req.user.id;

    const matches = await volunteerServiceController.getMatchingHelpRequests(volunteerId);

    res.status(200).json({
      message: 'Matching help requests fetched successfully',
      matches
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch matching help requests',
      error: err.message
    });
  }
});


module.exports = router;
