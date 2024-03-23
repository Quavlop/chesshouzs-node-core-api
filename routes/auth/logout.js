const express = require('express');
const router = express.Router();

const handleLogOut = require('../../controller/LogoutController');
const isAuthenticated = require('../../middleware/auth/isAuthenticated');

router.post('/', isAuthenticated, handleLogOut);

module.exports = router;