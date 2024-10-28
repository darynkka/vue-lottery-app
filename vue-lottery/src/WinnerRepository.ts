export interface IWinner {
  id: number
  name: string
  email: string
  password: string
  role: string
}

class WinnerRepository {
  public storageKey = 'winners'

  private validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  private validatePassword(password: string): boolean {
    return password && password.length >= 6 ? true : false
  }

  private validateWinner(winner: Partial<IWinner>): {
    isValid: boolean
    errors?: Record<string, string>
  } {
    const errors: Record<string, string> = {}

    if (!winner.name?.trim()) errors.name = 'Name is required.'
    if (!winner.email?.trim()) {
      errors.email = 'Email is required.'
    } else if (!this.validateEmail(winner.email)) {
      errors.email = 'Invalid email format.'
    }
    if (!winner.password?.trim()) {
      errors.password = 'Password is required.'
    } else if (!this.validatePassword(winner.password)) {
      errors.password = 'Password must be at least 6 characters long.'
    }
    if (!winner.role?.trim()) {
      errors.role = 'Role is required.'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length ? errors : undefined
    }
  }

  private clearStorage(): void {
    localStorage.removeItem(this.storageKey)
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

  private getNextId(): number {
    const winners = this.getAllWinners()
    return winners.length > 0 ? Math.max(...winners.map((w) => w.id)) + 1 : 1
  }

  public findByEmail(email: string): IWinner | null {
    if (!email?.trim()) return null
    const normalizedEmail = email.toLowerCase().trim()
    const winners = this.getAllWinners()
    return winners.find((w) => w.email.toLowerCase().trim() === normalizedEmail) || null
  }

  public addWinner(winnerData: IWinner): { success: boolean; errors?: Record<string, string> } {
    if (!winnerData) {
      return { success: false, errors: { general: 'Invalid winner data.' } }
    }

    const validation = this.validateWinner(winnerData)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    const normalizedEmail = winnerData.email.toLowerCase().trim()
    const existingWinner = this.findByEmail(normalizedEmail)

    if (existingWinner) {
      return {
        success: false,
        errors: { email: 'A winner with this email already exists.' }
      }
    }

    try {
      const winners = this.getAllWinners()
      const newWinner = {
        ...winnerData,
        id: this.getNextId(), // Додаємо генерацію ID
        email: normalizedEmail,
        name: winnerData.name.trim()
      }

      winners.push(newWinner)
      localStorage.setItem(this.storageKey, JSON.stringify(winners))
      return { success: true }
    } catch (error) {
      console.error('Failed to save winner:', error)
      return {
        success: false,
        errors: { general: 'Failed to save winner. Please try again.' }
      }
    }
  }

  public updateWinner(winner: IWinner): { success: boolean; errors?: Record<string, string> } {
    if (!winner) {
      return { success: false, errors: { general: 'Invalid winner data.' } }
    }

    const validation = this.validateWinner(winner)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    try {
      const winners = this.getAllWinners()
      const normalizedEmail = winner.email.toLowerCase().trim()
      const index = winners.findIndex((w) => w.email.toLowerCase().trim() === normalizedEmail)

      if (index === -1) {
        return { success: false, errors: { email: 'Winner not found.' } }
      }

      winners[index] = {
        ...winner,
        email: normalizedEmail,
        name: winner.name.trim()
      }

      localStorage.setItem(this.storageKey, JSON.stringify(winners))
      return { success: true }
    } catch (error) {
      console.error('Failed to update winner:', error)
      return {
        success: false,
        errors: { general: 'Failed to update winner. Please try again.' }
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
    fetch('https://api.escuelajs.co/api/v1/users')
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
}

export default WinnerRepository
