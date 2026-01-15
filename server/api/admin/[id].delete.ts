import { Product } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

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
      try {
        await prisma.product.update({
          where: {
            id: Number(id),
          },
          data: {
            isDeleted: true,
          },
        });

        return {
          message: 'Product marked as deleted to preserve order history',
        };
      } catch (error: any) {
        throw createError({
          statusCode: 500,
          statusMessage: error.message,
        });
      }
    } else {
      try {
        const urlParts = existing.imageUrl.split('/');
        const fileNameWithExtension = urlParts.pop() || '';
        const fileName = fileNameWithExtension.split('.')[0];

        const publicId = `shop/${fileName}`;

        await cloudinary.uploader.destroy(publicId);

        await prisma.product.delete({
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
  }
);
