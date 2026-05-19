const express = require('express');
const router = express.Router();

const businessesController = require('../controllers/businesses.controller');
const auth = require('../middlewares/auth');
const esAdministrador = require('../middlewares/esAdministrador');

router.get('/businesses', auth, businessesController.getCompanies);

router.get('/allBusinesses', auth, businessesController.getAllCompanies);

router.post('/createBusinesses',auth,esAdministrador,businessesController.createCompany);

router.put('/updateBusiness/:id', auth, esAdministrador, businessesController.updateCompany);

router.put('/deleteBusiness/:id', auth, esAdministrador, businessesController.deleteCompany);

module.exports = router;