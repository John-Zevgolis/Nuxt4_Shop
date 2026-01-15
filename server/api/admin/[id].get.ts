import { Product } from '@prisma/client';

export default defineEventHandler(async (event): Promise<Product | null> => {
  const id = getRouterParam(event, 'id');
  const { user } = await getUserSession(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You must be logged in.',
    });
  }

  try {
    const product = await prisma.product.findFirst({
      where: {
        id: Number(id),
        userId: user.id,
        isDeleted: false,
      },
    });

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
