const router = require('express').Router();
const emailController = require('../controllers/emailController');

router.post('/', emailController.send);
// router.post('/users', emailController.post);


module.exports = router;
