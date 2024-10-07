<template>
  <div class="card p-4 mb-4">
    <h5 class="card-title">REGISTER FORM</h5>
    <p class="text-muted">Please fill in all the fields.</p>
    <form @submit.prevent="onSubmit">
      <div class="form-group mb-3">
        <label for="name">Name</label>
        <input type="text" class="form-control" v-model="name" placeholder="Enter user name" />
      </div>
      <div class="form-group mb-3">
        <label for="dob">Date of Birth</label>
        <input type="date" class="form-control" v-model="dob" placeholder="mm/dd/yyyy" />
      </div>
      <div class="form-group mb-3">
        <label for="email">Email</label>
        <input type="email" class="form-control" v-model="email" placeholder="Enter email" />
      </div>
      <div class="form-group mb-3">
        <label for="phone">Phone number</label>
        <input type="tel" class="form-control" v-model="phone" placeholder="Enter phone number" />
      </div>

      <div class="text-end">
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const name = ref('')
    const dob = ref('')
    const email = ref('')
    const phone = ref('')

    const onSubmit = () => {
      console.log({
        name: name.value,
        dob: dob.value,
        email: email.value,
        phone: phone.value
      })
    }
    return {
      name,
      dob,
      email,
      phone,
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
