import { desc, eq, and, InferSelectModel } from 'drizzle-orm';
import { products } from '~~/db/schema';

type Product = InferSelectModel<typeof products>;

export default defineEventHandler(async (event): Promise<Product[]> => {
  const { user } = await getUserSession(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You must be logged in.',
    });
  }

  try {
    return await db
      .select()
      .from(products)
      .where(and(eq(products.userId, user.id), eq(products.isDeleted, false)))
      .orderBy(desc(products.id));
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
