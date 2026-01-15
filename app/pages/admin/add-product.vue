<template>
  <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl">
      <form @submit.prevent="addProduct">
        <div class="space-y-12">
          <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="col-span-full">
              <label
                for="title"
                class="block mb-2.5 text-sm font-medium text-heading"
                >Title</label
              >
              <div class="mt-2">
                <input
                  id="title"
                  type="text"
                  v-model="form.title"
                  class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                />
              </div>
              <span
                v-if="formErrors.title"
                class="text-red-500 text-sm mt-2 block"
                >{{ formErrors.title }}</span
              >
            </div>

            <div class="col-span-full">
              <label
                for="cover-photo"
                class="block mb-2.5 text-sm font-medium text-heading"
                >Cover photo</label
              >
              <div
                class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
              >
                <div class="text-center">
                  <div class="mb-4 flex justify-center">
                    <img
                      v-if="imagePreview"
                      :src="imagePreview"
                      alt="preview"
                      class="h-48 w-48 object-cover rounded-lg shadow-md border-2 border-indigo-50"
                    />
                    <svg
                      v-else
                      class="mx-auto size-12 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="mt-4 flex text-sm/6 text-gray-600">
                    <label
                      for="file-upload"
                      class="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        name="file-upload"
                        class="sr-only"
                        @change="handleFileUpload"
                      />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs/5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
              <span
                v-if="formErrors.imageUrl"
                class="text-red-500 text-sm mt-2 block"
                >{{ formErrors.imageUrl }}</span
              >
            </div>

            <div class="col-span-full">
              <label
                for="price"
                class="block mb-2.5 text-sm font-medium text-heading"
                >Price</label
              >
              <div class="mt-2">
                <input
                  id="price"
                  type="number"
                  v-model.number="form.price"
                  step="0.01"
                  class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                />
              </div>
              <span
                v-if="formErrors.price"
                class="text-red-500 text-sm mt-2 block"
                >{{ formErrors.price }}</span
              >
            </div>

            <div class="col-span-full">
              <label
                for="description"
                class="block mb-2.5 text-sm font-medium text-heading"
                >Description</label
              >
              <div class="mt-2">
                <textarea
                  name="description"
                  id="description"
                  rows="3"
                  v-model="form.description"
                  class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                ></textarea>
              </div>
              <span
                v-if="formErrors.description"
                class="text-red-500 text-sm mt-2 block"
                >{{ formErrors.description }}</span
              >
            </div>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            :disabled="loading"
            class="text-white bg-black rounded-md box-border border border-transparent shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { csrf } = useCsrf();

definePageMeta({
  middleware: ['auth'],
});

const loading = ref(false);

const toast = useToast();

const form = reactive<{
  title: string;
  price: number;
  description: string;
}>({
  title: '',
  price: 0,
  description: '',
});

const selectedFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    selectedFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const formErrors = ref<Record<string, string>>({});

const addProduct = async () => {
  if (loading.value) return;

  formErrors.value = {};

  loading.value = true;

  const formData = new FormData();
  formData.append('title', form.title);
  formData.append('price', form.price.toString());
  formData.append('description', form.description);

  if (selectedFile.value) {
    formData.append('image', selectedFile.value);
  } else {
    console.error('No file selected!');
    formErrors.value.imageUrl = 'Please select an image first';
    return;
  }

  try {
    const { message } = await $fetch<{ message: string }>('/api/admin', {
      method: 'POST',
      body: formData,
      headers: {
        'csrf-token': csrf,
      },
    });

    toast.success({
      title: 'Success!',
      message,
    });

    await navigateTo('/');

    form.title = '';
    form.price = 0;
    form.description = '';
    selectedFile.value = null;
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
