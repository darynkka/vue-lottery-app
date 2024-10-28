<template>
  <div class="table-responsive">
    <table class="table table-bordered text-center">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Password</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="winner in localWinners" :key="winner.id">
          <td>{{ winner.id }}</td>
          <td>{{ winner.name }}</td>
          <td>{{ winner.email }}</td>
          <td>{{ winner.role }}</td>
          <td>{{ winner.password }}</td>
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

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { IWinner } from '@/WinnerRepository'

const props = defineProps({
  winners: {
    type: Array as () => IWinner[],
    required: true
  }
})

const localWinners = ref<IWinner[]>(props.winners)

watch(
  () => props.winners,
  (newWinners) => {
    localWinners.value = newWinners
  },
  { immediate: true }
)
</script>
