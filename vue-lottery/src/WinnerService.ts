import WinnerRepository from './WinnerRepository'
import Winner, { IWinner } from './Winner'

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export default class WinnerService {
  private repository: WinnerRepository

  constructor() {
    this.repository = new WinnerRepository()
  }

  private validateWinner(winner: IWinner, isEditing: boolean = false): ValidationResult {
    const errors: Record<string, string> = {}

    if (!winner.name) {
      errors.name = 'Name is required.'
    }

    if (!winner.dob) {
      errors.dob = 'Date of Birth is required.'
    } else if (new Date(winner.dob) > new Date()) {
      errors.dob = 'Date of Birth cannot be in the future.'
    }

    if (!winner.email) {
      errors.email = 'Email is required.'
    } else if (!this.validateEmail(winner.email)) {
      errors.email = 'Invalid email format.'
    }

    if (!winner.phone) {
      errors.phone = 'Phone number is required.'
    } else if (!this.validatePhone(winner.phone)) {
      errors.phone = 'Invalid phone number format.'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  public addWinner(winner: IWinner): ValidationResult {
    try {
      const validationResult = this.validateWinner(winner, false)
      if (!validationResult.isValid) {
        return validationResult
      }
      const existingWinner = this.repository.findByEmail(winner.email)
      if (existingWinner) {
        return {
          isValid: false,
          errors: { email: 'A winner with this email already exists.' }
        }
      }
      const newWinner = new Winner(winner.name, winner.dob, winner.email, winner.phone)
      this.repository.addWinner(newWinner)

      return { isValid: true, errors: {} }
    } catch (error) {
      return {
        isValid: false,
        errors: {
          general: error instanceof Error ? error.message : 'Failed to add winner'
        }
      }
    }
  }

  public updateWinner(winner: IWinner): ValidationResult {
    try {
      const validationResult = this.validateWinner(winner, true)
      if (!validationResult.isValid) {
        return validationResult
      }

      const updatedWinner = new Winner(winner.name, winner.dob, winner.email, winner.phone)
      this.repository.updateWinner(updatedWinner)

      return { isValid: true, errors: {} }
    } catch (error) {
      return {
        isValid: false,
        errors: {
          general: error instanceof Error ? error.message : 'Failed to update winner'
        }
      }
    }
  }

  public deleteWinner(email: string): void {
    this.repository.deleteWinner(email)
  }

  public getAllWinners(): Winner[] {
    return this.repository.getAllWinners()
  }

  public selectRandomWinners(count: number, excludeEmails: string[]): Winner[] {
    const allWinners = this.getAllWinners()
    const eligibleWinners = allWinners.filter((w) => !excludeEmails.includes(w.email.toLowerCase()))
    const shuffled = eligibleWinners.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  private validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }

  private validatePhone(phone: string): boolean {
    const phonePattern = /^\+?[0-9]{7,15}$/
    return phonePattern.test(phone)
  }
}
