<template>
  <div class="container my-4">
    <div class="bg-white mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <WinnersList :winners="selectedWinners" @remove-winner="removeSelectedWinner" />
        <WinnerButton
          @select-winner="selectRandomWinner"
          :disabled="!winners.length || selectedWinners.length >= 3"
        />
      </div>
    </div>

    <WinnerForm @winner-added="handleWinnerAdded" submitButtonText="Add Winner" />
    <SearchBar @filter-by-name="filterWinners" />

    <WinnersTable
      :winners="filteredAndSortedWinners"
      @edit-winner="startEditingWinner"
      @confirm-delete="confirmDeleteWinner"
      @sort-changed="changeSort"
    />

    <CustomModal v-if="modals.edit.show" @close="closeEditModal">
      <template #header>Edit Winner</template>
      <template #body>
        <WinnerForm
          :initial-data="editingWinner"
          submitButtonText="Update"
          @winner-updated="handleWinnerUpdated"
        />
      </template>
    </CustomModal>

    <CustomModal v-if="modals.delete.show" @close="closeDeleteModal">
      <template #header>Confirm Deletion</template>
      <template #body>
        <p v-if="winnerToDelete">
          Are you sure you want to delete {{ winnerToDelete.name }} ({{ winnerToDelete.email }})?
        </p>
        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary me-2" @click="closeDeleteModal">No</button>
          <button class="btn btn-danger" @click="deleteWinner">Yes</button>
        </div>
      </template>
    </CustomModal>

    <CustomModal v-if="modals.success.show" @close="closeSuccessModal">
      <template #header>Success</template>
      <template #body>
        <p>{{ modals.success.message }}</p>
      </template>
    </CustomModal>

    <CustomModal v-if="modals.error.show" @close="closeErrorModal">
      <template #header>Error</template>
      <template #body>
        <p>{{ modals.error.message }}</p>
      </template>
    </CustomModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import WinnersTable from '@/components/WinnersTable.vue'
import WinnersList from '@/components/WinnersList.vue'
import WinnerButton from '@/components/WinnerButton.vue'
import SearchBar from '@/components/SearchBar.vue'
import CustomModal from '@/components/CustomModal.vue'
import WinnerForm from '@/components/WinnerForm.vue'
import WinnerService from './WinnerService'
import type Winner from './Winner'

const winnerService = new WinnerService()

const winners = ref<Winner[]>([])
const selectedWinners = ref<Winner[]>([])
const searchTerm = ref('')
const sortConfig = ref({ type: 'name', order: 'asc' })
const editingWinner = ref<Winner | undefined>(undefined)
const winnerToDelete = ref<Winner | null>(null)

const modals = ref({
  delete: { show: false },
  success: { show: false, message: '' },
  error: { show: false, message: '' },
  edit: { show: false }
})

const loadWinners = async () => {
  winners.value = await winnerService.getAllWinners()
}

const filteredAndSortedWinners = computed(() => {
  const filtered = winners.value.filter((winner) => {
    return winner.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  })

  const sorted = [...filtered].sort((a, b) => {
    const modifier = sortConfig.value.order === 'asc' ? 1 : -1
    if (sortConfig.value.type === 'name') {
      return a.name.localeCompare(b.name) * modifier
    } else {
      return (new Date(a.dob).getTime() - new Date(b.dob).getTime()) * modifier
    }
  })

  return sorted
})

const showSuccessModal = (message: string) => {
  modals.value.success.message = message
  modals.value.success.show = true
  // Додаємо таймер для автоматичного закриття
  setTimeout(() => {
    closeSuccessModal()
  }, 2000)
}

const showErrorModal = (message: string) => {
  modals.value.error.message = message
  modals.value.error.show = true
  // Додаємо таймер для автоматичного закриття
  setTimeout(() => {
    closeErrorModal()
  }, 3000)
}

const closeEditModal = () => {
  modals.value.edit.show = false
  editingWinner.value = undefined
}

const closeDeleteModal = () => {
  modals.value.delete.show = false
  winnerToDelete.value = null
}

const closeSuccessModal = () => {
  modals.value.success.show = false
}

const closeErrorModal = () => {
  modals.value.error.show = false
}

const handleWinnerAdded = async (winner: Winner) => {
  try {
    const result = await winnerService.addWinner(winner)
    if (result.isValid) {
      await loadWinners()
      showSuccessModal('Winner added successfully!')
    } else {
      showErrorModal(Object.values(result.errors)[0])
    }
  } catch (error) {
    showErrorModal(error instanceof Error ? error.message : 'Failed to add winner')
  }
}

const handleWinnerUpdated = async (winner: Winner) => {
  try {
    const result = await winnerService.updateWinner(winner)
    if (result.isValid) {
      await loadWinners()
      closeEditModal()
      showSuccessModal('Winner updated successfully!')
    } else {
      showErrorModal(Object.values(result.errors)[0])
    }
  } catch (error) {
    showErrorModal(error instanceof Error ? error.message : 'Failed to update winner')
  }
}

const selectRandomWinner = async () => {
  if (winners.value.length === 0 || selectedWinners.value.length >= 3) return
  const excludeEmails = selectedWinners.value.map((w) => w.email)
  const newWinners = await winnerService.selectRandomWinners(1, excludeEmails)
  if (newWinners.length > 0) {
    selectedWinners.value.push(newWinners[0])
  }
}

const removeSelectedWinner = async (index: number) => {
  selectedWinners.value.splice(index, 1)
  await loadWinners()
}

const startEditingWinner = (winner: Winner) => {
  editingWinner.value = { ...winner }
  modals.value.edit.show = true
}

const confirmDeleteWinner = (winner: Winner) => {
  winnerToDelete.value = winner
  modals.value.delete.show = true
}

const deleteWinner = async () => {
  if (winnerToDelete.value) {
    try {
      await winnerService.deleteWinner(winnerToDelete.value.email)
      await loadWinners() // Перезавантажуємо список після успішного видалення
      closeDeleteModal()
      showSuccessModal('Winner deleted successfully!')
    } catch (error) {
      showErrorModal(error instanceof Error ? error.message : 'Failed to delete winner')
    }
  }
}

const filterWinners = (term: string) => {
  searchTerm.value = term
}

const changeSort = ({ type, order }: { type: 'name' | 'dob'; order: 'asc' | 'desc' }) => {
  sortConfig.value = { type, order }
}

onMounted(() => {
  loadWinners()
})
</script>
