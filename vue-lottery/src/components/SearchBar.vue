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

<script>
import { ref } from 'vue'

export default {
  emits: ['filter-by-name'],
  setup(props, { emit }) {
    const searchTerm = ref('')

    const emitSearch = () => {
      emit('filter-by-name', searchTerm.value)
    }

    return {
      searchTerm,
      emitSearch
    }
  }
}
</script>
