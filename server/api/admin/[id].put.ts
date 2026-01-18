import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { products } from '~~/db/schema';
import { uploadToCloudinary } from '~~/server/utils/cloudinary';

const productSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters long'),
  price: z.coerce.number().min(0.01, 'Price must be at least 0.01'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description is too long'),
});

export default defineEventHandler(
  async (event): Promise<{ message: string }> => {
    const parts = await readMultipartFormData(event);
    if (!parts)
      throw createError({ statusCode: 400, message: 'Missing fields' });

    const data: any = {};
    let file: any = null;

    parts.forEach((part) => {
      if (part.name === 'image' && part.filename) {
        file = part;
      } else if (part.name) {
        data[part.name] = part.data.toString();
      }
    });

    const id = data.id;

    const result = productSchema.safeParse(data);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation Failed',
        data: { errors: result.error.issues },
      });
    }

    const { user } = await getUserSession(event);
    if (!user) {
      throw createError({ statusCode: 401, message: 'Unauthorized' });
    }

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        message: 'Valid Product ID is required',
      });
    }

    const [existing] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, Number(id)), eq(products.userId, user.id)))
      .limit(1);

    if (!existing) {
      throw createError({ statusCode: 404, message: 'Product not found' });
    }

    try {
      let imageUrl = existing.imageUrl;
      if (file) {
        imageUrl = await uploadToCloudinary(file);
      }

      await db
        .update(products)
        .set({
          title: result.data.title,
          price: String(result.data.price),
          description: result.data.description,
          imageUrl,
        })
        .where(and(eq(products.id, Number(id)), eq(products.userId, user.id)));

      return { message: 'Product updated successfully!' };
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
  },
);
