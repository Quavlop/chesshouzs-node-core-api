const express = require('express');
const router = express.Router();

const createCSRF = require('../../controller/CsrfController');

router.get('/',  createCSRF);

module.exports = router;