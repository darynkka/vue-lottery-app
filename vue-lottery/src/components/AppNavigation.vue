<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">LAB 8</a>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/home">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/lottery">Lottery</router-link>
          </li>
          <template v-if="isAuthenticated">
            <li class="nav-item">
              <button @click="handleLogout" class="nav-link btn btn-link text-bg-danger">
                Logout
              </button>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { authService } from '@/AuthService'
import { useRouter } from 'vue-router'

const isAuthenticated = ref(authService.isAuthenticated())

watch(
  () => authService.userAuthenticated.value,
  (newValue) => {
    isAuthenticated.value = newValue
  }
)

const router = useRouter()

const handleLogout = () => {
  authService.logout()
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  cursor: pointer;
}
</style>
