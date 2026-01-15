<template>
  <div class="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
    <div class="mx-auto max-w-2xl">
      <form @submit.prevent="login">
        <div class="space-y-12">
          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="col-span-full">
              <label
                for="email"
                class="block mb-2.5 text-sm font-medium text-heading"
                >Email</label
              >
              <div class="mt-2">
                <input
                  autocomplete="username"
                  v-model="form.email"
                  id="email"
                  type="text"
                  class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                />
              </div>
              <span
                v-if="formErrors.email"
                class="text-red-500 text-sm mt-2 block"
                >{{ formErrors.email }}</span
              >
            </div>

            <div class="col-span-full">
              <label
                for="password"
                class="block mb-2.5 text-sm font-medium text-heading"
                >Password</label
              >
              <div class="mt-2">
                <input
                  autocomplete="current-password"
                  v-model="form.password"
                  id="password"
                  type="password"
                  class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                />
              </div>
              <span
                v-if="formErrors.password"
                class="text-red-500 text-sm mt-2 block"
                >{{ formErrors.password }}</span
              >
            </div>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
          <button
            :disabled="loading"
            type="submit"
            class="text-white bg-black rounded-md box-border border border-transparent shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { csrf } = useCsrf();

const loading = ref(false);

const toast = useToast();

const { fetch: refreshSession } = useUserSession();

const form = reactive({
  email: '',
  password: '',
});

const formErrors = ref<Record<string, string>>({});

const login = async () => {
  if (loading.value) return;

  formErrors.value = {};

  loading.value = true;

  try {
    const { message } = await $fetch<{ message: string }>('/api/auth/login', {
      method: 'POST',
      body: form,
      headers: {
        'csrf-token': csrf,
      },
    });

    toast.success({
      title: 'Success!',
      message,
    });

    await refreshSession();

    await navigateTo('/');

    form.email = '';
    form.password = '';
  } catch (error: any) {
    if (error.statusCode === 400 && error.data?.data?.errors) {
      error.data.data.errors.forEach((err: any) => {
        if (!formErrors.value[err.path]) {
          formErrors.value[err.path] = err.message;
        }
      });
    } else {
      toast.error({
        title: 'Error!',
        message: error.data?.statusMessage || 'Something went wrong',
      });
    }
  } finally {
    loading.value = false;
  }
};
</script>
