import { eq, InferSelectModel, and } from 'drizzle-orm';
import { products } from '~~/db/schema';

type Product = InferSelectModel<typeof products>;

export default defineEventHandler(async (event): Promise<Product | null> => {
  const id = getRouterParam(event, 'id');

  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Product ID',
    });
  }

  try {
    const [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, Number(id)), eq(products.isDeleted, false)));

    return product;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
