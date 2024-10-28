<template>
  <div class="container d-flex align-items-center justify-content-center vh-100">
    <div class="card p-4 mb-4" style="max-width: 800px; width: 100%">
      <h5 class="card-title">LOGIN FORM</h5>
      <p class="text-muted">Please fill in all the fields.</p>
      <form @submit.prevent="handleSubmit">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import FormInput from './FormInput.vue'
import { ref } from 'vue'

const name = ref('')
const password = ref('')
const isSubmitting = ref(false)
const errors = ref({ name: '', password: '' })

const handleSubmit = () => {
  errors.value.name = name.value ? '' : 'Name is required.'
  errors.value.password = password.value ? '' : 'Password is required.'

  if (!errors.value.name && !errors.value.password) {
    isSubmitting.value = true
    console.log('Submitting...', { name: name.value, password: password.value })
    isSubmitting.value = false
  }
}
</script>
