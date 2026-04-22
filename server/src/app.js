const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health.routes");
const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(
  cors({
    origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN
  })
);
app.use(express.json());
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("API del ecommerce funcionando");
});

app.use("/api", healthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
