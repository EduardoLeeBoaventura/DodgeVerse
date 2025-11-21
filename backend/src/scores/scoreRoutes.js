const express = require('express');
const router = express.Router();
const scoreController = require('./scoreController');
const checkAuth = require('../middleware/checkAuth');

router.use(checkAuth);

router.post('/', scoreController.createScore);
router.get('/me', scoreController.verifyScore);
router.put('/me', scoreController.updateScore);
router.get('/top', scoreController.showTopScores);

module.exports = router;