import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CreditCard, FilterOptions } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getUniqueValues<T extends keyof CreditCard>(
  cards: CreditCard[],
  key: T
): CreditCard[T][] {
  const values = cards.map(card => card[key])
  return [...new Set(values)]
}

export function filterCards(
  cards: CreditCard[],
  filters: Partial<FilterOptions>
): CreditCard[] {
  return cards.filter(card => {
    // Bank filter
    if (filters.banks && filters.banks.length > 0) {
      if (!filters.banks.includes(card.bank)) return false
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(card.category)) return false
    }

    // Network type filter
    if (filters.networkTypes && filters.networkTypes.length > 0) {
      if (!filters.networkTypes.includes(card.networkType)) return false
    }

    // Lounge access filter
    if (filters.loungeAccess !== null && filters.loungeAccess !== undefined) {
      if (card.loungeAccess !== filters.loungeAccess) return false
    }

    // Fuel cashback filter
    if (filters.fuelCashback !== null && filters.fuelCashback !== undefined) {
      if (card.fuelCashback !== filters.fuelCashback) return false
    }

    // No annual fee filter
    if (filters.noAnnualFee !== null && filters.noAnnualFee !== undefined) {
      if (filters.noAnnualFee && card.annualFee > 0) return false
    }

    // Max annual fee filter
    if (filters.maxAnnualFee !== null && filters.maxAnnualFee !== undefined) {
      if (card.annualFee > filters.maxAnnualFee) return false
    }

    return true
  })
}

export function sortCards(
  cards: CreditCard[],
  sortBy: keyof CreditCard,
  order: 'asc' | 'desc' = 'asc'
): CreditCard[] {
  return [...cards].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]

    // Handle string values
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue)
      return order === 'asc' ? comparison : -comparison
    }

    // Handle number values
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      const comparison = aValue - bValue
      return order === 'asc' ? comparison : -comparison
    }

    // Handle boolean values
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      const comparison = Number(aValue) - Number(bValue)
      return order === 'asc' ? comparison : -comparison
    }

    return 0
  })
}

export function searchCards(
  cards: CreditCard[],
  query: string
): CreditCard[] {
  if (!query.trim()) return cards

  const searchTerm = query.toLowerCase().trim()
  
  return cards.filter(card => {
    // Search in card name
    if (card.name.toLowerCase().includes(searchTerm)) return true
    
    // Search in bank name
    if (card.bank.toLowerCase().includes(searchTerm)) return true
    
    // Search in category
    if (card.category.toLowerCase().includes(searchTerm)) return true
    
    // Search in benefits
    if (card.benefits.some(benefit => 
      benefit.toLowerCase().includes(searchTerm)
    )) return true
    
    // Search in best for categories
    if (card.bestFor.some(category => 
      category.toLowerCase().includes(searchTerm)
    )) return true
    
    // Search in reward type
    if (card.rewardType.toLowerCase().includes(searchTerm)) return true
    
    // Search in network type
    if (card.networkType.toLowerCase().includes(searchTerm)) return true
    
    return false
  })
}
