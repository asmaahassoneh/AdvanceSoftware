const { Router } = require('express');
const router = Router();

router.use('/auth',    require('./authRoutes'));
router.use('/orphans', require('./orphanRoutes'));
router.use('/reports', require('./reportRoutes'));
router.use('/orphanage', require('./orphanagesRoutes'));
router.use('/donations', require('./donationRoutes'));
router.use('/logistics', require('./logistics'));
router.use('/sponsor', require('./sponsorOrphanRoutes'));
router.use('/emergency', require('./emergencyCampaignsRoutes'));
router.use('/donor', require('./donorsRoutes'));
router.use('/review', require('./reviewRoutes'));
router.use('/partner', require('./partnerRoutes'));
router.use('/transaction', require('./transactionRoutes'));
router.use('/revenue', require('./revenueRoutes'));


router.use('/donor', require('./donorRoutes'));
router.use('/account', require('./accountRoutes'));

module.exports = router;
