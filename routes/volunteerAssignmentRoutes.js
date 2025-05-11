const express = require('express');
const router = express.Router();
const volunteerAssignmentController = require('../controllers/volunteerAssignmentController');

router.post('/', volunteerAssignmentController.assignVolunteer);
router.get('/:id/assignments', volunteerAssignmentController.getVolunteerAssignments);

module.exports = router;
