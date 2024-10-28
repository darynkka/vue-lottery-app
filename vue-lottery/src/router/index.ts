import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/HomePage.vue'
import Lottery from '../components/LotteryPage.vue'
import Login from '../components/LoginPage.vue'
import { authService } from '../AuthService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'users/:id',
          name: 'UserDetails',
          component: () => import('../components/CustomModal.vue')
        }
      ]
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../components/AboutPage.vue')
    },
    {
      path: '/lottery',
      name: 'Lottery',
      component: Lottery,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      redirect: '/login'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authService.isAuthenticated()) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
