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
import WinnerRepository, { IWinner } from '@/WinnerRepository'

const winnerRepo = new WinnerRepository()

const winners = ref<IWinner[]>([])
const selectedWinners = ref<IWinner[]>([])
const searchTerm = ref('')
const sortConfig = ref({ type: 'name', order: 'asc' })
const editingWinner = ref<IWinner | undefined>(undefined)
const winnerToDelete = ref<IWinner | null>(null)

const modals = ref({
  delete: { show: false },
  success: { show: false, message: '' },
  error: { show: false, message: '' },
  edit: { show: false }
})

const loadWinners = () => {
  winners.value = winnerRepo.getAllWinners()
}

const filteredAndSortedWinners = computed(() => {
  const filtered = searchTerm.value ? winnerRepo.searchByName(searchTerm.value) : winners.value
  return winnerRepo.sortWinners(filtered, sortConfig.value.type, sortConfig.value.order)
})

const showSuccessModal = (message: string) => {
  modals.value.success.message = message
  modals.value.success.show = true
  setTimeout(closeSuccessModal, 2000)
}

const showErrorModal = (message: string) => {
  modals.value.error.message = message
  modals.value.error.show = true
  setTimeout(closeErrorModal, 3000)
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

const handleWinnerAdded = async (winner: IWinner): Promise<boolean> => {
  try {
    const result = await winnerRepo.addWinner(winner)

    if (result.success) {
      await loadWinners()
      showSuccessModal('Winner added successfully!')
      return true
    } else {
      const errorMessages = Object.values(result.errors || {}).join(', ')
      showErrorModal(errorMessages)
      return false
    }
  } catch (error) {
    showErrorModal('An unexpected error occurred. Please try again.')
    return false
  }
}

const handleWinnerUpdated = async (winner: IWinner): Promise<boolean> => {
  try {
    const result = await winnerRepo.updateWinner(winner)

    if (result.success) {
      await loadWinners()
      showSuccessModal('Winner updated successfully!')
      return true
    } else {
      const errorMessages = Object.values(result.errors || {}).join(', ')
      showErrorModal(errorMessages)
      return false
    }
  } catch (error) {
    showErrorModal('An unexpected error occurred. Please try again.')
    return false
  }
}

const selectRandomWinner = () => {
  if (winners.value.length === 0 || selectedWinners.value.length >= 3) return

  const excludeEmails = selectedWinners.value.map((w) => w.email)
  const newWinners = winnerRepo.getRandomWinners(1, excludeEmails)

  if (newWinners.length > 0) {
    selectedWinners.value.push(newWinners[0])
  }
}

const removeSelectedWinner = (index: number) => {
  selectedWinners.value.splice(index, 1)
  loadWinners()
}

const startEditingWinner = (winner: IWinner) => {
  editingWinner.value = { ...winner }
  modals.value.edit.show = true
}

const confirmDeleteWinner = (winner: IWinner) => {
  winnerToDelete.value = winner
  modals.value.delete.show = true
}

const deleteWinner = () => {
  if (winnerToDelete.value) {
    const result = winnerRepo.deleteWinner(winnerToDelete.value.email)

    if (result.success) {
      loadWinners()
      closeDeleteModal()
      showSuccessModal('Winner deleted successfully!')
    } else {
      showErrorModal(result.error || 'Failed to delete winner')
    }
  }
}

const filterWinners = (term: string) => {
  searchTerm.value = term
}

const changeSort = ({ type, order }: { type: string; order: string }) => {
  sortConfig.value = { type, order }
}

onMounted(async () => {
  await winnerRepo.fetchUsers()
  loadWinners()
})
</script>
