const pool = require('../db'); // PostgreSQL connection pool
const nodemailer = require('nodemailer');

// Create a new emergency campaign
exports.createCampaign = async (req, res) => {
  const { orphanage_id, title, description, target_amount } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO emergency_campaigns (orphanage_id, title, description, target_amount) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [orphanage_id, title, description, target_amount]
    );
    res.status(201).json({ campaign: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
};

// Get all active campaigns
exports.getAllCampaigns = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM emergency_campaigns ORDER BY created_at DESC`);
    res.json({ campaigns: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
};

// Contribute to a campaign
exports.contributeToCampaign = async (req, res) => {
  const { user_id, campaign_id, amount } = req.body;

  try {
    // Insert donation record
    const donation = await pool.query(
      `INSERT INTO donations (donor_id, type, amount, description) 
       VALUES ($1, 'money', $2, $3) RETURNING id`,
      [user_id, amount, `Emergency campaign contribution (ID: ${campaign_id})`]
    );

    // Update campaign collected amount
    await pool.query(
      `UPDATE emergency_campaigns 
       SET collected_amount = collected_amount + $1 
       WHERE id = $2`,
      [amount, campaign_id]
    );

    // Record in transactions
    await pool.query(
      `INSERT INTO transactions (user_id, amount, transaction_type, status) 
       VALUES ($1, $2, 'donation', 'completed')`,
      [user_id, amount]
    );

    res.status(200).json({ message: 'Contribution successful', donation_id: donation.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Contribution failed' });
  }
};

// Notify all donors about an emergency campaign
exports.notifyDonors = async (req, res) => {
  const { campaign_id } = req.body;

  try {
    const campaign = await pool.query(`SELECT * FROM emergency_campaigns WHERE id = $1`, [campaign_id]);
    if (campaign.rows.length === 0) return res.status(404).json({ error: 'Campaign not found' });

    const donors = await pool.query(`SELECT DISTINCT email FROM users WHERE role = 'donor' AND verified = true`);

    // Set up email transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      subject: `Urgent: ${campaign.rows[0].title}`,
      text: `Emergency Campaign Alert!\n\n${campaign.rows[0].description}\n\nPlease consider contributing today.`,
    };

    // Send to all donors
    for (let donor of donors.rows) {
      await transporter.sendMail({ ...mailOptions, to: donor.email });
    }

    res.json({ message: 'Notifications sent to donors.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
};
