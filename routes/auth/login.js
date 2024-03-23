const express = require('express');
const router = express.Router();
const redirectIfAuthenticated = require('../../middleware/auth/redirectIfAuthenticated');

const handleLogin = require('../../controller/LoginController');

router.get('/', redirectIfAuthenticated);
router.post('/', handleLogin);

module.exports = router;