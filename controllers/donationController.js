
const db = require('../config/db');
const { getCoordinates} = require('../services/mapquestService');

exports.createDonation = async (req, res) => {
  try {
    const { type, amount, description, location, latitude, longitude } = req.body;
    const donorId = req.user.id;

    const validTypes = ["money", "clothes", "food", "education", "medical", "other"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid donation type" });
    }

    if (type === "money" && (!amount || amount <= 0)) {
      return res.status(400).json({ message: "Invalid donation amount" });
    }

    const sanitizedDescription = description?.trim() || null;
    const sanitizedLocation = location?.trim() || null;

    let finalLatitude = latitude ?? null;
    let finalLongitude = longitude ?? null;

    if ((!finalLatitude || !finalLongitude) && sanitizedLocation) {
      try {
        const coords = await getCoordinates(sanitizedLocation);
        finalLatitude = coords.lat;
        finalLongitude = coords.lng;
      } catch (err) {
        console.error('Failed to fetch coordinates:', err.message);
        return res.status(500).json({ message: 'Failed to get coordinates for location' });
      }
    }

    const duplicateCheckQuery = `
      SELECT id FROM donations 
      WHERE donor_id = $1 AND type = $2 
      AND location = $3 AND created_at > NOW() - INTERVAL '1 MINUTE';
    `;
    const duplicateCheck = await db.query(duplicateCheckQuery, [donorId, type, sanitizedLocation]);

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({ message: "Duplicate donation detected" });
    }

    const insertQuery = `
      INSERT INTO donations (donor_id, type, amount, description, location, latitude, longitude, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
      RETURNING *;
    `;
    const values = [
      donorId,
      type,
      amount || null,
      sanitizedDescription,
      sanitizedLocation,
      finalLatitude,
      finalLongitude
    ];

    const result = await db.query(insertQuery, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(`Donation creation failed: ${error.message}`);
    res.status(500).json({ message: "Something went wrong, please try again later" });
  }
};

exports.getUserDonations = async (req, res) => {
  try {
    const donorId = req.user.id;
    const { duration } = req.query;

    let dateFilter = ""; 
    let values = [donorId];

    if (duration) {
      switch (duration.toLowerCase()) {
        case "today":
          dateFilter = "AND DATE(created_at) = CURRENT_DATE";
          break;
        case "week":
          dateFilter = "AND created_at >= NOW() - INTERVAL '7 DAYS'";
          break;
        case "month":
          dateFilter = "AND created_at >= NOW() - INTERVAL '1 MONTH'";
          break;
        case "year":
          dateFilter = "AND created_at >= NOW() - INTERVAL '1 YEAR'";
          break;
        default:
          return res.status(400).json({ message: "Invalid duration parameter. Use 'today', 'week', 'month', or 'year'." });
      }
    }

    const query = `
      SELECT * FROM donations
      WHERE donor_id = $1
      ${dateFilter}
      ORDER BY created_at DESC;
    `;

    const result = await db.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(`Fetching donations failed: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};


exports.getDonationById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM donations WHERE id = $1;`;
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching donation: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch donation" });
  }
};


exports.updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donorId = req.user.id;
    let { description, location, latitude, longitude } = req.body;

    if (
      description === undefined &&
      location === undefined &&
      latitude === undefined &&
      longitude === undefined
    ) {
      return res.status(400).json({
        message: "At least one of description, location, latitude, or longitude must be provided"
      });
    }

    const checkQuery = `SELECT donor_id FROM donations WHERE id = $1;`;
    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (checkResult.rows[0].donor_id !== donorId) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own donations" });
    }

    if ((latitude === undefined || longitude === undefined) && location) {
      try {
        const coords = await getCoordinates(location);
        latitude = coords.lat;
        longitude = coords.lng;
      } catch (err) {
        console.error('Failed to fetch coordinates:', err.message);
        return res.status(500).json({ message: 'Failed to get coordinates for updated location' });
      }
    }

    const updateQuery = `
      UPDATE donations
      SET
        description = COALESCE($1, description),
        location = COALESCE($2, location),
        latitude = COALESCE($3, latitude),
        longitude = COALESCE($4, longitude)
      WHERE id = $5
      RETURNING *;
    `;

    const result = await db.query(updateQuery, [description, location, latitude, longitude, id]);

    res.status(200).json({
      message: "Donation updated successfully",
      donation: result.rows[0]
    });
  } catch (error) {
    console.error(`Error updating donation: ${error.message}`);
    res.status(500).json({ message: "Failed to update donation" });
  }
};

exports.deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donorId = req.user.id;

    const checkQuery = `SELECT donor_id FROM donations WHERE id = $1;`;
    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (checkResult.rows[0].donor_id !== donorId) {
      return res.status(403).json({ message: "Unauthorized: You can only delete your own donations" });
    }

    const deleteQuery = `DELETE FROM donations WHERE id = $1 RETURNING *;`;
    const result = await db.query(deleteQuery, [id]);

    res.status(200).json({ message: "Donation deleted successfully", donation: result.rows[0] });
  } catch (error) {
    console.error(`Error deleting donation: ${error.message}`);
    res.status(500).json({ message: "Failed to delete donation" });
  }
};