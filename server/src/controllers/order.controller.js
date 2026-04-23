const prisma = require("../lib/prisma");

const STOCK_CONFLICT_PREFIX = "STOCK_CONFLICT:";

const checkout = async (req, res) => {
  try {
    const userId = req.user.userId ?? req.user.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "El carrito esta vacio" });
    }

    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuficiente para ${item.product.name}. Disponible: ${item.product.stock}`
        });
      }
    }

    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          total
        }
      });

      await tx.orderItem.createMany({
        data: cartItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price
        }))
      });

      for (const item of cartItems) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity }
          },
          data: {
            stock: { decrement: item.quantity }
          }
        });

        if (updated.count === 0) {
          throw new Error(`${STOCK_CONFLICT_PREFIX}${item.product.name}`);
        }
      }

      await tx.cartItem.deleteMany({
        where: { userId }
      });

      return order;
    }, {
      // Remote DB may exceed default 5s interactive transaction timeout.
      maxWait: 10000,
      timeout: 30000
    });

    res.status(201).json({
      message: "Compra realizada exitosamente",
      order: result
    });
  } catch (error) {
    console.error("Error en checkout:", error);

    if (typeof error?.message === "string" && error.message.startsWith(STOCK_CONFLICT_PREFIX)) {
      return res.status(400).json({
        message: `Stock insuficiente para ${error.message.slice(STOCK_CONFLICT_PREFIX.length)}`
      });
    }

    if (error?.code === "P2028" || error?.code === "P1017") {
      return res.status(503).json({
        message: "La conexion con la base de datos esta lenta. Intenta de nuevo."
      });
    }

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
    console.error("Error al obtener ordenes:", error);
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
