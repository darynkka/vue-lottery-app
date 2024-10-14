<template>
  <div class="mb-3">
    <input type="text" class="form-control" placeholder="Search by name..." v-model="searchTerm" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['filter-by-name'])
const searchTerm = ref('')

watch(searchTerm, (newValue) => {
  emit('filter-by-name', newValue)
})
</script>
