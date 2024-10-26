<template>
  <button class="btn btn-primary d-flex align-items-center">
    {{ winner.name }}
    <span class="ms-2 close-btn" @click.stop="onRemove">&times;</span>
  </button>
</template>

<script setup>
const props = defineProps({ winner: { type: Object, required: true } })
const emit = defineEmits(['remove'])

const onRemove = () => {
  emit('remove', props.winner)
}
</script>

<style scoped>
.close-btn {
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
}

.close-btn:hover {
  opacity: 0.8;
}
</style>
