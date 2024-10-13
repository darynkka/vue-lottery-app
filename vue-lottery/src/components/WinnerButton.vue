<template>
  <button class="btn btn-primary" @click="$emit('select-winner')" :disabled="disabled">
    New winner
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
