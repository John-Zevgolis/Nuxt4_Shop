import { Order } from '@prisma/client';

export default defineEventHandler(async (event): Promise<Order> => {
  const { user } = await getUserSession(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You must be logged in to create an order.',
    });
  }

  return await prisma.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw createError({ statusCode: 400, message: 'Cart is empty' });
    }

    const hasDeletedProducts = cartItems.some((item) => item.product.isDeleted);

    if (hasDeletedProducts) {
      throw createError({
        statusCode: 400,
        message:
          'Some products in your cart are no longer available. Please update your cart.',
      });
    }

    const totalAmount = cartItems.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0);

    const finalTotal = Math.round(totalAmount * 100) / 100;

    const order = await tx.order.create({
      data: {
        userId: user.id,
        totalAmount: finalTotal,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    await tx.cartItem.deleteMany({
      where: { userId: user.id },
    });

    return order;
  });
});
