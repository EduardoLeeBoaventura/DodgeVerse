const express = require('express');
const router = express.Router();
const playerController = require('./playerController');
// const checkAuth = require('../middleware/checkAuth');


router.post('/register', playerController.createPlayer);
router.post('/login', playerController.loginPlayer);

module.exports = router;