import { Order, OrderItem, Product } from '@prisma/client';

interface OrderItemWithProducts extends OrderItem {
  product: Product;
  totalPrice: number;
}

interface OrderResponse extends Order {
  items: OrderItemWithProducts[];
}

export default defineEventHandler(async (event): Promise<OrderResponse[]> => {
  const { user } = await getUserSession(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You must be logged in.',
    });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    return orders.map((order) => {
      return {
        ...order,
        items: order.items.map((item) => {
          return {
            ...item,
            totalPrice: item.quantity * item.product.price,
          };
        }),
      };
    });
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
