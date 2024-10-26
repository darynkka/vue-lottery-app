<template>
  <div class="table-responsive">
    <table class="table table-bordered text-center">
      <thead>
        <tr>
          <th>#</th>
          <th>
            Name
            <button class="btn" @click="toggleSort('name')">
              <i
                :class="sortOrder === 'asc' ? 'bi bi-sort-down' : 'bi bi-sort-up'"
                class="icons"
              ></i>
            </button>
          </th>
          <th>
            Date of Birth
            <button class="btn" @click="toggleSort('dob')">
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
        <tr v-for="(winner, index) in winners" :key="winner.email">
          <td class="align-middle">{{ index + 1 }}</td>
          <td class="align-middle">{{ winner.name }}</td>
          <td class="align-middle">{{ winner.dob }}</td>
          <td class="align-middle">{{ winner.email }}</td>
          <td class="align-middle">{{ winner.phone }}</td>
          <td class="align-middle">
            <button class="btn btn-sm btn-primary me-2" @click="editWinner(winner)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="confirmDelete(winner)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  winners: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit-winner', 'confirm-delete', 'sort-changed'])

const sortOrder = ref('asc')
const sortType = ref('name')

const toggleSort = (type) => {
  if (sortType.value === type) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortType.value = type
    sortOrder.value = 'asc'
  }
  emit('sort-changed', { type: sortType.value, order: sortOrder.value })
}

const editWinner = (winner) => {
  emit('edit-winner', winner)
}

const confirmDelete = (winner) => {
  emit('confirm-delete', winner)
}
</script>
