const express = require('express');

const router = express.Router();

const nationController = require('../controllers/nation.controller');

router.post('/nations', nationController.createNation);

module.exports = router;
