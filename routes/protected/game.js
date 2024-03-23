const express = require('express');
const router = express.Router();
const isAuthenticated = require('../../middleware/auth/isAuthenticated');
const { handleMatchmaking, cancelMatchmaking, checkExistingGame } = require('../../controller/GameController');

router.use(isAuthenticated);

router.get('/online/find-existing-game', checkExistingGame);
router.post('/online/search', handleMatchmaking);
router.delete('/online/matchmaking/cancel', cancelMatchmaking);

module.exports = router;