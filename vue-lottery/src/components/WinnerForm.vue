<template>
  <div class="card p-4 mb-4">
    <h5 class="card-title">REGISTER FORM</h5>
    <p class="text-muted">Please fill in all the fields.</p>
    <form @submit.prevent="onSubmit">
      <div class="form-group mb-3">
        <label for="name">Name</label>
        <input
          type="text"
          class="form-control"
          v-model="name"
          placeholder="Enter user name"
          :class="{ 'is-invalid': errors.name }"
        />
        <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
      </div>
      <div class="form-group mb-3">
        <label for="dob">Date of Birth</label>
        <input
          type="date"
          class="form-control"
          v-model="dob"
          :class="{ 'is-invalid': errors.dob }"
        />
        <div v-if="errors.dob" class="invalid-feedback">{{ errors.dob }}</div>
      </div>
      <div class="form-group mb-3">
        <label for="email">Email</label>
        <input
          type="email"
          class="form-control"
          v-model="email"
          :class="{ 'is-invalid': errors.email }"
        />
        <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
      </div>
      <div class="form-group mb-3">
        <label for="phone">Phone number</label>
        <input
          type="tel"
          class="form-control"
          v-model="phone"
          :class="{ 'is-invalid': errors.phone }"
        />
        <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
      </div>

      <div class="text-end">
        <button type="submit" class="btn btn-primary rounded-1">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
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

<style scoped>
.card {
  max-width: 800px;
  margin: 0 auto;
}
input {
  background-color: rgba(207, 207, 207, 0.2);
}
</style>
