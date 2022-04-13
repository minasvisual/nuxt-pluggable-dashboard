import { defineNuxtConfig } from "nuxt3";
import dotenv from 'dotenv'
import { pick } from 'lodash'

dotenv.config()

let envs = Object.keys(process.env).filter(i => i.includes('VUE_APP_'))

console.log(pick(process.env, envs))

export default defineNuxtConfig({
  publicRuntimeConfig: {
    ...pick(process.env, envs),
  },
  privateRuntimeConfig: {
    ...pick(process.env, envs)
  },
  modules: ['@formkit/nuxt'],
  buildModules: [
      // pinia plugin - https://pinia.esm.dev
      "@pinia/nuxt",
  ],
  build: {
      transpile: ['@heroicons/vue'],
      postcss: {
          postcssOptions: {
              plugins: {
                  tailwindcss: {},
                  autoprefixer: {},
              },
          },
      },
  },
  postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
  },
  vite: {
      logLevel: "info",
      optimizeDeps: {
          include: [
              '@headlessui/vue', '@heroicons/vue/solid', '@heroicons/vue/outline', 'vue', 'pinia'
          ]
      }
  }
});
