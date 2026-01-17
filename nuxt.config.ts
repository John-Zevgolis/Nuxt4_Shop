// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  fonts: {
    families: [
      { name: 'Roboto', provider: 'google', weights: [300, 400, 500, 700] },
    ],
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
    'nuxt-auth-utils',
    'nuxt-csurf',
    'nuxt-toast',
  ],
  csurf: {
    https: process.env.NODE_ENV === 'production',
  },
});
