const express = require('express');
const router = express.Router();
const {
  leaveReview,
  getReviewsForOrphanage,
  getAverageRating,
} = require('../controllers/reviewController');

router.post('/', leaveReview);
router.get('/orphanage/:id', getReviewsForOrphanage);
router.get('/average/:orphanage_name', getAverageRating);

module.exports = router;
