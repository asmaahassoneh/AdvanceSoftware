const { Router } = require('express');
const router = Router();

router.use('/auth',    require('./auth'));
router.use('/orphans', require('./orphanRoutes'));

module.exports = router;
