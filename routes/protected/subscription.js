const express = require('express');
const multer = require('multer');
const router = express.Router();
const isAuthenticated = require('../../middleware/auth/isAuthenticated');
const redirectIfPremium = require('../../middleware/premium/redirectIfPremium');
const { handleCheckout } = require('../../controller/SubscriptionController');


router.use(isAuthenticated);

router.post('/checkout', redirectIfPremium, handleCheckout);
// router.post('/payment/finish', paymentFinishCallback);

module.exports = router;