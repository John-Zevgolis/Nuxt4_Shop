// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.scss'],
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
