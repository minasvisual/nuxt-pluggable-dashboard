<template>
<!-- <div id="defaultModal" tabindex="-1" aria-hidden="true" 
     class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full"
     :class="{'hidden': !show, 'show block': show}"
>
    <div class="relative p-4 w-full max-w-2xl h-full md:h-auto mx-auto"> 
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700 p-4"> 
            <div class="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
                    <slot name="title"></slot>
                </h3>
                <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal" @click="$emit('update:show', false)">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
                </button>
            </div>
            <slot></slot>
        </div>
    </div>
</div> -->
 
        <TransitionRoot as="template" :show="show" >
            <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" >
                <div
                    class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
                >
                    <TransitionChild
                        as="template"
                        enter="ease-out duration-300"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="ease-in duration-200"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"  />
                    </TransitionChild>
 
                    <TransitionChild
                        as="template"
                        enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div
                            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
                        >   
                              <DialogTitle as="h3" class="text-lg leading-6 font-medium text-gray-900 flex justify-between">
                                  <slot name="title"></slot> 
                                  <XIcon class="h-4 text-sm cursor-pointer" @click="$emit('update:show', false)"/>
                              </DialogTitle>
                              <div class="mt-2">
                                  <slot></slot>
                              </div> 
                        </div>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot> 
</template>

<script setup>  
  import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
  import { XIcon } from '@heroicons/vue/outline' 
  const { show } = defineProps({
    show: {
      type: Boolean,
      default: false
    },  
  }) 
</script>