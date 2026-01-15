import { CartItem, Product } from '@prisma/client';

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
      const cartProducts = await prisma.cartItem.findMany({
        where: {
          userId: user.id,
        },
        include: {
          product: true,
        },
      });

      return cartProducts.map((item) => {
        return {
          ...item,
          totalPrice: item.quantity * item.product.price,
        };
      });
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
  }
);
