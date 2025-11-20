const express = require('express');
const router = express.Router();
const playerController = require('./playerController');

router.post('/register', playerController.createPlayer);
router.post('/login', playerController.loginPlayer);

module.exports = router;