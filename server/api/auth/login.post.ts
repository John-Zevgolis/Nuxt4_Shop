import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { users } from '~~/db/schema';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters long'),
});

export default defineEventHandler(
  async (event): Promise<{ message: string }> => {
    const body = await readBody(event);
    const result = loginSchema.safeParse(body);

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

    const { email, password } = result.data;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password.',
      });
    }

    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
      },
    });

    return { message: 'Logged in successfully!' };
  },
);
