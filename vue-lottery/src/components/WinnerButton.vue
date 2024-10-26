<template>
  <button class="btn btn-primary" @click="handleSelectWinner" :disabled="disabled">
    New winner
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  disabled: Boolean
})

const emit = defineEmits(['select-winner'])

function handleSelectWinner() {
  emit('select-winner')
}
</script>
