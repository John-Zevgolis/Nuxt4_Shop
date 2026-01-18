import { orders, cartItems, products, orderItems } from '~~/db/schema';
import { and, eq, InferSelectModel } from 'drizzle-orm';

export default defineEventHandler(
  async (event): Promise<{ message: string }> => {
    const { user } = await getUserSession(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You must be logged in to create an order.',
      });
    }

    return await db.transaction(async (tx) => {
      const userCart = await tx
        .select({
          id: cartItems.id,
          productId: cartItems.productId,
          quantity: cartItems.quantity,
          product: products,
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.userId, user.id));

      if (userCart.length === 0) {
        throw createError({ statusCode: 400, message: 'Cart is empty' });
      }

      const hasDeletedProducts = userCart.some(
        (item) => item.product.isDeleted,
      );

      if (hasDeletedProducts) {
        throw createError({
          statusCode: 400,
          message:
            'Some products in your cart are no longer available. Please update your cart.',
        });
      }

      const totalAmount = userCart.reduce((acc, item) => {
        return acc + item.quantity * Number(item.product.price);
      }, 0);

      const finalTotal = Math.round(totalAmount * 100) / 100;

      const [order] = await tx.insert(orders).values({
        userId: user.id,
        totalAmount: finalTotal.toString(),
      });

      const orderId = order.insertId;

      await tx.insert(orderItems).values(
        userCart.map((item) => ({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      );

      await tx.delete(cartItems).where(eq(cartItems.userId, user.id));

      return { message: 'Order created successfully!' };
    });
  },
);
