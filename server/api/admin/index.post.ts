import { Product } from '@prisma/client';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';
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
      if (part.name === 'image') {
        file = part;
      } else if (part.name) {
        data[part.name] = part.data.toString();
      }
    });

    const result = productSchema.safeParse(data);

    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation Failed',
        data: {
          errors: result.error.issues.map((issue) => ({
            path: issue.path[0],
            message: issue.message,
          })),
        },
      });
    }

    if (!file) {
      throw createError({ statusCode: 400, message: 'Image file is required' });
    }

    const { user } = await getUserSession(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You must be logged in to create a product.',
      });
    }

    try {
      const imageUrl = await uploadToCloudinary(file);

      const product = await prisma.product.create({
        data: {
          title: result.data.title,
          price: result.data.price,
          description: result.data.description,
          imageUrl,
          userId: user.id,
        },
      });

      return { message: 'Product created successfully!' };
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
  }
);
