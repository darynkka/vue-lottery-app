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
        id="dob"
        label="Date of Birth"
        v-model="dob"
        type="date"
        :error="errors.dob"
        :disabled="isSubmitting"
      />
      <FormInput
        id="email"
        label="Email"
        v-model="email"
        type="email"
        :error="errors.email"
        :disabled="!!initialData || isSubmitting"
      />
      <FormInput
        id="phone"
        label="Phone number"
        v-model="phone"
        type="tel"
        :error="errors.phone"
        :disabled="isSubmitting"
      />
      <div class="text-end">
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : submitButtonText || 'Save' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FormInput from './FormInput.vue'
import WinnerRepository from '../WinnerRepository'

const props = defineProps({
  initialData: { type: Object },
  submitButtonText: { type: String, default: 'Save' }
})

const emit = defineEmits(['winner-added', 'winner-updated'])
const name = ref('')
const dob = ref('')
const email = ref('')
const phone = ref('')
const errors = ref({})
const isSubmitting = ref(false)

onMounted(() => {
  if (props.initialData) {
    name.value = props.initialData.name
    dob.value = props.initialData.dob
    email.value = props.initialData.email
    phone.value = props.initialData.phone
  }
})

const clearForm = () => {
  name.value = ''
  dob.value = ''
  email.value = ''
  phone.value = ''
  errors.value = {}
}

const onSubmit = async () => {
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    errors.value = {}

    const winnerData = {
      name: name.value,
      dob: dob.value,
      email: email.value.toLowerCase(),
      phone: phone.value
    }

    const result = props.initialData
      ? emit('winner-updated', winnerData)
      : emit('winner-added', winnerData)

    if (result) {
      if (!props.initialData) {
        clearForm()
      }
    }
  } catch (error) {
    console.error('Error in form submission:', error)
    errors.value = { submit: error.message }
  } finally {
    isSubmitting.value = false
  }
}
</script>
