import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CreditCard, FilterOptions } from './types'

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

export function filterCards(cards: CreditCard[], filters: Partial<FilterOptions>): CreditCard[] {
  return cards.filter(card => {
    // Bank filter
    if (filters.banks && filters.banks.length > 0 && !filters.banks.includes(card.bank)) {
      return false
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0 && !filters.categories.includes(card.category)) {
      return false
    }

    // Lounge access filter
    if (filters.loungeAccess !== null && filters.loungeAccess !== undefined && card.loungeAccess !== filters.loungeAccess) {
      return false
    }

    // Fuel cashback filter
    if (filters.fuelCashback !== null && filters.fuelCashback !== undefined && card.fuelCashback !== filters.fuelCashback) {
      return false
    }

    // No annual fee filter
    if (filters.noAnnualFee && card.annualFee > 0) {
      return false
    }

    // Network type filter
    if (filters.networkTypes && filters.networkTypes.length > 0 && !filters.networkTypes.includes(card.networkType)) {
      return false
    }

    // Max annual fee filter
    if (filters.maxAnnualFee !== null && filters.maxAnnualFee !== undefined && card.annualFee > filters.maxAnnualFee) {
      return false
    }

    return true
  })
}

export function searchCards(cards: CreditCard[], query: string): CreditCard[] {
  const searchTerms = query.toLowerCase().split(' ')
  
  return cards.filter(card => {
    const searchableText = [
      card.name,
      card.bank,
      card.category,
      card.rewardType,
      card.eligibility,
      ...card.benefits,
      ...card.bestFor,
      card.networkType
    ].join(' ').toLowerCase()

    return searchTerms.every(term => searchableText.includes(term))
  })
}

export function getUniqueValues<T>(array: T[], key: keyof T): T[keyof T][] {
  return Array.from(new Set(array.map(item => item[key])))
}

export function sortCards(cards: CreditCard[], sortBy: 'name' | 'annualFee' | 'cashbackRate' | 'bank', order: 'asc' | 'desc' = 'asc'): CreditCard[] {
  return [...cards].sort((a, b) => {
    let valueA: any = a[sortBy]
    let valueB: any = b[sortBy]

    if (sortBy === 'cashbackRate') {
      valueA = parseFloat(a.cashbackRate.replace('%', ''))
      valueB = parseFloat(b.cashbackRate.replace('%', ''))
    }

    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase()
      valueB = valueB.toLowerCase()
    }

    if (order === 'asc') {
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0
    } else {
      return valueA > valueB ? -1 : valueA < valueB ? 1 : 0
    }
  })
} 