const express = require('express');
const router = express.Router();

const modalitiesController = require('../controllers/modalities.controller');
const auth = require('../middlewares/auth');

router.get('/all', auth, modalitiesController.getAllModalities);

module.exports = router;
