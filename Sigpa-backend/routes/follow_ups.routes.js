const express = require("express");
const router = express.Router();

const seguimientoController = require("../controllers/follow_ups.controller");
const auth = require("../middlewares/auth");

router.post("/", seguimientoController.createSeguimiento);

router.get("/reportes", seguimientoController.getReportes);
router.get("/evaluations/:practicaId", auth, seguimientoController.getEvaluaciones);
router.get(
  "/reportes-estudiante",
  auth,
  seguimientoController.getDashboardEstudiante
);

router.get(
  "/seguimientos/:practicaId",
  auth,
  seguimientoController.getSeguimientosByPracticaIniEstudiante
);

// ESTA SIEMPRE DEBE IR AL FINAL
router.get("/:practicaId", seguimientoController.getSeguimientosPorPractica);

router.put("/:id", seguimientoController.updateSeguimiento);

router.delete("/:id", seguimientoController.deleteSeguimiento);

module.exports = router;