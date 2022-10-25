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
const { validateAuth } = require("../middlewares/authenticate");

const router = express.Router();

router.get("/", validateAuth, getAllUser);
router.get("/:id", validateAuth, getUserById);
router.get("/getPet/:id", validateAuth, getPetByUser);
router.get("/notOwn/:id", validateAuth, petNotOwn);
router.post("/", validateAuth, createUser);
router.put("/:id", validateAuth, editUser);
router.delete("/:id", validateAuth, deleteUser);
router.put("/addPet/:id", validateAuth, addPet);
router.put("/deletePet/:id", validateAuth, deletePet);
router.post("/login", login);

module.exports = router;
