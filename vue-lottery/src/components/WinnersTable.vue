<template>
  <div class="table-responsive">
    <table class="table table-bordered text-center">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Date of Birth</th>
          <th>Email</th>
          <th>Phone number</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(winner, index) in winners" :key="index">
          <td class="align-middle">{{ index + 1 }}</td>
          <td class="align-middle">{{ winner.name }}</td>
          <td class="align-middle">{{ winner.dob }}</td>
          <td class="align-middle">{{ winner.email }}</td>
          <td class="align-middle">{{ winner.phone }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    winners: {
      type: Array,
      required: true
    }
  }
}
</script>
