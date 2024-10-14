<template>
  <button class="btn btn-primary" @click="$emit('select-winner')" :disabled="disabled">
    New winner
  </button>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select-winner'])
</script>
