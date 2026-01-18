import { orders } from '~~/db/schema';
import { desc, eq, InferSelectModel } from 'drizzle-orm';

type Order = InferSelectModel<typeof orders>;

export default defineEventHandler(async (event): Promise<Order[]> => {
  const { user } = await getUserSession(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You must be logged in.',
    });
  }

  try {
    return await db.select().from(orders).orderBy(desc(orders.id));
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
