<template>
  <div class="container my-4">
    <div class="bg-white mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <WinnersList :winners="selectedWinners" @remove-winner="removeWinner" />
        <WinnerButton
          @select-winner="selectRandomWinner"
          :disabled="winners.length === 0 || selectedWinners.length >= 3"
        />
      </div>
    </div>

    <WinnerForm @add-winner="onAddWinner" />
    <SearchBar @filter-by-name="filterByName" />
    <WinnersTable
      :winners="filteredWinners"
      @confirm-delete="openDeleteConfirmation"
      @edit-winner="openEditWinnerModal"
    />

    <CustomModal v-if="showDeleteModal" @close="closeDeleteModal">
      <template #header>Confirm Deletion</template>
      <template #body>
        <p>
          Ви дійсно бажаєте видалити учасника {{ participantToDelete.name }} ({{
            participantToDelete.email
          }})?
        </p>
        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary me-2" @click="closeDeleteModal">Ні</button>
          <button class="btn btn-danger" @click="deleteParticipant">Так</button>
        </div>
      </template>
    </CustomModal>

    <CustomModal v-if="showEditModal" @close="closeEditModal">
      <template #header>Edit Winner</template>
      <template #body>
        <form @submit.prevent="updateWinner">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" v-model="editForm.name" id="name" required />
          </div>
          <div class="mb-3">
            <label for="dob" class="form-label">Date of Birth</label>
            <input type="date" class="form-control" v-model="editForm.dob" id="dob" required />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" v-model="editForm.email" id="email" required />
          </div>
          <div class="mb-3">
            <label for="phone" class="form-label">Phone number</label>
            <input type="text" class="form-control" v-model="editForm.phone" id="phone" required />
          </div>
          <button type="submit" class="btn btn-primary">Оновити дані</button>
        </form>
      </template>
    </CustomModal>

    <CustomModal v-if="showSuccessModal" @close="showSuccessModal = false">
      <template #header>Success</template>
      <template #body>
        <p>Winner added successfully!</p>
      </template>
    </CustomModal>

    <CustomModal v-if="showErrorModal" @close="showErrorModal = false">
      <template #header>Error</template>
      <template #body>
        <p>{{ errorMessage }}</p>
      </template>
    </CustomModal>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import WinnersTable from './components/WinnersTable.vue'
import WinnerForm from './components/WinnerForm.vue'
import WinnersList from './components/WinnersList.vue'
import WinnerButton from './components/WinnerButton.vue'
import SearchBar from './components/SearchBar.vue'
import CustomModal from './components/CustomModal.vue'

export default {
  components: {
    WinnersTable,
    WinnerForm,
    WinnersList,
    WinnerButton,
    SearchBar,
    CustomModal
  },
  setup() {
    const winners = ref([])
    const selectedWinners = ref([])
    const searchTerm = ref('')
    const showSuccessModal = ref(false)
    const showErrorModal = ref(false)
    const showDeleteModal = ref(false)
    const showEditModal = ref(false)
    const participantToDelete = ref(null)
    const editForm = ref({
      name: '',
      dob: '',
      email: '',
      phone: ''
    })
    const errorMessage = ref('')

    const loadWinners = () => {
      const winnersData = localStorage.getItem('winners')
      if (winnersData) {
        winners.value = JSON.parse(winnersData)
      }
    }

    watch(
      winners,
      (newWinners) => {
        localStorage.setItem('winners', JSON.stringify(newWinners))
      },
      { deep: true }
    )

    loadWinners()

    const onAddWinner = (winner) => {
      const emailExists = winners.value.some((w) => w.email === winner.email)

      if (emailExists) {
        errorMessage.value = 'A winner with this email already exists.'
        showErrorModal.value = true
        return
      }

      winners.value.push(winner)
      showSuccessModal.value = true
    }

    const openDeleteConfirmation = (winner) => {
      participantToDelete.value = winner
      showDeleteModal.value = true
    }

    const closeDeleteModal = () => {
      showDeleteModal.value = false
      participantToDelete.value = null
    }

    const deleteParticipant = () => {
      winners.value = winners.value.filter(
        (winner) => winner.email !== participantToDelete.value.email
      )
      showDeleteModal.value = false
    }

    const openEditWinnerModal = (winner) => {
      editForm.value = { ...winner }
      showEditModal.value = true
    }

    const closeEditModal = () => {
      showEditModal.value = false
      editForm.value = {
        name: '',
        dob: '',
        email: '',
        phone: ''
      }
    }

    const updateWinner = () => {
      const index = winners.value.findIndex((w) => w.email === editForm.value.email)

      if (index !== -1) {
        winners.value[index] = { ...editForm.value }
        closeEditModal()
      }
    }

    const selectRandomWinner = () => {
      if (winners.value.length === 0 || selectedWinners.value.length >= 3) return

      const availableWinners = winners.value.filter(
        (winner) => !selectedWinners.value.find((w) => w.email === winner.email)
      )

      if (availableWinners.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableWinners.length)
        selectedWinners.value.push(availableWinners[randomIndex])
      }
    }

    const removeWinner = (index) => {
      selectedWinners.value.splice(index, 1)
    }

    const filterByName = (name) => {
      searchTerm.value = name
    }

    const filteredWinners = computed(() => {
      if (!searchTerm.value) {
        return winners.value
      }
      const search = searchTerm.value.toLowerCase()
      return winners.value.filter((winner) => winner.name.toLowerCase().includes(search))
    })

    return {
      winners,
      selectedWinners,
      onAddWinner,
      showSuccessModal,
      showErrorModal,
      showDeleteModal,
      showEditModal,
      editForm,
      participantToDelete,
      errorMessage,
      selectRandomWinner,
      removeWinner,
      openDeleteConfirmation,
      closeDeleteModal,
      deleteParticipant,
      openEditWinnerModal,
      closeEditModal,
      updateWinner,
      filterByName,
      searchTerm,
      filteredWinners
    }
  }
}
</script>

<style>
body {
  background-color: rgba(207, 207, 207, 0.2);
  box-sizing: border-box;
}
</style>
