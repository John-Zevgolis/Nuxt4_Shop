import { CartItem } from '@prisma/client';

export default defineEventHandler(async (event): Promise<CartItem> => {
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

  const existing = await prisma.cartItem.findFirst({
    where: {
      id: Number(id),
      userId: user.id,
    },
  });

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    });
  }

  try {
    const product = await prisma.cartItem.delete({
      where: {
        id: Number(id),
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
