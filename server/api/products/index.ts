import { desc, eq, InferSelectModel, count } from 'drizzle-orm';
import { products } from '~~/db/schema';

type Product = InferSelectModel<typeof products>;

export default defineEventHandler(
  async (
    event,
  ): Promise<{
    productsArr: Product[];
    totalPages: number;
    currentPage: number;
  }> => {
    const { page } = getQuery(event);

    const currentPage = Number(page) || 1;
    const pageSize = 6;

    try {
      const [productsResult, countResult] = await Promise.all([
        db
          .select()
          .from(products)
          .where(eq(products.isDeleted, false))
          .orderBy(desc(products.id))
          .limit(pageSize)
          .offset((currentPage - 1) * pageSize),
        db
          .select({ value: count() })
          .from(products)
          .where(eq(products.isDeleted, false)),
      ]);

      const totalCount = countResult[0]?.value || 0;

      return {
        productsResult,
        totalPages: Math.ceil(totalCount / pageSize),
        currentPage,
      };
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
  },
);
