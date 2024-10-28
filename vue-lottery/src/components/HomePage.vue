<template>
  <div>
    <h1>Welcome to Home Page</h1>
    <button @click="openUserModal(userId)" class="btn btn-success">Show User Info</button>

    <CustomModal v-if="showModal" @close="closeModal">
      <template #header> User Details </template>
      <template #body>
        <div>
          <p><strong>ID:</strong> {{ selectedUser.id }}</p>
          <p><strong>Name:</strong> {{ selectedUser.name }}</p>
          <p><strong>Email:</strong> {{ selectedUser.email }}</p>
          <p><strong>Password:</strong> {{ selectedUser.password }}</p>
          <p><strong>Role:</strong> {{ selectedUser.role }}</p>
        </div>
      </template>
    </CustomModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import CustomModal from '../components/CustomModal.vue'
import WinnerRepository from '../WinnerRepository'

const showModal = ref(false)
const selectedUser = ref({})
const userRepository = new WinnerRepository()

const route = useRoute()
const userId = route.params.id
async function openUserModal() {
  const userInfo = await userRepository.findById(userId)

  if (userInfo) {
    selectedUser.value = userInfo
    showModal.value = true
  } else {
    console.error('User not found')
  }
}

function closeModal() {
  showModal.value = false
}
</script>
