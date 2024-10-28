import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/HomePage.vue'
import Lottery from '../components/LotteryPage.vue'
import Login from '../components/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../components/AboutPage.vue')
    },
    {
      path: '/lottery',
      name: 'Lottery',
      component: Lottery
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    }
  ]
})

export default router
