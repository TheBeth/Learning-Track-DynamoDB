const express = require("express");
const {
  getAllPet,
  createPet,
  editPet,
  deletePet,
  getPetById,
} = require("../controller/petsController");
const { validateAuth } = require("../middlewares/authenticate");

const router = express.Router();

router.get("/", validateAuth, getAllPet);
router.get("/:petId", validateAuth, getPetById);
router.post("/", validateAuth, createPet);
router.put("/:petId", validateAuth, editPet);
router.delete("/:petId", validateAuth, deletePet);

module.exports = router;
