const express = require("express");
const {
  getAllPet,
  createPet,
  editPet,
  deletePet,
  getPetById,
} = require("../controller/petsController");

const router = express.Router();

router.get("/", getAllPet);
router.get("/:petId", getPetById);
router.post("/", createPet);
router.put("/:petId", editPet);
router.delete("/:petId", deletePet);

module.exports = router;
