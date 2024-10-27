export interface IWinner {
  name: string
  dob: string
  email: string
  phone: string
}

class WinnerRepository {
  private storageKey = 'winners'

  private validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  private validatePhone(phone: string): boolean {
    return /^\+?[0-9]{7,15}$/.test(phone)
  }

  private validateWinner(winner: IWinner): { isValid: boolean; errors?: Record<string, string> } {
    const errors: Record<string, string> = {}

    if (!winner.name?.trim()) errors.name = 'Name is required.'
    if (!winner.dob) {
      errors.dob = 'Date of Birth is required.'
    } else if (new Date(winner.dob) > new Date()) {
      errors.dob = 'Date of Birth cannot be in the future.'
    }
    if (!winner.email?.trim()) {
      errors.email = 'Email is required.'
    } else if (!this.validateEmail(winner.email)) {
      errors.email = 'Invalid email format.'
    }
    if (!winner.phone?.trim()) {
      errors.phone = 'Phone number is required.'
    } else if (!this.validatePhone(winner.phone)) {
      errors.phone = 'Invalid phone number format.'
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
      this.clearStorage()
      return []
    }
  }

  public findByEmail(email: string): IWinner | null {
    if (!email?.trim()) return null
    const normalizedEmail = email.toLowerCase().trim()
    const winners = this.getAllWinners()
    return winners.find((w) => w.email.toLowerCase().trim() === normalizedEmail) || null
  }

  public addWinner(winner: IWinner): { success: boolean; errors?: Record<string, string> } {
    if (!winner) {
      return { success: false, errors: { general: 'Invalid winner data.' } }
    }

    const validation = this.validateWinner(winner)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    const normalizedEmail = winner.email.toLowerCase().trim()
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
        ...winner,
        email: normalizedEmail,
        name: winner.name.trim(),
        phone: winner.phone.trim()
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
        name: winner.name.trim(),
        phone: winner.phone.trim()
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
      } else if (sortBy === 'dob') {
        return (a.dob || '').localeCompare(b.dob || '') * factor
      }
      return 0
    })
  }
}

export default WinnerRepository
