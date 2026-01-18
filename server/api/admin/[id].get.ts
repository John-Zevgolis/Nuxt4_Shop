import { and, eq, InferSelectModel } from 'drizzle-orm';
import { products } from '~~/db/schema';

type Product = InferSelectModel<typeof products>;

export default defineEventHandler(async (event): Promise<Product | null> => {
  const id = getRouterParam(event, 'id');
  const { user } = await getUserSession(event);

  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Product ID',
    });
  }

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You must be logged in.',
    });
  }

  try {
    const [product] = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.id, Number(id)),
          eq(products.userId, user.id),
          eq(products.isDeleted, false),
        ),
      )
      .limit(1);

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found or access denied.',
      });
    }

    return product;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
