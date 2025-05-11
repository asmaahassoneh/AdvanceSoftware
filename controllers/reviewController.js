const con = require('../config/db');
const { getUserId, getUserRole } = require('../services/authService');
const { analyzeSentiment } = require('../services/sentimentService');


// POST /api/reviews
const leaveReview = async (req, res) => {
    try {
      // Get user info from the request
      const donor_id = getUserId(req);
      const role = getUserRole(req);
  
      // Check if the user is a donor
      if (role !== 'donor') {
        return res.status(403).json({ error: 'Only donors can leave reviews' });
      }
  
      const { orphanage_name, rating, comment } = req.body;
  
      // Validate orphanage name and rating
      if (!orphanage_name || !rating) {
        return res.status(400).json({ error: 'Orphanage name and rating are required' });
      }
  
      // Get orphanage_id from the orphanage name
      const orphanageRes = await con.query(
        `SELECT id FROM orphanages WHERE name = $1 LIMIT 1`,
        [orphanage_name]
      );
  
      // If orphanage is not found, return an error
      if (!orphanageRes.rows.length) {
        return res.status(404).json({ error: 'Orphanage not found' });
      }
  
      const orphanage_id = orphanageRes.rows[0].id;
  
      // Insert the review into the database
      const result = await con.query(
        `INSERT INTO reviews (user_id, orphanage_id, rating, comment)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [donor_id, orphanage_id, rating, comment || null]
      );
  
      // Move sentiment analysis here after review is inserted
      const sentimentResult = await analyzeSentiment(comment || '');
      console.log('Sentiment Result:', sentimentResult);
  
      // Respond with review data and sentiment analysis result
      return res.status(201).json({
        message: 'Review submitted successfully',
        review: result.rows[0],
        sentiment: sentimentResult || { label: 'unknown', confidence: 0 },  // Fallback for null sentiment
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error: ' + err.message });
    }
  };
  

// GET /api/reviews/orphanage/:id
const getReviewsForOrphanage = async (req, res) => {
  const orphanage_id = req.params.id;

  try {
    const result = await con.query(
      `SELECT r.rating, r.comment, r.created_at, u.name AS donor_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.orphanage_id = $1
       ORDER BY r.created_at DESC`,
      [orphanage_id]
    );

    res.status(200).json({ reviews: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
const getAverageRating = async (req, res) => {
    try {
      const { orphanage_name } = req.params;
  
      const orphanageRes = await con.query(
        `SELECT id FROM orphanages WHERE name = $1 LIMIT 1`,
        [orphanage_name]
      );
  
      if (!orphanageRes.rows.length) {
        return res.status(404).json({ error: err.message });
      }
  
      const orphanage_id = orphanageRes.rows[0].id;
  
      const ratingRes = await con.query(
        `SELECT AVG(rating)::NUMERIC(3,2) AS average_rating
         FROM reviews
         WHERE orphanage_id = $1`,
        [orphanage_id]
      );
  
      res.status(200).json({
        orphanage: orphanage_name,
        average_rating: ratingRes.rows[0].average_rating || 0,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  
module.exports = {
    leaveReview,getReviewsForOrphanage,getAverageRating,
};