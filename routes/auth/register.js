const express = require('express');
const router = express.Router();
const redirectIfAuthenticated = require('../../middleware/auth/redirectIfAuthenticated');

const handleRegister  = require('../../controller/RegisterController');

router.get('/', redirectIfAuthenticated)
router.post('/', handleRegister);

module.exports = router;