import { products, cartItems } from '~~/db/schema';
import { and, eq } from 'drizzle-orm';

interface CartItemResponse extends CartItem {
  product: Product;
  totalPrice: number;
}

export default defineEventHandler(
  async (event): Promise<CartItemResponse[]> => {
    const { user } = await getUserSession(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You must be logged in to view your cart.',
      });
    }

    try {
      const cartProducts = await db
        .select({
          id: cartItems.id,
          productId: cartItems.productId,
          userId: cartItems.userId,
          quantity: cartItems.quantity,
          product: products,
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(
          and(eq(products.isDeleted, false), eq(cartItems.userId, user.id)),
        );

      return cartProducts.map((item) => {
        const price = Number(item.product?.price) || 0;

        return {
          ...item,
          totalPrice: item.quantity * price,
        };
      });
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
  },
);
