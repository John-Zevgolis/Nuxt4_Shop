import { Product } from '@prisma/client';

export default defineEventHandler(async (event): Promise<Product | null> => {
  const id = getRouterParam(event, 'id');

  try {
    const product = await prisma.product.findFirst({
      where: {
        id: Number(id),
        isDeleted: false,
      },
    });

    return product;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
