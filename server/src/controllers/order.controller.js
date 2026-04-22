const prisma = require("../lib/prisma");

const checkout = async (req, res) => {
  try {
    const userId = req.user.userId ?? req.user.id;

    // Obtener items del carrito
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    // Validar stock
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuficiente para ${item.product.name}. Disponible: ${item.product.stock}`
        });
      }
    }

    // Calcular total
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Crear orden en transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear orden
      const order = await tx.order.create({
        data: {
          userId,
          total
        }
      });

      // Crear orderItems y descontar stock
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }
        });

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // Vaciar carrito
      await tx.cartItem.deleteMany({
        where: { userId }
      });

      return order;
    });

    res.status(201).json({
      message: "Compra realizada exitosamente",
      order: result
    });

  } catch (error) {
    console.error("Error en checkout:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId ?? req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(orders);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const userId = req.user.userId ?? req.user.id;
    const orderId = Number(req.params.id);

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      },
      include: {
        orderItems: {
          include: { product: true }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error al obtener orden:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  checkout,
  getUserOrders,
  getOrderById
};
