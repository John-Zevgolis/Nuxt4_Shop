<template>
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-10">
    <div v-if="pending">Loading...</div>
    <div
      v-else-if="product"
      class="bg-neutral-primary-soft block border border-default rounded-base shadow-xs"
    >
      <img class="rounded-base" :src="product.imageUrl" :alt="product.title" />
      <div class="p-6">
        <h5 class="mb-2 text-2xl font-semibold tracking-tight text-heading">
          {{ product.title }}
        </h5>
        <h4 class="mt-6 mb-2 text-xl font-semibold tracking-tight text-heading">
          {{ product.price }}
        </h4>
        <p class="mb-0 text-body">
          {{ product.description }}
        </p>
        <button
          v-if="loggedIn"
          :disabled="loading"
          @click="addToCart"
          class="inline-flex items-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        >
          Add to Cart
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
