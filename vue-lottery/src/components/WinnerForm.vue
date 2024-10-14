<template>
  <div class="card p-4 mb-4">
    <h5 class="card-title">{{ initialData ? 'EDIT FORM' : 'REGISTER FORM' }}</h5>
    <p class="text-muted">Please fill in all the fields.</p>
    <form @submit.prevent="onSubmit" @keyup.enter="onSubmit">
      <FormInput
        id="name"
        label="Name"
        v-model="name"
        placeholder="Enter user name"
        :error="errors.name"
      />
      <FormInput id="dob" label="Date of Birth" v-model="dob" type="date" :error="errors.dob" />
      <FormInput id="email" label="Email" v-model="email" type="email" :error="errors.email" />
      <FormInput id="phone" label="Phone number" v-model="phone" type="tel" :error="errors.phone" />
      <div class="text-end">
        <button type="submit" class="btn btn-primary">{{ submitButtonText || 'Save' }}</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FormInput from './FormInput.vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  },
  submitButtonText: {
    type: String,
    default: 'Save'
  }
})

const emit = defineEmits(['add-winner'])

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

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const validatePhone = (phone) => {
  const regex = /^\+?[0-9]{10,15}$/
  return regex.test(phone)
}

const onSubmit = () => {
  errors.value = {}

  if (!name.value) {
    errors.value.name = 'Name is required.'
  }
  if (!dob.value) {
    errors.value.dob = 'Date of Birth is required.'
  } else if (new Date(dob.value) > new Date()) {
    errors.value.dob = 'Date of Birth cannot be in the future.'
  }
  if (!email.value) {
    errors.value.email = 'Email is required.'
  } else if (!validateEmail(email.value)) {
    errors.value.email = 'Invalid email format.'
  }
  if (!phone.value) {
    errors.value.phone = 'Phone number is required.'
  } else if (!validatePhone(phone.value)) {
    errors.value.phone = 'Invalid phone number format.'
  }

  if (Object.keys(errors.value).length > 0) {
    return
  }

  emit('add-winner', {
    name: name.value,
    dob: dob.value,
    email: email.value,
    phone: phone.value
  })

  if (!props.initialData) {
    name.value = ''
    dob.value = ''
    email.value = ''
    phone.value = ''
  }
}
</script>
