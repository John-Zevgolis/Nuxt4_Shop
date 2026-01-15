<template>
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div v-if="pending">Loading...</div>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      v-else-if="orders && orders.length > 0"
    >
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-neutral-primary-soft block border border-default rounded-base shadow-xs"
      >
        <div class="px-6">
          <a href="#">
            <h5
              class="mt-6 mb-2 text-2xl font-semibold tracking-tight text-heading"
            >
              #{{ order.id }} Total: {{ order.totalAmount }}
            </h5>
          </a>
          <h4
            v-for="item in order.items"
            :key="item.id"
            class="mt-6 mb-2 text-xl font-semibold tracking-tight text-heading"
          >
            {{ item.product.title }} ({{ item.quantity }}) Price:
            {{ item.totalPrice }}
          </h4>
        </div>
      </div>
    </div>
    <div v-else>
      <h1>No orders found!</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order, OrderItem, Product } from '@prisma/client';

definePageMeta({
  middleware: ['auth'],
});

interface OrderItemWithProducts extends OrderItem {
  product: Product;
  totalPrice: number;
}

interface OrderResponse extends Order {
  items: OrderItemWithProducts[];
}

const {
  data: orders,
  error,
  pending,
} = await useFetch<OrderResponse[]>('/api/orders');
</script>
