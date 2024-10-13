<template>
  <div class="card p-4 mb-4">
    <h5 class="card-title">REGISTER FORM</h5>
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
      <FormInput id="email" label="Email" v-model="email" type="email" :error="errors.email" />
      <FormInput id="phone" label="Phone number" v-model="phone" type="tel" :error="errors.phone" />
      <div class="text-end">
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import FormInput from './FormInput.vue'

export default {
  components: {
    FormInput
  },
  setup(props, { emit }) {
    const name = ref('')
    const dob = ref('')
    const email = ref('')
    const phone = ref('')
    const errors = ref({})

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

      name.value = ''
      dob.value = ''
      email.value = ''
      phone.value = ''
    }

    return {
      name,
      dob,
      email,
      phone,
      errors,
      onSubmit
    }
  }
}
</script>
