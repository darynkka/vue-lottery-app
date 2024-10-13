<template>
  <div class="table-responsive">
    <table class="table table-bordered text-center">
      <thead>
        <tr>
          <th>#</th>
          <th>
            Name
            <button
              class="btn"
              @click="$emit('sort', 'name')"
              style="background: transparent; border: none; width: 20px; height: 20px"
            >
              <i class="bi bi-sort-alpha-down" style="color: red; font-size: 2rem"></i>
            </button>
          </th>
          <th>
            Date of Birth
            <button
              class="btn"
              @click="$emit('sort', 'dob')"
              style="background: transparent; border: none; width: 20px; height: 20px"
            >
              <i class="bi bi-sort-down" style="color: black; font-size: 1.5rem"></i>
            </button>
          </th>
          <th>Email</th>
          <th>Phone number</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(winner, index) in winners" :key="index">
          <td class="align-middle">{{ index + 1 }}</td>
          <td class="align-middle">{{ winner.name }}</td>
          <td class="align-middle">{{ winner.dob }}</td>
          <td class="align-middle">{{ winner.email }}</td>
          <td class="align-middle">{{ winner.phone }}</td>
          <td class="align-middle">
            <button class="btn btn-sm btn-primary me-2" @click="$emit('edit-winner', winner)">
              Edit
            </button>
            <button class="btn btn-sm btn-danger" @click="$emit('confirm-delete', winner)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    winners: Array,
    searchTerm: String
  },
  emits: ['edit-winner', 'confirm-delete', 'sort']
}
</script>
