const { Router } = require('express');
const router = Router();

router.use('/auth',    require('./authRoutes'));
router.use('/orphans', require('./orphanRoutes'));
router.use('/reports', require('./reportRoutes'));
router.use('/orphanage', require('./orphanagesRoutes'));

module.exports = router;
