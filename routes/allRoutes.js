const { Router } = require('express');
const router = Router();

router.use('/auth',    require('./authRoutes'));
router.use('/orphans', require('./orphanRoutes'));
router.use('/reports', require('./reportRoutes'));
router.use('/orphanage', require('./orphanagesRoutes'));
router.use('/sponsor', require('./sponsorOrphanRoutes'));
router.use('/emergency', require('./emergencyCampaignsRoutes'));
router.use('/donor', require('./donorRoutes'));
router.use('/account', require('./accountRoutes'));

router.use('/volunteer', require('./volunteerServiceRoutes')); 
module.exports = router;
