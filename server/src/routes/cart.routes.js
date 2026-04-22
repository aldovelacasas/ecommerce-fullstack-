const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart
} = require("../controllers/cart.controller");

router.use(authMiddleware);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:id", updateCartItemQuantity);
router.delete("/:id", removeCartItem);
router.delete("/", clearCart);

module.exports = router;