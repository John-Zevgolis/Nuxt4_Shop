<template>
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-10">
    <div v-if="pending">Loading...</div>
    <div
      v-else-if="cartProducts && cartProducts.length > 0"
      class="flex h-full flex-col overflow-y-auto bg-white shadow-xl focus:outline-none"
    >
      <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div class="mt-8">
          <div class="flow-root">
            <ul role="list" class="-my-6 divide-y divide-gray-200">
              <li
                v-for="cartProduct in cartProducts"
                :key="cartProduct.id"
                class="flex py-6"
              >
                <div
                  class="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200"
                >
                  <img
                    :src="cartProduct.product.imageUrl"
                    :alt="cartProduct.product.description"
                    class="size-full object-cover"
                  />
                </div>

                <div class="ml-4 flex flex-1 flex-col">
                  <div>
                    <div
                      class="flex justify-between text-base font-medium text-gray-900"
                    >
                      <h3>
                        {{ cartProduct.product.title }}
                      </h3>
                      <p class="ml-4">
                        {{ formatPrice(cartProduct.totalPrice) }}
                      </p>
                    </div>
                  </div>
                  <div class="flex flex-1 items-end justify-between text-sm">
                    <p class="text-gray-500">Qty {{ cartProduct.quantity }}</p>

                    <div class="flex">
                      <button
                        :disabled="loading"
                        @click="deleteProduct(cartProduct.id)"
                        type="button"
                        class="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div class="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p v-if="totalPrice">{{ formatPrice(totalPrice) }}</p>
        </div>
        <p class="mt-0.5 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>
        <div class="mt-6">
          <button
            :disabled="loading"
            @click="createOrder"
            class="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>

    <div v-else>
      <h1>No products found!</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product';
import type { CartItem } from '~/types/cart-item';

const { csrf } = useCsrf();

definePageMeta({
  middleware: ['auth'],
});

interface CartItemResponse extends CartItem {
  product: Product;
  totalPrice: number;
}

const loading = ref(false);

const toast = useToast();

const {
  data: cartProducts,
  error,
  pending,
  refresh,
} = await useFetch<CartItemResponse[]>('/api/cart');

const totalPrice = computed(() => {
  return cartProducts.value?.reduce((acc, item) => {
    return acc + Number(item.totalPrice);
  }, 0);
});

const deleteProduct = async (id: number) => {
  if (loading.value) return;

  loading.value = true;

  try {
    const { message } = await $fetch<{ message: string }>(`/api/cart/${id}`, {
      method: 'DELETE',
      headers: {
        'csrf-token': csrf,
      },
    });

    toast.success({
      title: 'Success!',
      message,
    });

    await refresh();
  } catch (error: any) {
    toast.error({
      title: 'Error!',
      message: error.data?.statusMessage || 'Something went wrong',
    });
  } finally {
    loading.value = false;
  }
};

const createOrder = async () => {
  if (loading.value) return;

  loading.value = true;

  try {
    const { message } = await $fetch<{ message: string }>('/api/orders', {
      method: 'POST',
      headers: {
        'csrf-token': csrf,
      },
    });

    toast.success({
      title: 'Success!',
      message,
    });

    await navigateTo('/orders');
  } catch (error: any) {
    toast.error({
      title: 'Error!',
      message: error.data?.statusMessage || 'Something went wrong',
    });
  } finally {
    loading.value = false;
  }
};
</script>
