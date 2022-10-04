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
  petNotOwn,
} = require("../controller/usersController");
const { login } = require("../controller/authController");

const router = express.Router();

router.get("/", getAllUser);
router.get("/:id", getUserById);
router.get("/getPet/:id", getPetByUser);
router.get("/notOwn/:id", petNotOwn);
router.post("/", createUser);
router.put("/:id", editUser);
router.delete("/:id", deleteUser);
router.put("/addPet/:id", addPet);
router.put("/deletePet/:id", deletePet);
router.post("/login", login);

module.exports = router;
