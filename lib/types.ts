export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  category: 'Premium' | 'Mid-tier' | 'Entry-level' | 'Cashback';
  annualFee: number;
  joiningFee: number;
  rewardType: string;
  rewardRate: string;
  loungeAccess: boolean;
  fuelCashback: boolean;
  eligibility: string;
  benefits: string[];
  cashbackRate: string;
  bestFor: string[];
  networkType: 'Visa' | 'Mastercard' | 'RuPay';
  contactless: boolean;
  onlineShoppingCashback: string;
  diningCashback: string;
  image: string;
}

export interface FilterOptions {
  banks: string[];
  categories: string[];
  loungeAccess: boolean | null;
  fuelCashback: boolean | null;
  noAnnualFee: boolean | null;
  networkTypes: string[];
  maxAnnualFee: number | null;
}

export interface ComparisonItem {
  id: string;
  card: CreditCard;
}

export interface AIQuery {
  query: string;
  intent: 'search' | 'compare' | 'recommend';
  filters?: Partial<FilterOptions>;
  cardIds?: string[];
}

export interface AIResponse {
  cards: CreditCard[];
  message: string;
  comparison?: boolean;
  recommendations?: string[];
} 