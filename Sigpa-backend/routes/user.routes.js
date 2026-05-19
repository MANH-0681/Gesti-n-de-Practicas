const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');

// Definimos la ruta POST para el login
router.post('/login', userController.login);

module.exports = router;