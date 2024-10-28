import { ref } from 'vue'

export interface IWinner {
  id: number
  name: string
  email: string
  password: string
  role: string
}

class WinnerRepository {
  public storageKey = 'winners'
  public userAuthenticated = ref<IWinner[]>([])

  private validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  private validatePassword(password: string): boolean {
    return password && password.length >= 6 ? true : false
  }

  public getAllWinners(): IWinner[] {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : []
    } catch {
      localStorage.removeItem(this.storageKey)
      return []
    }
  }

  public findByEmail(email: string): IWinner | null {
    if (!email?.trim()) return null
    const normalizedEmail = email.toLowerCase().trim()
    const winners = this.getAllWinners()
    return winners.find((w) => w.email.toLowerCase().trim() === normalizedEmail) || null
  }

  private validateWinner(winner: IWinner): {
    isValid: boolean
    errors?: Record<string, string>
  } {
    const errors: Record<string, string> = {}

    if (!winner.name?.trim()) {
      errors.name = 'Name is required'
    }

    if (!winner.email?.trim()) {
      errors.email = 'Email is required'
    } else if (!this.validateEmail(winner.email)) {
      errors.email = 'Invalid email format'
    }

    if (!winner.password?.trim()) {
      errors.password = 'Password is required'
    } else if (!this.validatePassword(winner.password)) {
      errors.password = 'Password must be at least 6 characters long'
    }

    if (!winner.role?.trim()) {
      errors.role = 'Role is required'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length ? errors : undefined
    }
  }

  public async addWinner(winnerData: IWinner): Promise<{
    success: boolean
    error?: string
  }> {
    const normalizedEmail = winnerData.email.toLowerCase().trim()
    const existingWinner = this.findByEmail(normalizedEmail)

    if (existingWinner) {
      return {
        success: false,
        error: 'A winner with this email already exists'
      }
    }

    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: winnerData.name.trim(),
          email: normalizedEmail,
          password: winnerData.password,
          role: winnerData.role,
          avatar:
            'https://www.wfla.com/wp-content/uploads/sites/71/2023/05/GettyImages-1389862392.jpg?w=2560&h=1440&crop=1'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.message || 'Failed to create winner on the server.'
        }
      }

      const newWinner = await response.json()
      const winners = this.getAllWinners()
      winners.push({
        id: newWinner.id,
        name: newWinner.name,
        email: newWinner.email,
        password: winnerData.password,
        role: newWinner.role
      })

      localStorage.setItem(this.storageKey, JSON.stringify(winners))
      return { success: true }
    } catch (error) {
      console.error('Failed to save winner:', error)
      return {
        success: false,
        error: 'Failed to save winner. Please check your connection and try again.'
      }
    }
  }

  public async updateWinner(winner: IWinner): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const normalizedEmail = winner.email.toLowerCase().trim()
      const existingWinner = this.findByEmail(normalizedEmail)

      if (!existingWinner) {
        return {
          success: false,
          error: 'Winner not found'
        }
      }

      const response = await fetch(`https://api.escuelajs.co/api/v1/users/${winner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: winner.name.trim(),
          email: normalizedEmail,
          password: winner.password,
          role: winner.role
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.message || 'Failed to update winner on the server.'
        }
      }

      const updatedWinner = await response.json()

      const winners = this.getAllWinners()
      const index = winners.findIndex((w) => w.id === winner.id)
      if (index !== -1) {
        winners[index] = {
          id: updatedWinner.id,
          name: updatedWinner.name,
          email: updatedWinner.email,
          password: winner.password,
          role: updatedWinner.role
        }
        this.userAuthenticated.value = [...winners]
        localStorage.setItem(this.storageKey, JSON.stringify(winners))
      }

      return { success: true }
    } catch (error) {
      console.error('Failed to update winner:', error)
      return {
        success: false,
        error: 'Failed to update winner. Please check your connection and try again.'
      }
    }
  }

  public deleteWinner(email: string): { success: boolean; error?: string } {
    if (!email?.trim()) {
      return { success: false, error: 'Invalid email.' }
    }

    try {
      const normalizedEmail = email.toLowerCase().trim()
      const winners = this.getAllWinners()
      const updatedWinners = winners.filter((w) => w.email.toLowerCase().trim() !== normalizedEmail)

      if (winners.length === updatedWinners.length) {
        return { success: false, error: 'Winner not found.' }
      }

      localStorage.setItem(this.storageKey, JSON.stringify(updatedWinners))
      return { success: true }
    } catch (error) {
      console.error('Failed to delete winner:', error)
      return { success: false, error: 'Failed to delete winner. Please try again.' }
    }
  }

  public searchByName(searchTerm: string): IWinner[] {
    if (!searchTerm?.trim()) return this.getAllWinners()

    return this.getAllWinners().filter((w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    )
  }

  public getRandomWinners(count: number, excludeEmails: string[] = []): IWinner[] {
    if (count <= 0) return []

    const normalizedExcludeEmails = excludeEmails.map((email) => email.toLowerCase().trim())
    const eligibleWinners = this.getAllWinners().filter(
      (w) => !normalizedExcludeEmails.includes(w.email.toLowerCase().trim())
    )

    if (eligibleWinners.length === 0) return []

    const result: IWinner[] = []
    const available = [...eligibleWinners]

    for (let i = 0; i < count && available.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * available.length)
      result.push(available.splice(randomIndex, 1)[0])
    }

    return result
  }

  public sortWinners(winners: IWinner[], sortBy: string, order: string): IWinner[] {
    if (!winners?.length) return []

    const factor = order === 'asc' ? 1 : -1
    return [...winners].sort((a, b) => {
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '') * factor
      }
      return 0
    })
  }

  public fetchUsers(): void {
    fetch('https://api.escuelajs.co/api/v1/users?limit=5')
      .then((response) => response.json())
      .then((data) => {
        const winners = data.map(
          (winner: {
            id: number
            name: string
            email: string
            password: string
            role: string
          }) => ({
            id: winner.id,
            name: winner.name,
            email: winner.email,
            password: winner.password,
            role: winner.role
          })
        )

        localStorage.setItem(this.storageKey, JSON.stringify(winners))
      })
      .catch((error) => {
        console.error('Failed to fetch users:', error)
      })
  }

  public async findById(id: number): Promise<IWinner | null> {
    try {
      const response = await fetch(`https://api.escuelajs.co/api/v1/users/${id}`)

      if (!response.ok) {
        throw new Error('User not found')
      }

      const userData = await response.json()
      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role
      } as IWinner
    } catch (error) {
      console.error('Failed to fetch user by ID:', error)
      return null
    }
  }
}

export default WinnerRepository
