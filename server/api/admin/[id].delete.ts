import { Product } from '@prisma/client';

export default defineEventHandler(
  async (event): Promise<{ message: string }> => {
    const id = getRouterParam(event, 'id');
    const { user } = await getUserSession(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You must be logged in to update a product.',
      });
    }

    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required',
      });
    }

    const existing = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found',
      });
    }

    if (existing.userId !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You are not authorized to delete this product.',
      });
    }

    const isInOrder = await prisma.orderItem.findFirst({
      where: {
        productId: Number(id),
      },
    });

    if (isInOrder) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'This product cannot be deleted because it is linked to existing orders.',
      });
    }

    try {
      const product = await prisma.product.delete({
        where: {
          id: Number(id),
        },
      });

      return { message: 'Product deleted successfully!' };
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
  }
);
