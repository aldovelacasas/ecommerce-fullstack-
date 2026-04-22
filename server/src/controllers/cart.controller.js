const prisma = require("../lib/prisma");

const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true
      },
      orderBy: {
        id: "desc"
      }
    });

    for (const item of cartItems) {
      if (!item.product || item.product.stock <= 0) {
        await prisma.cartItem.delete({
          where: { id: item.id }
        });
      } else if (item.quantity > item.product.stock) {
        await prisma.cartItem.update({
          where: { id: item.id },
          data: { quantity: item.product.stock }
        });
      }
    }

    const refreshedCartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true
      },
      orderBy: {
        id: "desc"
      }
    });

    const formattedCart = refreshedCartItems
      .filter((item) => item.product)
      .map((item) => ({
        id: item.id,
        quantity: item.quantity,
        productId: item.productId,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        stock: item.product.stock,
        imageUrl: item.product.imageUrl
      }));

    res.json(formattedCart);
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId es obligatorio" });
    }

    const product = await prisma.product.findUnique({
      where: { id: Number(productId) }
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ message: "Producto sin stock disponible" });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: Number(productId)
        }
      }
    });

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        return res.status(400).json({
          message: "No puedes agregar más unidades, stock máximo alcanzado"
        });
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + 1
        },
        include: {
          product: true
        }
      });

      return res.json(updatedItem);
    }

    const newItem = await prisma.cartItem.create({
      data: {
        userId,
        productId: Number(productId),
        quantity: 1
      },
      include: {
        product: true
      }
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = Number(req.params.id);
    const { quantity } = req.body;

    if (quantity == null || quantity < 1) {
      return res.status(400).json({ message: "quantity debe ser mayor a 0" });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        userId
      },
      include: {
        product: true
      }
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item no encontrado" });
    }

    if (!cartItem.product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (quantity > cartItem.product.stock) {
      return res.status(400).json({
        message: `Solo hay ${cartItem.product.stock} unidades disponibles`
      });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: {
        quantity: Number(quantity)
      }
    });

    res.json(updatedItem);
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = Number(req.params.id);

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item no encontrado" });
    }

    await prisma.cartItem.delete({
      where: { id }
    });

    res.json({ message: "Item eliminado del carrito" });
  } catch (error) {
    console.error("Error al eliminar item:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    res.json({ message: "Carrito vaciado correctamente" });
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart
};