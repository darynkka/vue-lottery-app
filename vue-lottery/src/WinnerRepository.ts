import Winner, { IWinner } from './Winner'

export default class WinnerRepository {
  private storageKey = 'winners'

  public getAllWinners(): Winner[] {
    try {
      const winnersData = localStorage.getItem(this.storageKey)
      if (!winnersData) return []

      const winners = JSON.parse(winnersData)
      return winners.map((w: IWinner) => new Winner(w.name, w.dob, w.email, w.phone))
    } catch (error) {
      console.error('Error getting winners:', error)
      return []
    }
  }

  public addWinner(winner: Winner): void {
    const winners = this.getAllWinners()
    const winnerData = winners.concat([
      {
        name: winner.name,
        dob: winner.dob,
        email: winner.email.toLowerCase(),
        phone: winner.phone
      }
    ])
    localStorage.setItem(this.storageKey, JSON.stringify(winnerData))
  }

  public updateWinner(updatedWinner: Winner): void {
    const winners = this.getAllWinners()
    const index = winners.findIndex(
      (w) => w.email.toLowerCase() === updatedWinner.email.toLowerCase()
    )

    if (index !== -1) {
      winners[index] = updatedWinner
      const winnerData = winners.map((w) => ({
        name: w.name,
        dob: w.dob,
        email: w.email.toLowerCase(),
        phone: w.phone
      }))
      localStorage.setItem(this.storageKey, JSON.stringify(winnerData))
    }
  }

  public deleteWinner(email: string): void {
    try {
      const winners = this.getAllWinners()
      const filteredWinners = winners.filter((w) => w.email.toLowerCase() !== email.toLowerCase())
      const winnerData = filteredWinners.map((w) => ({
        name: w.name,
        dob: w.dob,
        email: w.email.toLowerCase(),
        phone: w.phone
      }))
      localStorage.setItem(this.storageKey, JSON.stringify(winnerData))
    } catch (error) {
      console.error('Error deleting winner:', error)
      throw new Error('Failed to delete winner')
    }
  }

  public findByEmail(email: string): Winner | null {
    try {
      const winners = this.getAllWinners()
      return winners.find((w) => w.email.toLowerCase() === email.toLowerCase()) || null
    } catch (error) {
      console.error('Error finding winner by email:', error)
      return null
    }
  }

  public searchByName(searchTerm: string): Winner[] {
    try {
      const winners = this.getAllWinners()
      return winners.filter((w) => w.name.toLowerCase().includes(searchTerm.toLowerCase()))
    } catch (error) {
      console.error('Error searching winners by name:', error)
      return []
    }
  }

  public sortWinners(
    winners: Winner[],
    sortBy: 'name' | 'dob',
    order: 'asc' | 'desc' = 'asc'
  ): Winner[] {
    try {
      const modifier = order === 'asc' ? 1 : -1
      return [...winners].sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name) * modifier
        } else if (sortBy === 'dob') {
          return (new Date(a.dob).getTime() - new Date(b.dob).getTime()) * modifier
        }
        return 0
      })
    } catch (error) {
      console.error('Error sorting winners:', error)
      return winners
    }
  }
}
