const prisma = require("../lib/prisma");

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: "desc"
      }
    });

    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl } = req.body;

    if (!name || !description || price == null || stock == null) {
      return res.status(400).json({
        message: "name, description, price y stock son obligatorios"
      });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        imageUrl
      }
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, stock, imageUrl } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price != null ? Number(price) : undefined,
        stock: stock != null ? Number(stock) : undefined,
        imageUrl
      }
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id }
    });

    if (orderItemsCount > 0) {
      return res.status(409).json({
        message: "No se puede eliminar un producto con historial de compras"
      });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);

    if (error?.code === "P2003") {
      return res.status(409).json({
        message: "No se puede eliminar un producto relacionado con otras entidades"
      });
    }

    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
