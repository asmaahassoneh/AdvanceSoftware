const { Router } = require('express');
const router = Router();

router.use('/auth',    require('./authRoutes'));
router.use('/orphans', require('./orphanRoutes'));
router.use('/reports', require('./reportRoutes'));
router.use('/orphanage', require('./orphanagesRoutes'));
router.use('/sponsor', require('./sponsorOrphanRoutes'));
router.use('/emergency', require('./emergencyCampaignsRoutes'));
router.use('/donor', require('./donorsRoutes'));
router.use('/review', require('./reviewRoutes'));
router.use('/partner', require('./partnerRoutes'));
router.use('/transaction', require('./transactionRoutes'));
router.use('/revenue', require('./revenueRoutes'));



module.exports = router;
