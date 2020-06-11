const router = require('express').Router();
const emailController = require('../controllers/emailController');

router.post('/', emailController.post);

module.exports = router;
