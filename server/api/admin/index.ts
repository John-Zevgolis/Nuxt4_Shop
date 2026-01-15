import { Product } from '@prisma/client';

export default defineEventHandler(async (event): Promise<Product[]> => {
  const { user } = await getUserSession(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You must be logged in.',
    });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        userId: user.id,
      },
    });

    return products;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
