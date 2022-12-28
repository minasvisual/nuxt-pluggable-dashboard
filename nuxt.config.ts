import dotenv from 'dotenv'
import _ from 'lodash'

const { pick } = _
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
  modules: [
    '@formkit/nuxt',
    'nuxt-jsoneditor'
  ], 
  buildModules: [
      // pinia plugin - https://pinia.esm.dev
      "@pinia/nuxt",
  ],
  build: {
      transpile: ['@heroicons/vue'], 
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
  },
  jsoneditor: {
    componentName: 'JsonEditor',
    includeCss: true,
    options: {
        /**
        *
        * SET GLOBAL OPTIONS
        * 
        * */
    }
  }
});
