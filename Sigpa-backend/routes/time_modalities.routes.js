const express = require('express');
const router = express.Router();

const timeModalitiesController = require('../controllers/time_modalities.controller');
const auth = require('../middlewares/auth');

router.get('/all', auth, timeModalitiesController.getAllTimeModalities);

module.exports = router;
