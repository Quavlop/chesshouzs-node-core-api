const express = require('express');
const router = express.Router();

const {verifyEmail, resendEmailVerification} = require('../../controller/MailController');
const isAuthenticated = require('../../middleware/auth/isAuthenticated');


router.get('/:token', verifyEmail);
router.post('/resend', isAuthenticated, resendEmailVerification);


module.exports = router;