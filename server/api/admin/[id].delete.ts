import { v2 as cloudinary } from 'cloudinary';
import { and, eq } from 'drizzle-orm';
import { orderItems, products } from '~~/db/schema';

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

    const [existing] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, Number(id)), eq(products.userId, user.id)));

    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found',
      });
    }

    const [isInOrder] = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.productId, Number(id)))
      .limit(1);

    if (isInOrder) {
      try {
        await db
          .update(products)
          .set({
            isDeleted: true,
          })
          .where(eq(products.id, Number(id)));

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

        await db.delete(products).where(eq(products.id, Number(id)));

        return { message: 'Product deleted successfully!' };
      } catch (error: any) {
        throw createError({
          statusCode: 500,
          statusMessage: error.message,
        });
      }
    }
  },
);
