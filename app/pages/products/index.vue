<template>
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-10">
    <div v-if="pending">Loading...</div>
    <div
      v-else-if="data && data.productsResult && data.productsResult.length > 0"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in data.productsResult"
          :key="product.id"
          class="bg-neutral-primary-soft block border border-default rounded-base shadow-xs"
        >
          <div class="aspect-video">
            <NuxtLink class="" :to="`/products/${product.id}`">
              <img
                class="w-full h-full object-cover"
                :src="product.imageUrl"
                :alt="product.title"
              />
            </NuxtLink>
          </div>

          <div class="p-6">
            <NuxtLink :to="`/products/${product.id}`">
              <h5
                class="mb-2 text-2xl font-semibold tracking-tight text-heading"
              >
                {{ product.title }}
              </h5>
            </NuxtLink>
            <h4
              class="mt-6 mb-2 text-xl font-semibold tracking-tight text-heading"
            >
              {{ formatPrice(product.price) }}
            </h4>
            <p class="mb-6 text-body">
              {{ product.description }}
            </p>
            <div class="flex">
              <NuxtLink
                :to="`/products/${product.id}`"
                class="mr-2 flex items-center justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2.5 text-base font-medium text-white shadow-xs hover:bg-slate-900"
              >
                Details
                <svg
                  class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 12H5m14 0-4 4m4-4-4-4"
                  />
                </svg>
              </NuxtLink>
              <button
                v-if="loggedIn"
                :disabled="loading"
                @click="addToCart(product.id)"
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
        </div>
      </div>
      <div
        v-if="data.totalPages > 1"
        class="flex items-center justify-between bg-white px-4 py-3 sm:px-6"
      >
        <div class="flex flex-1 justify-between sm:hidden">
          <button
            :disabled="page === 1"
            @click="prevPage"
            class="disabled:opacity-50 relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            :disabled="page === data.totalPages"
            @click="nextPage"
            class="disabled:opacity-50 relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
          <div>
            <nav
              aria-label="Pagination"
              class="isolate inline-flex -space-x-px rounded-md shadow-xs"
            >
              <button
                :disabled="page === 1"
                @click="prevPage"
                class="disabled:opacity-50 relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-800 inset-ring inset-ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span class="sr-only">Previous</span>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  data-slot="icon"
                  aria-hidden="true"
                  class="size-5"
                >
                  <path
                    d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                  />
                </svg>
              </button>
              <span
                aria-current="page"
                class="relative z-10 inline-flex items-center bg-gray-800 px-4 py-2 text-sm font-medium text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2"
                >Page {{ page }} from {{ data.totalPages }}</span
              >
              <button
                :disabled="page === data.totalPages"
                @click="nextPage"
                class="disabled:opacity-50 relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-800 inset-ring inset-ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span class="sr-only">Next</span>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  data-slot="icon"
                  aria-hidden="true"
                  class="size-5"
                >
                  <path
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
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

const { csrf } = useCsrf();

const loading = ref(false);

const toast = useToast();

const { loggedIn } = useUserSession();

const page = ref(1);

const { data, error, pending } = await useFetch<{
  productsResult: Product[];
  totalPages: number;
  currentPage: number;
}>('/api/products', {
  query: {
    page,
  },
});

const nextPage = () => {
  if (data.value && page.value < data.value.totalPages) page.value++;
};

const prevPage = () => {
  if (page.value > 1) page.value--;
};

const addToCart = async (productId: number) => {
  if (loading.value) return;

  loading.value = true;

  try {
    const { message } = await $fetch<{ message: string }>('/api/cart', {
      method: 'POST',
      body: {
        productId,
      },
      headers: {
        'csrf-token': csrf,
      },
    });

    toast.success({
      title: 'Success!',
      message,
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
