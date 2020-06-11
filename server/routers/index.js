const router = require('express').Router();
const userRoutes = require('./user');
const emailRoutes = require('./email');
const { authentication } = require('../middlewares/auth');

router.use('/users', userRoutes);
router.use(authentication);
router.use('/emails', emailRoutes);

module.exports = router;
