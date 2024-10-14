<template>
  <div class="table-responsive">
    <table class="table table-bordered text-center">
      <thead>
        <tr>
          <th>#</th>
          <th>
            Name
            <button
              class="btn"
              @click="toggleSort('name')"
              style="background: transparent; border: none; width: 20px; height: 20px"
            >
              <i
                :class="sortOrder === 'asc' ? 'bi bi-sort-down' : 'bi bi-sort-up'"
                class="icons"
              ></i>
            </button>
          </th>
          <th>
            Date of Birth
            <button
              class="btn"
              @click="toggleSort('dob')"
              style="background: transparent; border: none; width: 20px; height: 20px"
            >
              <i
                :class="sortOrder === 'asc' ? 'bi bi-sort-down' : 'bi bi-sort-up'"
                class="icons"
              ></i>
            </button>
          </th>
          <th>Email</th>
          <th>Phone number</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(winner, index) in sortedWinners" :key="index">
          <td class="align-middle">{{ index + 1 }}</td>
          <td class="align-middle">{{ winner.name }}</td>
          <td class="align-middle">{{ winner.dob }}</td>
          <td class="align-middle">{{ winner.email }}</td>
          <td class="align-middle">{{ winner.phone }}</td>
          <td class="align-middle">
            <button class="btn btn-sm btn-primary me-2" @click="$emit('edit-winner', winner)">
              Edit
            </button>
            <button class="btn btn-sm btn-danger" @click="$emit('confirm-delete', winner)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  winners: {
    type: Array,
    required: true
  },
  searchTerm: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['edit-winner', 'confirm-delete'])

const sortType = ref('name')
const sortOrder = ref('asc')

const sortedWinners = computed(() => {
  return [...props.winners].sort((a, b) => {
    const modifier = sortOrder.value === 'asc' ? 1 : -1
    if (sortType.value === 'name') {
      return a.name.localeCompare(b.name) * modifier
    } else if (sortType.value === 'dob') {
      return (new Date(a.dob) - new Date(b.dob)) * modifier
    }
    return 0
  })
})

const toggleSort = (type) => {
  if (sortType.value === type) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortType.value = type
    sortOrder.value = 'asc'
  }
}
</script>

<style scoped>
.icons {
  position: relative;
  bottom: 8px;
  right: 7px;
}
</style>
