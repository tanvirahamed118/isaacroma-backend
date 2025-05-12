const express = require("express");
const {
  getAllUser,
  getOneUser,
  register,
  login,
  reset,
  updateUser,
  deleteUser,
  updatePassword,
} = require("../controller/user.controller");
const auth = require("../middleware/auth");
const profile = require("../middleware/profile");
const router = express.Router();

router.get("/", auth, getAllUser);
router.get("/:id", auth, getOneUser);
router.post("/register", register);
router.post("/login", login);
router.post("/reset", reset);
router.patch("/password/:id", auth, profile, updatePassword);
router.patch("/:id", auth, profile, updateUser);
router.delete("/:id", auth, deleteUser);

module.exports = router;
