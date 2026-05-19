const express = require('express');
const router = express.Router();
const evaluationsController = require('../controllers/evaluations.controller');
const auth = require('../middlewares/auth');

router.get('/practice/:practicaId', auth, evaluationsController.getEvaluationsByPractice);
router.post('/', auth, evaluationsController.createEvaluation);
router.put('/:id', auth, evaluationsController.updateEvaluation);
router.delete('/:id', auth, evaluationsController.deleteEvaluation);

module.exports = router;