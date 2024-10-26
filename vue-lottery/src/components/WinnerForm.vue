<template>
  <div class="card p-4 mb-4">
    <h5 class="card-title">{{ initialData ? 'EDIT FORM' : 'REGISTER FORM' }}</h5>
    <p class="text-muted">Please fill in all the fields.</p>
    <form @submit.prevent="onSubmit">
      <FormInput
        id="name"
        label="Name"
        v-model="name"
        placeholder="Enter user name"
        :error="errors.name"
      />
      <FormInput id="dob" label="Date of Birth" v-model="dob" type="date" :error="errors.dob" />
      <FormInput
        id="email"
        label="Email"
        v-model="email"
        type="email"
        :error="errors.email"
        :disabled="!!initialData"
      />
      <FormInput id="phone" label="Phone number" v-model="phone" type="tel" :error="errors.phone" />
      <div class="text-end">
        <button type="submit" class="btn btn-primary">
          {{ submitButtonText || 'Save' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FormInput from './FormInput.vue'
import Winner from '../Winner'
import WinnerService from '../WinnerService'

const props = defineProps({
  initialData: { type: Object },
  submitButtonText: { type: String, default: 'Save' }
})

const emit = defineEmits(['winner-added', 'winner-updated'])

const winnerService = new WinnerService()

const name = ref('')
const dob = ref('')
const email = ref('')
const phone = ref('')
const errors = ref({})

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
  try {
    errors.value = {}

    const winnerData = {
      name: name.value,
      dob: dob.value,
      email: email.value.toLowerCase(), // Нормалізуємо email
      phone: phone.value
    }

    const winner = new Winner(winnerData.name, winnerData.dob, winnerData.email, winnerData.phone)

    if (props.initialData) {
      const result = await winnerService.updateWinner(winner)
      if (result.isValid) {
        emit('winner-updated', winner)
      } else {
        errors.value = result.errors
      }
    } else {
      const result = await winnerService.addWinner(winner)
      if (result.isValid) {
        emit('winner-added', winner)
        clearForm()
      } else {
        errors.value = result.errors
      }
    }
  } catch (error) {
    console.error('Error in form submission:', error)
    errors.value = { submit: error.message }
  }
}
</script>
