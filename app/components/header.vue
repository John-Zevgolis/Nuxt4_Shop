<template>
  <nav class="relative bg-gray-800">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button
            type="button"
            command="--toggle"
            commandfor="mobile-menu"
            class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500"
          >
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">Open main menu</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              data-slot="icon"
              aria-hidden="true"
              class="size-6 in-aria-expanded:hidden"
            >
              <path
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              data-slot="icon"
              aria-hidden="true"
              class="size-6 not-in-aria-expanded:hidden"
            >
              <path
                d="M6 18 18 6M6 6l12 12"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <div
          class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
        >
          <div class="flex shrink-0 items-center">
            <img
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
              class="h-8 w-auto"
            />
          </div>
          <div class="hidden sm:ml-6 sm:grow sm:flex sm:justify-between">
            <div class="flex space-x-4">
              <NuxtLink
                to="/"
                class="rounded-md nav-item px-3 py-2 text-sm font-medium"
                >Shop</NuxtLink
              >
              <NuxtLink
                to="/products"
                :class="{
                  'router-link-active': route.path.startsWith('/products'),
                }"
                class="rounded-md nav-item px-3 py-2 text-sm font-medium"
                >Products</NuxtLink
              >
              <template v-if="loggedIn">
                <NuxtLink
                  to="/cart"
                  class="rounded-md nav-item px-3 py-2 text-sm font-medium"
                  >Cart</NuxtLink
                >
                <NuxtLink
                  to="/orders"
                  class="rounded-md nav-item px-3 py-2 text-sm font-medium"
                  >Orders</NuxtLink
                >
                <NuxtLink
                  to="/admin/add-product"
                  class="rounded-md nav-item px-3 py-2 text-sm font-medium"
                  >Add Product</NuxtLink
                >
                <NuxtLink
                  to="/admin/products"
                  class="rounded-md nav-item px-3 py-2 text-sm font-medium"
                  >Admin Products</NuxtLink
                >
              </template>
            </div>
            <div class="flex space-x-4">
              <template v-if="!loggedIn">
                <NuxtLink
                  to="/login"
                  class="rounded-md nav-item px-3 py-2 text-sm font-medium"
                  >Login</NuxtLink
                >
                <NuxtLink
                  to="/signup"
                  class="rounded-md nav-item px-3 py-2 text-sm font-medium"
                  >Signup</NuxtLink
                >
              </template>

              <button
                v-else
                @click="logout"
                class="rounded-md nav-item px-3 py-2 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="mobile-menu" hidden class="block sm:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <NuxtLink
          to="/"
          class="block nav-item rounded-md px-3 py-2 text-base font-medium"
          >Shop</NuxtLink
        >
        <NuxtLink
          to="/products"
          class="block nav-item rounded-md px-3 py-2 text-base font-medium"
          >Products</NuxtLink
        >
        <template v-if="loggedIn">
          <NuxtLink
            to="/cart"
            class="block nav-item rounded-md px-3 py-2 text-base font-medium"
            >Cart</NuxtLink
          >
          <NuxtLink
            to="/orders"
            class="block nav-item rounded-md px-3 py-2 text-base font-medium"
            >Orders</NuxtLink
          >
          <NuxtLink
            to="/admin/add-product"
            class="block nav-item rounded-md px-3 py-2 text-base font-medium"
            >Add Product</NuxtLink
          >
          <NuxtLink
            to="/admin/products"
            class="block nav-item rounded-md px-3 py-2 text-base font-medium"
            >Admin Products</NuxtLink
          >
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute();

const loading = ref(false);

const { loggedIn, clear } = useUserSession();

const logout = async () => {
  if (loading.value) return;

  loading.value = true;

  try {
    await clear();

    await navigateTo('/');
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.nav-item {
  @apply text-gray-300 hover:bg-white/5 hover:text-white;
}

.router-link-active {
  @apply bg-gray-900 text-white;
}
</style>
