<template>
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-10">
    <div v-if="pending">Loading...</div>
    <div
      v-else-if="product"
      class="bg-neutral-primary-soft block border border-default rounded-base shadow-xs"
    >
      <div class="aspect-video">
        <img
          class="w-full h-full object-cover"
          :src="product.imageUrl"
          :alt="product.title"
        />
      </div>

      <div class="p-6">
        <h5 class="mb-2 text-2xl font-semibold tracking-tight text-heading">
          {{ product.title }}
        </h5>
        <h4 class="mt-6 mb-2 text-xl font-semibold tracking-tight text-heading">
          {{ product.price }}
        </h4>
        <p class="mb-6 text-body">
          {{ product.description }}
        </p>
        <button
          v-if="loggedIn"
          :disabled="loading"
          @click="addToCart"
          class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2.5 text-base font-medium text-white shadow-xs hover:bg-indigo-700"
        >
          Add to Cart
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </button>
      </div>
    </div>
    <div v-else>
      <h1>No products found!</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@prisma/client';
const { params } = useRoute();

const { csrf } = useCsrf();

const { loggedIn } = useUserSession();

const loading = ref(false);

const toast = useToast();

const {
  data: product,
  error,
  pending,
} = await useFetch<Product | null>(`/api/products/${params.id}`, {
  key: `product-${params.id}`,
});

const addToCart = async () => {
  if (loading.value) return;

  loading.value = true;

  try {
    await $fetch('/api/cart', {
      method: 'POST',
      body: {
        productId: params.id,
      },
      headers: {
        'csrf-token': csrf,
      },
    });

    await navigateTo('/cart');
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
