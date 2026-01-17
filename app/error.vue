<script setup lang="ts">
const props = defineProps({
  error: Object,
});

useSeoMeta({
  title: () =>
    `${props.error?.statusCode || '404'} ${
      props.error?.statusCode === 404 ? 'Page not found' : 'An error occurred'
    }`,
});

const handleClearError = () => {
  clearError({ redirect: '/' });
};
</script>

<template>
  <main class="min-h-screen flex justify-center items-center px-3 bg-white">
    <div class="py-12 text-center">
      <h1 class="font-bold text-center mb-2 text-7xl sm:text-8xl xl:text-9xl">
        {{ error?.statusCode || '404' }}
      </h1>

      <h2 class="font-medium text-2xl sm:text-3xl xl:text-4xl mb-6">
        {{ error?.statusCode === 404 ? 'Page not found' : 'An error occurred' }}
      </h2>

      <button
        @click="handleClearError"
        class="bg-gray-800 text-white rounded-md px-6 py-3 sm:py-4 font-medium inline-block cursor-pointer"
      >
        <span class="z-10 relative">BACK TO HOME</span>
      </button>
    </div>
  </main>
</template>
