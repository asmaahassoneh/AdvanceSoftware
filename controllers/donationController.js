
const db = require('../config/db');

exports.createDonation = async (req, res) => {
  try {
    const { type, amount, description, location } = req.body;
    const donorId = req.user.id;


    const validTypes = ["money", "clothes", "food", "education", "medical","other"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid donation type" });
    }


    if (type === "money" && (!amount || amount <= 0)) {
      return res.status(400).json({ message: "Invalid donation amount" });
    }

    const sanitizedDescription = description?.trim() || null;
    const sanitizedLocation = location?.trim() || null;


    const duplicateCheckQuery = `
      SELECT id FROM donations 
      WHERE donor_id = $1 AND type = $2 
      AND location = $3 AND created_at > NOW() - INTERVAL '1 MINUTE';
    `;
    const duplicateCheck = await db.query(duplicateCheckQuery, [donorId, type, location]);

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({ message: "Duplicate donation detected" });
    }


    const insertQuery = `
      INSERT INTO donations (donor_id, type, amount, description, location, created_at) 
      VALUES ($1, $2, $3, $4, $5, NOW()) 
      RETURNING *;
    `;
    const values = [donorId, type, amount || null, sanitizedDescription, sanitizedLocation];
    const result = await db.query(insertQuery, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(`Donation creation failed: ${error.message}`);
    res.status(500).json({ message: "Something went wrong, please try again later" });
  }
};


// exports.getUserDonations = async (req, res) => {
//   try {
//     const donorId = req.user.id;
//     const query = `
//       SELECT * FROM donations
//       WHERE donor_id = $1
//       ORDER BY created_at DESC;
//     `;
//     const result = await db.query(query, [donorId]);

//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error(`Fetching donations failed: ${error.message}`);
//     res.status(500).json({ message: "Failed to fetch donations" });
//   }
// };

exports.getUserDonations = async (req, res) => {
  try {
    const donorId = req.user.id;
    const { duration } = req.query; // Get duration from query params

    let dateFilter = ""; // Default: No filter (fetch all history)
    let values = [donorId];

    if (duration) {
      switch (duration.toLowerCase()) {
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
          return res.status(400).json({ message: "Invalid duration parameter. Use 'week', 'month', or 'year'." });
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
    const { description, location } = req.body;

    if (!description && !location) {
      return res.status(400).json({ message: "Only description and location can be updated" });
    }

    const checkQuery = `SELECT donor_id FROM donations WHERE id = $1;`;
    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (checkResult.rows[0].donor_id !== donorId) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own donations" });
    }

    const updateQuery = `
      UPDATE donations
      SET description = COALESCE($1, description), location = COALESCE($2, location)
      WHERE id = $3
      RETURNING *;
    `;

    const result = await db.query(updateQuery, [description, location, id]);

    res.status(200).json({ message: "Donation updated successfully", donation: result.rows[0] });
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