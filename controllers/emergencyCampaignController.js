const con = require('../config/db'); 
const nodemailer = require('nodemailer');
const { getUserId, getUserRole } = require('../services/authService');

const createCampaign = async (req, res) => {
  const { orphanage_name, title, description, target_amount } = req.body;

  try {
    const orphanageResult = await con.query(
      `SELECT id FROM orphanages WHERE name = $1 LIMIT 1`,
      [orphanage_name]
    );

    if (!orphanageResult.rows.length) {
      return res.status(404).json({ error: 'Orphanage not found' });
    }

    const orphanage_id = orphanageResult.rows[0].id;

    const result = await con.query(
      `INSERT INTO emergency_campaigns (orphanage_id, title, description, target_amount) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [orphanage_id, title, description, target_amount]
    );

    const campaign = result.rows[0];

    const donors = await con.query(
      `SELECT DISTINCT email FROM users WHERE role = 'donor'`
    );

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
      subject: `Urgent: ${campaign.title}`,
      text: `Emergency Campaign Alert!\n\n${campaign.description}\n\nPlease consider contributing today.`,
    };

    for (let donor of donors.rows) {
      await transporter.sendMail({ ...mailOptions, to: donor.email });
    }

    res.status(201).json({ campaign: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
};

const getAllCampaigns = async (req, res) => {
  try {
    const result = await con.query(`SELECT * FROM emergency_campaigns ORDER BY created_at DESC`);
    res.json({ campaigns: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
};

const contributeToCampaign = async (req, res) => {
  try {
    const user_id = getUserId(req);        
    const user_role = getUserRole(req);    

    if (user_role !== 'donor') {
      return res.status(403).json({ error: 'Only donors can contribute to campaigns' });
    }

    const { campaign_id, amount } = req.body;

    const donation = await con.query(
      `INSERT INTO donations (donor_id, type, amount, description) 
       VALUES ($1, 'money', $2, $3) RETURNING id`,
      [user_id, amount, `Emergency campaign contribution (ID: ${campaign_id})`]
    );

    await con.query(
      `UPDATE emergency_campaigns 
       SET collected_amount = collected_amount + $1 
       WHERE id = $2`,
      [amount, campaign_id]
    );

    await con.query(
      `INSERT INTO transactions (user_id, amount, transaction_type, status) 
       VALUES ($1, $2, 'donation', 'completed')`,
      [user_id, amount]
    );

    res.status(200).json({ message: 'Contribution successful', donation_id: donation.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createCampaign,
  getAllCampaigns,
  contributeToCampaign,
};