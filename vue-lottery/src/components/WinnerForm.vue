<template>
  <div class="card p-4 mb-4">
    <h5 class="card-title">{{ initialData ? 'EDIT FORM' : 'REGISTER FORM' }}</h5>
    <p class="text-muted">Please fill in all the fields.</p>
    <form @submit.prevent="onSubmit" :class="{ submitting: isSubmitting }">
      <FormInput
        id="name"
        label="Name"
        v-model="name"
        placeholder="Enter user name"
        :error="errors.name"
        :disabled="isSubmitting"
      />
      <FormInput
        id="email"
        label="Email"
        v-model="email"
        placeholder="Enter user email"
        type="email"
        :error="errors.email"
        :disabled="!!initialData || isSubmitting"
      />
      <FormInput
        id="role"
        label="Role"
        v-model="role"
        placeholder="Enter user role"
        type="role"
        :error="errors.role"
        :disabled="!!initialData || isSubmitting"
      />
      <FormInput
        id="password"
        label="Password"
        v-model="password"
        placeholder="Enter user password"
        type="password"
        :error="errors.password"
        :disabled="!!initialData || isSubmitting"
      />
      <div class="text-end">
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : submitButtonText || 'Save' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, PropType } from 'vue'
import FormInput from './FormInput.vue'
import type { IWinner } from '@/WinnerRepository'

const props = defineProps({
  initialData: { type: Object as PropType<IWinner> },
  submitButtonText: { type: String, default: 'Save' }
})

const emit = defineEmits(['winner-added', 'winner-updated'])

const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const role = ref<string>('')
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

onMounted(() => {
  if (props.initialData) {
    name.value = props.initialData.name
    email.value = props.initialData.email
    password.value = props.initialData.password
    role.value = props.initialData.role
  }
})

const clearForm = () => {
  name.value = ''
  email.value = ''
  password.value = ''
  role.value = ''
  errors.value = {}
}

const onSubmit = async () => {
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    errors.value = {}

    const winnerData: IWinner = {
      id: props.initialData?.id || 0,
      name: name.value,
      email: email.value.toLowerCase(),
      password: password.value,
      role: role.value
    }

    if (props.initialData) {
      emit('winner-updated', winnerData)
    } else {
      emit('winner-added', winnerData)
      clearForm()
    }
  } catch (error) {
    console.error('Error in form submission:', error)
    if (error instanceof Error) {
      errors.value = { submit: error.message }
    } else {
      errors.value = { submit: 'An unknown error occurred.' }
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
