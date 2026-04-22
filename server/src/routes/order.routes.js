const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  checkout,
  getUserOrders,
  getOrderById
} = require("../controllers/order.controller");

router.use(authMiddleware);

router.post("/checkout", checkout);
router.get("/", getUserOrders);
router.get("/:id", getOrderById);

module.exports = router;