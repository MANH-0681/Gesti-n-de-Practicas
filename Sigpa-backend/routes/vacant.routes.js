const express = require('express');
const router = express.Router();
const vacantController = require('../controllers/vacants.controller');
const auth = require('../middlewares/auth');
const esAdministrador = require('../middlewares/esAdministrador');

// Rutas públicas/de estudiantes
router.get('/practicas', vacantController.getTodaslasOfertas);
router.get('/practicas/disponibles', vacantController.getPracticasDisponibles);
router.get('/practicas/:id', vacantController.getDetallePractica);
router.post('/practicas/:id/postular', vacantController.postularEstudiante);

// Rutas de administrador (CRUD completo)
router.get('/allVacants', auth, vacantController.getAllVacants);
router.post('/createVacant', auth, esAdministrador, vacantController.createVacant);
router.put('/updateVacant/:id', auth, esAdministrador, vacantController.updateVacant);
router.put('/deleteVacant/:id', auth, esAdministrador, vacantController.deleteVacant);

module.exports = router;