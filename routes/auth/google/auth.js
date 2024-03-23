const express = require('express');
const router = express.Router();

const {getCallbackUrl, exchangeToken} = require('../../../controller/auth/GoogleAuthController');
const redirectIfRequestAuthenticated = require('../../../middleware/auth/redirectIfRequestAuthenticated');

router.get('/', getCallbackUrl);
router.post('/exchange_auth_token', redirectIfRequestAuthenticated, exchangeToken);

module.exports = router;