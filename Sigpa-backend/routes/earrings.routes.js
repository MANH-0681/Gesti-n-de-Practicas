const express = require("express");

const router = express.Router();

const earringsController = require("../controllers/earrings.controller");

const auth = require("../middlewares/auth");

router.get("/", auth, earringsController.getEarrings);

router.post("/", auth, earringsController.createEarring);

router.delete("/:id", auth, earringsController.deleteEarring);

module.exports = router;