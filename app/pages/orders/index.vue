<template>
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-10">
    <div v-if="pending">Loading...</div>
    <div class="grid grid-cols-1" v-else-if="orders && orders.length > 0">
      <div class="mt-6 flow-root sm:mt-8">
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            class="flex flex-wrap items-center gap-y-4 py-6"
            v-for="order in orders"
            :key="order.id"
          >
            <div class="w-1/3 lg:w-auto lg:flex-1">
              <div
                class="text-base font-medium text-gray-500 dark:text-gray-400"
              >
                Order ID:
              </div>
              <dd
                class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white"
              >
                <span class="hover:underline">#{{ order.id }}</span>
              </dd>
            </div>

            <div class="w-1/3 lg:w-auto lg:flex-1">
              <dt
                class="text-base font-medium text-gray-500 dark:text-gray-400"
              >
                Date:
              </dt>
              <dd
                class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white"
              >
                {{ new Date(order.createdAt).toLocaleDateString('el-GR') }}
              </dd>
            </div>

            <div class="w-1/3 lg:w-auto lg:flex-1">
              <dt
                class="text-base font-medium text-gray-500 dark:text-gray-400"
              >
                Total:
              </dt>
              <dd
                class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white"
              >
                {{ formatPrice(order.totalAmount) }}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <h1>No orders found!</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types/order';

definePageMeta({
  middleware: ['auth'],
});

const { data: orders, error, pending } = await useFetch<Order[]>('/api/orders');
</script>
