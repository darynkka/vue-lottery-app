<template>
  <div class="table-responsive">
    <table class="table table-bordered">
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
          <td>{{ index + 1 }}</td>
          <td>{{ winner.name }}</td>
          <td>{{ winner.dob }}</td>
          <td>{{ winner.email }}</td>
          <td>{{ winner.phone }}</td>
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

<style scoped>
table th,
td {
  text-align: center;
  vertical-align: middle;
}
</style>
