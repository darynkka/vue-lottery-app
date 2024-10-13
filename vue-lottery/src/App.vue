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
    <WinnersTable :winners="filteredWinners" :searchTerm="searchTerm" />

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
import { ref, computed, onMounted } from 'vue'
import WinnersTable from './components/WinnersTable.vue'
import WinnerForm from './components/WinnerForm.vue'
import WinnersList from './components/WinnersList.vue'
import WinnerButton from './components/WinnerButton.vue'
import SearchBar from './components/SearchBar.vue'
import CustomModal from './components/Modal.vue'

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
    const errorMessage = ref('')

    onMounted(() => {
      const winnersData = localStorage.getItem('winners')
      if (winnersData) {
        winners.value = JSON.parse(winnersData)
      }
    })
    const onAddWinner = (winner) => {
      const emailExists = winners.value.some((w) => w.email === winner.email)

      if (emailExists) {
        errorMessage.value = 'A winner with this email already exists.'
        showErrorModal.value = true
        return
      }

      winners.value.push(winner)
      localStorage.setItem('winners', JSON.stringify(winners.value))
      showSuccessModal.value = true
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
      errorMessage,
      selectRandomWinner,
      removeWinner,
      filterByName,
      searchTerm,
      filteredWinners
    }
  }
}
</script>
