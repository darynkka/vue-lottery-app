import axios from 'axios'
import { ref } from 'vue'
import AppNavigation from './components/AppNavigation.vue'

export interface AuthResponse {
  success: boolean
  error?: string
  email?: string
}

export class AuthService {
  private accessTokenKey = 'access_token'
  private refreshTokenKey = 'refresh_token'

  public userAuthenticated = ref(false)

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Invalid credentials')
      }

      const data = await response.json()
      localStorage.setItem(this.accessTokenKey, data.access_token)
      localStorage.setItem(this.refreshTokenKey, data.refresh_token)
      this.userAuthenticated.value = true

      return { success: true, email }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'
      return { success: false, error: message }
    }
  }

  logout() {
    localStorage.removeItem(this.accessTokenKey)
    localStorage.removeItem(this.refreshTokenKey)
    this.userAuthenticated.value = false
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.accessTokenKey)
  }
}

export const authService = new AuthService()
