const express = require("express");
const {
  getAllUser,
  getUserById,
  createUser,
  editUser,
  deleteUser,
  addPet,
  deletePet,
  getPetByUser,
} = require("../controller/usersController");

const router = express.Router();

router.get("/", getAllUser);
router.get("/:id", getUserById);
router.get("/getPet/:id", getPetByUser);
router.post("/", createUser);
router.put("/:id", editUser);
router.delete("/:id", deleteUser);
router.put("/addPet/:id", addPet);
router.put("/deletePet/:id", deletePet);

module.exports = router;
