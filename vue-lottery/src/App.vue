<template>
  <div class="container my-4">
    <div class="white-wrapper">
      <div class="new-winner-block d-flex justify-content-between align-items-center">
        <div class="winners-box">
          <div
            class="winners-content d-flex flex-wrap gap-2 justify-content-center align-items-center"
          >
            <button
              v-for="(winner, index) in selectedWinners"
              :key="index"
              class="btn btn-primary d-flex align-items-center"
            >
              {{ winner.name }}
              <span class="close-btn" @click.stop="removeWinner(index)">&times;</span>
            </button>
          </div>
        </div>
        <button
          class="btn btn-primary"
          @click="selectRandomWinner"
          :disabled="winners.length === 0 || selectedWinners.length >= 3"
        >
          New winner
        </button>
      </div>
    </div>

    <WinnerForm @add-winner="onAddWinner" />
    <WinnersTable :winners="winners" />

    <div v-if="showSuccessModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showSuccessModal = false">&times;</span>
        <p>Winner added successfully!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import WinnersTable from './components/WinnersTable.vue'
import WinnerForm from './components/WinnerForm.vue'

export default {
  components: {
    WinnersTable,
    WinnerForm
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

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.white-wrapper {
  background-color: white;
  max-width: 800px;
  margin-bottom: 1rem;
}

.new-winner-block {
  padding: 15px;
  width: 100%;
}

.winners-box {
  border: 1px solid gray;
  width: 80%;
  min-height: 40px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
}
.winners-content {
  min-height: 28px;
}
.card {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #00bff3;
  border: none;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

input,
button {
  border-radius: 0;
}

.close-btn {
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  margin-left: 8px;
}

.close-btn:hover {
  opacity: 0.8;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  position: relative;
}

.modal-content p {
  margin: 0;
}

.close {
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>

<style>
body {
  background-color: rgba(207, 207, 207, 0.2);
  box-sizing: border-box;
}
</style>
