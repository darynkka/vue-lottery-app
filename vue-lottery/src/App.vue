<template>
  <div class="container my-4">
    <div class="bg-white mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <WinnersList :winners="selectedWinners" @remove-winner="removeWinner" />
        <NewWinnerButton
          @select-winner="selectRandomWinner"
          :disabled="winners.length === 0 || selectedWinners.length >= 3"
        />
      </div>
    </div>

    <RegistrationForm @add-winner="onAddWinner" />
    <WinnersTable :winners="winners" />

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
import { ref } from 'vue'
import WinnersTable from './components/WinnersTable.vue'
import RegistrationForm from './components/WinnerForm.vue'
import WinnersList from './components/WinnersList.vue'
import NewWinnerButton from './components/WinnerButton.vue'

export default {
  components: {
    WinnersTable,
    RegistrationForm,
    WinnersList,
    NewWinnerButton
  },
  setup() {
    const winners = ref([])
    const selectedWinners = ref([])
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

    return {
      winners,
      selectedWinners,
      onAddWinner,
      showSuccessModal,
      selectRandomWinner,
      removeWinner
    }
  }
}
</script>

<style>
body {
  background-color: rgba(207, 207, 207, 0.2);
}
</style>
