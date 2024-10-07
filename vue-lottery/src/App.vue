<template>
  <div class="container my-4">
    <div class="new-winner-block d-flex justify-content-between align-items-center mb-3 rounded-0">
      <input type="text" class="form-control w-75" placeholder="Winners" />
      <button class="btn btn-primary">New winner</button>
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
    const showSuccessModal = ref(false)

    const onAddWinner = (winner) => {
      winners.value.push(winner)
      showSuccessModal.value = true
    }

    return {
      winners,
      onAddWinner,
      showSuccessModal
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.card {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #00bff3;
  border: none;
}

input,
button {
  border-radius: 0;
}

.new-winner-block {
  background-color: white;
  padding: 15px;
  border-radius: 5px;
  width: 100%;
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
