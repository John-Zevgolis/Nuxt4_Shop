import { CartItem, Product } from '@prisma/client';

interface CartItemResponse extends CartItem {
  product: Product;
  totalPrice: number;
}

export default defineEventHandler(async (event): Promise<CartItemResponse> => {
  const { productId } = await readBody(event);
  const { user } = await getUserSession(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You must be logged in to add items to your cart.',
    });
  }

  const product = await prisma.product.findFirst({
    where: {
      id: Number(productId),
      isDeleted: false,
    },
  });

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'This product is no longer available.',
    });
  }

  const existing = await prisma.cartItem.findFirst({
    where: {
      productId: Number(productId),
      userId: user.id,
    },
  });

  try {
    let cartItem;

    if (existing) {
      cartItem = await prisma.cartItem.update({
        where: {
          id: existing.id,
        },
        data: {
          quantity: existing.quantity + 1,
        },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          productId: Number(productId),
          quantity: 1,
          userId: user.id,
        },
        include: { product: true },
      });
    }

    const priceAsNumber = Number(cartItem.product.price);
    const totalPrice = cartItem.quantity * priceAsNumber;

    return {
      ...cartItem,
      totalPrice,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
