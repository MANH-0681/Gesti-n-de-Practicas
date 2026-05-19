const express = require('express');
const router = express.Router();
const practicesController = require('../controllers/practices.controller');
const auth = require('../middlewares/auth');
const esAdministrador = require('../middlewares/esAdministrador');

// Rutas existentes
router.post('/createPractices', auth, esAdministrador, practicesController.createPractice);
router.get('/practicesByUniversity', auth, practicesController.getPracticesByUniversity);

// Rutas de administrador (CRUD completo)
router.get('/allPractices', auth, practicesController.getAllPractices);
router.put('/updatePractice/:id', auth, esAdministrador, practicesController.updatePractice);
router.put('/deletePractice/:id', auth, esAdministrador, practicesController.deletePractice);

module.exports = router;