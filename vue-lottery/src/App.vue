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

    <div v-if="showSuccessModal" class="modal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Success</h5>
            <button type="button" class="btn-close" @click="showSuccessModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Winner added successfully!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import WinnersTable from './components/WinnersTable.vue'
import WinnerForm from './components/WinnerForm.vue'
import WinnersList from './components/WinnersList.vue'
import WinnerButton from './components/WinnerButton.vue'
import SearchBar from './components/SearchBar.vue'

export default {
  components: {
    WinnersTable,
    WinnerForm,
    WinnersList,
    WinnerButton,
    SearchBar
  },
  setup() {
    const winners = ref([])
    const selectedWinners = ref([])
    const searchTerm = ref('')
    const showSuccessModal = ref(false)

    const onAddWinner = (winner) => {
      winners.value.push(winner)
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
      selectRandomWinner,
      removeWinner,
      filterByName,
      searchTerm,
      filteredWinners
    }
  }
}
</script>
