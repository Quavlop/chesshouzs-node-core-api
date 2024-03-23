const express = require('express');
const multer = require('multer');
const router = express.Router();
const isAuthenticated = require('../../middleware/auth/isAuthenticated');
const { paymentNotification } = require('../../controller/MidtransController');

// router.use(isAuthenticated);
router.post('/payment/notification', paymentNotification);


module.exports = router;