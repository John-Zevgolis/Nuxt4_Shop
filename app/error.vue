<script setup lang="ts">
const props = defineProps({
  error: Object,
});

useSeoMeta({
  title: () =>
    `${props.error?.statusCode || '404'} ${
      props.error?.statusCode === 404
        ? 'Η σελίδα δεν βρέθηκε'
        : 'Παρουσιάστηκε ένα σφάλμα'
    }`,
});

const handleClearError = () => {
  clearError({ redirect: '/' });
};
</script>

<template>
  <main class="min-h-screen flex justify-center items-center px-3 bg-white">
    <div class="py-12 text-center">
      <h1
        class="font-bold text-center mb-2 text-7xl sm:text-8xl xl:text-9xl text-[#97211a]"
      >
        {{ error?.statusCode || '404' }}
      </h1>

      <h2 class="font-medium text-2xl sm:text-3xl xl:text-4xl mb-6">
        {{
          error?.statusCode === 404
            ? 'Η σελίδα δεν βρέθηκε'
            : 'Παρουσιάστηκε ένα σφάλμα'
        }}
      </h2>

      <button
        @click="handleClearError"
        class="custom-btn overflow-hidden text-white border-2 border-[#97211a] hover:text-[#97211a] rounded-sm px-8 sm:px-12 py-3 sm:py-4 font-bold relative inline-block bg-[#97211a] xl:text-lg cursor-pointer"
      >
        <span class="z-10 relative">ΕΠΙΣΤΡΟΦΗ ΣΤΗΝ ΑΡΧΙΚΗ</span>
      </button>
    </div>
  </main>
</template>
