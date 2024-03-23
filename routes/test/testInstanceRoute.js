const express = require('express');
const router = express.Router();
const { testNest } = require('../../controller/TESTController');

router.get('/test-redis', testNest);

module.exports = router;