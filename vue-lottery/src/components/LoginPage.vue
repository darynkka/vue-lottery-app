<template>
  <div class="container d-flex align-items-center justify-content-center vh-100">
    <div class="card p-4 mb-4" style="max-width: 800px; width: 100%">
      <h5 class="card-title" v-if="!isAuthenticated">LOGIN FORM</h5>
      <h5 v-else class="d-flex justify-content-start">Welcome!</h5>
      <p class="text-muted" v-if="!isAuthenticated">Please fill in all the fields.</p>

      <form v-if="!isAuthenticated" @submit.prevent="handleSubmit">
        <FormInput
          id="name"
          label="Name"
          v-model="name"
          placeholder="Enter user name"
          :error="errors.name"
          :disabled="isSubmitting"
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          v-model="password"
          :error="errors.password"
          :disabled="isSubmitting"
        />
        <div class="text-end">
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">Login</button>
        </div>
      </form>

      <custom-modal v-if="showModal" @close="closeModal">
        <template #header>Login Successful</template>
        <template #body>
          <p>You have logged in successfully!</p>
        </template>
        <template #footer>
          <button @click="closeModal" class="btn btn-primary">OK</button>
        </template>
      </custom-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import FormInput from './FormInput.vue'
import CustomModal from './CustomModal.vue'
import { ref, computed } from 'vue'
import { authService } from '@/AuthService'

const name = ref('')
const password = ref('')
const isSubmitting = ref(false)
const errors = ref({ name: '', password: '' })
const showModal = ref(false)

const isAuthenticated = computed(() => authService.isAuthenticated())

const handleSubmit = async () => {
  errors.value.name = name.value ? '' : 'Name is required.'
  errors.value.password = password.value ? '' : 'Password is required.'

  if (!errors.value.name && !errors.value.password) {
    isSubmitting.value = true
    const result = await authService.login(name.value, password.value)

    if (!result.success) {
      errors.value.password = result.error ?? 'An error occurred. Please try again.'
    } else {
      showModal.value = true // Show the modal
      // No need to set authService.userAuthenticated.value = true; it's already handled in AuthService
    }

    isSubmitting.value = false
  }
}

function closeModal() {
  showModal.value = false
}
</script>

<style scoped>
.card-title {
  display: flex;
  justify-content: flex-start;
}
</style>
