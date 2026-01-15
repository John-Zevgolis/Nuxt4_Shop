import bcrypt from 'bcryptjs';
import { z } from 'zod';

const signupSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Invalid email format'),
    password: z
      .string()
      .trim()
      .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().trim().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default defineEventHandler(
  async (event): Promise<{ message: string }> => {
    const body = await readBody(event);
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation Failed',
        data: {
          errors: result.error.issues.map((issue) => ({
            path: issue.path[issue.path.length - 1],
            message: issue.message,
          })),
        },
      });
    }

    const { email, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User already exists.',
      });
    }

    const hasedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hasedPassword,
      },
    });

    await setUserSession(event, {
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });

    return { message: 'User created and logged in successfully!' };
  }
);
