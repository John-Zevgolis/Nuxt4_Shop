import { cartItems } from '~~/db/schema';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(
  async (event): Promise<{ message: string }> => {
    const id = getRouterParam(event, 'id');
    const { user } = await getUserSession(event);

    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cart Item ID is required',
      });
    }

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You must be logged in to add items to your cart.',
      });
    }

    const [existing] = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.id, Number(id)), eq(cartItems.userId, user.id)))
      .limit(1);

    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found',
      });
    }

    try {
      await db
        .delete(cartItems)
        .where(eq(cartItems.id, Number(id)), eq(cartItems.userId, user.id));

      return { message: 'Item removed successfully!' };
    } catch (error: any) {
      console.log('s');
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
  },
);
