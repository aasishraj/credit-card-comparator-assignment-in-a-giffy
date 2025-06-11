'use client'

import { CreditCard } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, X, Trash2 } from 'lucide-react'

interface ComparisonTableProps {
  cards: CreditCard[]
  onRemoveCard?: (cardId: string) => void
}

export function ComparisonTable({ cards, onRemoveCard }: ComparisonTableProps) {
  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No cards selected for comparison. Add cards from the search results to compare them.</p>
        </CardContent>
      </Card>
    )
  }

  const features = [
    { key: 'bank', label: 'Bank' },
    { key: 'category', label: 'Category' },
    { key: 'annualFee', label: 'Annual Fee' },
    { key: 'joiningFee', label: 'Joining Fee' },
    { key: 'cashbackRate', label: 'Cashback Rate' },
    { key: 'rewardType', label: 'Reward Type' },
    { key: 'rewardRate', label: 'Reward Rate' },
    { key: 'loungeAccess', label: 'Lounge Access' },
    { key: 'fuelCashback', label: 'Fuel Cashback' },
    { key: 'networkType', label: 'Network' },
    { key: 'eligibility', label: 'Eligibility' },
    { key: 'onlineShoppingCashback', label: 'Online Shopping' },
    { key: 'diningCashback', label: 'Dining Benefits' },
  ]

  const renderValue = (card: CreditCard, key: string) => {
    const value = card[key as keyof CreditCard]
    
    switch (key) {
      case 'annualFee':
      case 'joiningFee':
        return value === 0 ? 'Free' : formatCurrency(value as number)
      case 'loungeAccess':
      case 'fuelCashback':
        return value ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />
      case 'category':
        return <Badge variant={value === 'Premium' ? 'default' : 'secondary'}>{value as string}</Badge>
      case 'bestFor':
        return (
          <div className="flex flex-wrap gap-1">
            {(value as string[]).map((item, index) => (
              <Badge key={index} variant="outline" className="text-xs">{item}</Badge>
            ))}
          </div>
        )
      default:
        return value as string
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Credit Card Comparison</h2>
        <p className="text-gray-600">Comparing {cards.length} cards</p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Card Headers */}
          <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${cards.length}, 1fr)` }}>
            <div></div>
            {cards.map((card) => (
              <Card key={card.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{card.name}</CardTitle>
                      <p className="text-sm text-gray-600">{card.bank}</p>
                    </div>
                    {onRemoveCard && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveCard(card.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Comparison Rows */}
          <div className="space-y-2">
            {features.map((feature) => (
              <div
                key={feature.key}
                className="grid gap-4 py-3 border-b"
                style={{ gridTemplateColumns: `200px repeat(${cards.length}, 1fr)` }}
              >
                <div className="font-medium text-gray-700 self-center">
                  {feature.label}
                </div>
                {cards.map((card) => (
                  <div key={card.id} className="self-center">
                    {renderValue(card, feature.key)}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Key Benefits</h3>
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cards.length}, 1fr)` }}>
              {cards.map((card) => (
                <Card key={card.id}>
                  <CardContent className="p-4">
                    <ul className="space-y-2">
                      {card.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-green-500 mr-2 mt-1">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 