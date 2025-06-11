'use client'

import { CreditCard } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard as CreditCardIcon, MapPin, Fuel, Plane } from 'lucide-react'
import Link from 'next/link'

interface CreditCardGridProps {
  cards: CreditCard[]
  onAddToComparison?: (card: CreditCard) => void
  comparisonCards?: string[]
}

export function CreditCardGrid({ cards, onAddToComparison, comparisonCards = [] }: CreditCardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No credit cards found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{card.name}</CardTitle>
                <p className="text-sm text-gray-600">{card.bank}</p>
              </div>
              <Badge variant={card.category === 'Premium' ? 'default' : 'secondary'}>
                {card.category}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Annual Fee</p>
                <p className="font-semibold">{card.annualFee === 0 ? 'Free' : formatCurrency(card.annualFee)}</p>
              </div>
              <div>
                <p className="text-gray-600">Cashback Rate</p>
                <p className="font-semibold">{card.cashbackRate}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {card.loungeAccess && (
                <Badge variant="outline" className="text-xs">
                  <Plane className="w-3 h-3 mr-1" />
                  Lounge Access
                </Badge>
              )}
              {card.fuelCashback && (
                <Badge variant="outline" className="text-xs">
                  <Fuel className="w-3 h-3 mr-1" />
                  Fuel Cashback
                </Badge>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-600 mb-1">Best For:</p>
              <div className="flex flex-wrap gap-1">
                {card.bestFor.slice(0, 3).map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button asChild className="flex-1" size="sm">
                <Link href={`/cards/${card.id}`}>
                  View Details
                </Link>
              </Button>
              
              {onAddToComparison && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddToComparison(card)}
                  disabled={comparisonCards.includes(card.id)}
                >
                  {comparisonCards.includes(card.id) ? 'Added' : 'Compare'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}