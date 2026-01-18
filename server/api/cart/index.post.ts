import { products, cartItems } from '~~/db/schema';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(
  async (event): Promise<{ message: string }> => {
    const { productId } = await readBody(event);
    const { user } = await getUserSession(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You must be logged in to add items to your cart.',
      });
    }

    const [product] = await db
      .select()
      .from(products)
      .where(
        and(eq(products.id, Number(productId)), eq(products.isDeleted, false)),
      )
      .limit(1);

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'This product is no longer available.',
      });
    }

    const [existing] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.productId, Number(productId)),
          eq(cartItems.userId, user.id),
        ),
      )
      .limit(1);

    try {
      if (existing) {
        await db
          .update(cartItems)
          .set({
            quantity: existing.quantity + 1,
          })
          .where(eq(cartItems.id, existing.id));
      } else {
        await db.insert(cartItems).values({
          productId: Number(productId),
          quantity: 1,
          userId: user.id,
        });
      }

      return { message: 'Product added to cart successfully!' };
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
  },
);
