'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { 
  CreditCard as CreditCardIcon, 
  MapPin, 
  Fuel, 
  Plane, 
  Star, 
  TrendingUp, 
  Shield,
  Zap,
  Heart,
  Plus,
  Check,
  Info,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

interface CreditCardGridProps {
  cards: CreditCard[]
  onAddToComparison?: (card: CreditCard) => void
  comparisonCards?: string[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  hover: { y: -8, scale: 1.02 }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Premium':
      return 'from-purple-500 to-pink-500'
    case 'Mid-tier':
      return 'from-blue-500 to-cyan-500'
    case 'Entry-level':
      return 'from-green-500 to-emerald-500'
    case 'Cashback':
      return 'from-orange-500 to-red-500'
    default:
      return 'from-gray-500 to-gray-600'
  }
}

const getCashbackValue = (rate: string) => {
  const match = rate.match(/(\d+(?:\.\d+)?)%/)
  return match ? parseFloat(match[1]) : 0
}

export function CreditCardGrid({ cards, onAddToComparison, comparisonCards = [] }: CreditCardGridProps) {
  if (cards.length === 0) {
    return (
      <motion.div 
        className="text-center py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <CreditCardIcon className="mx-auto h-16 w-16 text-gray-300" />
        </motion.div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No credit cards found</h3>
        <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filters to discover more cards.</p>
        <motion.div
          className="mt-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="outline" onClick={() => window.location.reload()}>
            <Sparkles className="w-4 h-4 mr-2" />
            Reset Search
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <TooltipProvider>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              whileHover="hover"
              layout
              custom={index}
            >
              <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Premium Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(card.category)} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

                <CardHeader className="relative pb-4">
                  {/* Category Badge - moved to header with proper spacing */}
                  <div className="flex justify-between items-start mb-4">
                    <Badge 
                      variant={card.category === 'Premium' ? 'default' : 'secondary'} 
                      className={`bg-gradient-to-r ${getCategoryColor(card.category)} text-white border-0 shadow-lg text-xs`}
                    >
                      {card.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                      <AvatarImage src={card.image} alt={card.name} />
                      <AvatarFallback className={`bg-gradient-to-br ${getCategoryColor(card.category)} text-white font-bold`}>
                        {card.bank.split(' ').map(word => word[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200">
                        {card.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 font-medium">{card.bank}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {card.networkType}
                        </Badge>
                        {card.contactless && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="text-xs">
                                <Zap className="w-3 h-3 mr-1" />
                                Contactless
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Contactless payments supported</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6 relative">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs text-gray-600 font-medium">Annual Fee</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {card.annualFee === 0 ? 'Free' : formatCurrency(card.annualFee)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span className="text-xs text-gray-600 font-medium">Cashback</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{card.cashbackRate}</p>
                      <Progress 
                        value={Math.min(getCashbackValue(card.cashbackRate) * 20, 100)} 
                        className="h-2"
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-blue-600" />
                      Key Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {card.loungeAccess && (
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-blue-50 py-1">
                              <Plane className="w-3 h-3 mr-1" />
                              Lounge Access
                            </Badge>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">Airport Lounge Access</h4>
                              <p className="text-xs text-gray-600">
                                Enjoy complimentary access to premium airport lounges worldwide
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      )}
                      {card.fuelCashback && (
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-green-50 py-1">
                              <Fuel className="w-3 h-3 mr-1" />
                              Fuel Benefits
                            </Badge>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">Fuel Cashback</h4>
                              <p className="text-xs text-gray-600">
                                Get cashback or waiver on fuel surcharge at petrol pumps
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      )}
                    </div>
                  </div>

                  {/* Best For Categories */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-pink-600" />
                      Perfect For
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {card.bestFor.slice(0, 3).map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 py-1">
                          {category}
                        </Badge>
                      ))}
                      {card.bestFor.length > 3 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="secondary" className="text-xs cursor-pointer py-1">
                              +{card.bestFor.length - 3} more
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              {card.bestFor.slice(3).map((category) => (
                                <p key={category} className="text-xs">{category}</p>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button asChild className="flex-1" size="sm" variant="default">
                      <Link href={`/cards/${card.id}`}>
                        <span className="flex items-center">
                          <Info className="w-4 h-4 mr-2" />
                          View Details
                        </span>
                      </Link>
                    </Button>
                    
                    {onAddToComparison && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAddToComparison(card)}
                          disabled={comparisonCards.includes(card.id) || comparisonCards.length >= 4}
                          className={`${
                            comparisonCards.includes(card.id) 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
                          }`}
                        >
                          {comparisonCards.includes(card.id) ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-1" />
                              Compare
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardContent>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  )
}