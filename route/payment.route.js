const express = require("express");
const {
  createMembershipPayment,
  membershipWebhook,
} = require("../controller/payment.controller");
const auth = require("../middleware/auth");
const router = express.Router();

// router.get("/", auth, getAllUser);
// router.get("/:id", auth, getOneUser);
router.post("/create/:id", auth, createMembershipPayment);
router.post(
  "/membership",
  express.raw({ type: "application/json" }),
  membershipWebhook
);
// router.post("/login", login);
// router.post("/reset", reset);
// router.patch("/:id", auth, profile, updateUser);
// router.delete("/:id", auth, deleteUser);

module.exports = router;
