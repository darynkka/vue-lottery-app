<template>
  <div class="container my-4">
    <div class="new-winner-block d-flex justify-content-between align-items-center mb-3 rounded-0">
      <input type="text" class="form-control w-75" placeholder="Winners" />
      <button class="btn btn-primary">New winner</button>
    </div>

    <WinnerForm />
    <WinnersTable :winners="winners" />
  </div>
</template>

<script>
import { ref } from 'vue'
import WinnersTable from './components/WinnersTable.vue'
import WinnerForm from './components/WinnerForm.vue'

export default {
  components: {
    WinnersTable,
    WinnerForm
  },
  setup() {
    const name = ref('')
    const dob = ref('')
    const email = ref('')
    const phone = ref('')

    const winners = ref([])

    const onSubmit = () => {
      winners.value.push({
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
      winners,
      onSubmit
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.card {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #00bff3;
  border: none;
}

input,
button {
  border-radius: 0;
}
.text-end {
  text-align: right;
}

.new-winner-block {
  background-color: white;
  padding: 15px;
  border-radius: 5px;
  width: 100%;
}
</style>
