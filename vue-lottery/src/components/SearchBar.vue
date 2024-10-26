<template>
  <div class="mb-3">
    <input
      type="text"
      class="form-control"
      placeholder="Search by name..."
      v-model="searchTerm"
      @input="emitSearch"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { defineEmits } from 'vue'

const emit = defineEmits(['filter-by-name'])
const searchTerm = ref('')

function emitSearch() {
  emit('filter-by-name', searchTerm.value)
}
</script>
