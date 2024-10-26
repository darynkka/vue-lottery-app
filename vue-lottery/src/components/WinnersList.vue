<template>
  <div class="winners-box p-2 d-flex align-items-center">
    <div class="d-flex flex-wrap gap-2 justify-content-center align-items-center">
      <WinnerItem
        v-for="(winner, index) in winners"
        :key="index"
        :winner="winner"
        @remove="removeWinner(index)"
      />
    </div>
  </div>
</template>

<script setup>
import WinnerItem from './WinnerItem.vue'

const props = defineProps({ winners: { type: Array, required: true } })
const emit = defineEmits(['remove-winner'])

const removeWinner = (index) => {
  emit('remove-winner', index)
}
</script>

<style scoped>
.winners-box {
  border: 1px solid gray;
  width: 80%;
  min-height: 40px;
}
</style>
