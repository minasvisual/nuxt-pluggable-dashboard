<template>
  <NuxtLayout  >
    <div class="mt-4 container">  
      Index | <a href="/auth/login">dashboard</a>
    </div>
  </NuxtLayout>
</template>

<script lang="ts">
import { ArrowNarrowRightIcon } from '@heroicons/vue/outline'

interface links {
    id: number
    title: string
    url: any
}

export default {
    components: {
        ArrowNarrowRightIcon
    },
    setup() {
        const router = useRouter()
        const lists = ref<links[]>([
            { id: 1, title: 'Login', url: '/auth/login' },
            // { id: 1, title: 'Modal', url: 'modal' },
            //  { id: 1, title: 'Menu', url: 'menu' },
            // { id: 1, title: 'New soon...', url: '' },
        ])
        return {
            lists
        }
    }
}
</script>