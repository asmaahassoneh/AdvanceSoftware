const { Router } = require('express');
const router = Router();

router.use('/auth',    require('./auth'));
router.use('/orphans', require('./orphanRoutes'));
router.use('/orphans', require('./adminRoutes'));

module.exports = router;
