const express = require('express');
const router = express.Router();
const UniversitiesController = require('../controllers/universities.controller');

// ✔️ universidades
router.get('/', UniversitiesController.getUniversities);

// ✔️ facultades por universidad
router.get('/:universityId/faculties', UniversitiesController.getFacultiesByUniversity);

// ✔️ carreras por facultad
router.get('/faculties/:facultyId/careers', UniversitiesController.getCareersByFaculty);

module.exports = router;