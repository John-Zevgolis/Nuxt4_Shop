import { Product } from '@prisma/client';

export default defineEventHandler(
  async (
    event
  ): Promise<{
    products: Product[];
    totalPages: number;
    currentPage: number;
  }> => {
    const { page } = getQuery(event);

    const currentPage = Number(page) || 1;
    const pageSize = 6;

    try {
      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          skip: (currentPage - 1) * pageSize,
          take: pageSize,
          where: {
            isDeleted: false,
          },
          orderBy: {
            id: 'desc',
          },
        }),
        prisma.product.count({
          where: {
            isDeleted: false,
          },
        }),
      ]);

      return {
        products,
        totalPages: Math.ceil(totalCount / pageSize),
        currentPage,
      };
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
  }
);
