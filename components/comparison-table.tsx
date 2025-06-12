'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  X, 
  TrendingUp, 
  Star, 
  Shield, 
  Plane, 
  Fuel, 
  Zap,
  CreditCard as CreditCardIcon,
  Check,
  Minus,
  Award,
  Target,
  DollarSign
} from 'lucide-react'

interface ComparisonTableProps {
  cards: CreditCard[]
  onRemoveCard: (cardId: string) => void
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const cardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
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

const getMaxAnnualFee = (cards: CreditCard[]) => {
  return Math.max(...cards.map(card => card.annualFee))
}

const getMaxCashback = (cards: CreditCard[]) => {
  return Math.max(...cards.map(card => getCashbackValue(card.cashbackRate)))
}

export function ComparisonTable({ cards, onRemoveCard }: ComparisonTableProps) {
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
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <CreditCardIcon className="mx-auto h-16 w-16 text-gray-300" />
        </motion.div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900">No cards to compare</h3>
        <p className="mt-2 text-gray-500">Add credit cards from the explore section to start comparing</p>
      </motion.div>
    )
  }

  const maxAnnualFee = getMaxAnnualFee(cards)
  const maxCashback = getMaxCashback(cards)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        variants={cardVariants}
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Credit Card Comparison</h2>
          <p className="text-gray-600 mt-1">Compare {cards.length} selected credit cards side by side</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {cards.length}/4 Cards
        </Badge>
      </motion.div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              custom={index}
            >
              <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(card.category)} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Remove Button */}
                <motion.button
                  className="absolute top-3 right-3 z-10 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  onClick={() => onRemoveCard(card.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>

                <CardHeader className="pb-4 relative">
                  {/* Card Header */}
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                      <AvatarImage src={card.image} alt={card.name} />
                      <AvatarFallback className={`bg-gradient-to-br ${getCategoryColor(card.category)} text-white font-bold text-sm`}>
                        {card.bank.split(' ').map(word => word[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base leading-tight">{card.name}</CardTitle>
                      <p className="text-sm text-gray-600">{card.bank}</p>
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="mt-3">
                    <Badge 
                      className={`bg-gradient-to-r ${getCategoryColor(card.category)} text-white border-0 text-xs`}
                    >
                      {card.category}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 relative">
                  {/* Annual Fee Section */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-gray-700">Annual Fee</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-gray-900">
                        {card.annualFee === 0 ? 'Free' : formatCurrency(card.annualFee)}
                      </p>
                      {maxAnnualFee > 0 && (
                        <Progress 
                          value={card.annualFee === 0 ? 0 : (card.annualFee / maxAnnualFee) * 100}
                          className="h-2"
                        />
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Cashback Section */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-gray-700">Cashback Rate</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-gray-900">{card.cashbackRate}</p>
                      <Progress 
                        value={(getCashbackValue(card.cashbackRate) / maxCashback) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Features Section */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Features</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Lounge Access</span>
                        {card.loungeAccess ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Minus className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Fuel Cashback</span>
                        {card.fuelCashback ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Minus className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Contactless</span>
                        {card.contactless ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Minus className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Network & Eligibility */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">Details</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Network</span>
                        <Badge variant="outline" className="text-xs">
                          {card.networkType}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Eligibility:</span> {card.eligibility}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Best For Section */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-pink-600" />
                      <span className="text-sm font-medium text-gray-700">Best For</span>
                    </div>
                    <ScrollArea className="h-20">
                      <div className="flex flex-wrap gap-1">
                        {card.bestFor.map((category) => (
                          <Badge key={category} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <Separator />

                  {/* Reward Details */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-700">Rewards</span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p><span className="font-medium">Type:</span> {card.rewardType}</p>
                      <p><span className="font-medium">Rate:</span> {card.rewardRate}</p>
                      <p><span className="font-medium">Online:</span> {card.onlineShoppingCashback}</p>
                      <p><span className="font-medium">Dining:</span> {card.diningCashback}</p>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <motion.div 
                    className="pt-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button asChild className="w-full" size="sm">
                      <a href={`/cards/${card.id}`} target="_blank" rel="noopener noreferrer">
                        View Full Details
                      </a>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick Summary */}
      {cards.length > 1 && (
        <motion.div variants={cardVariants}>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Quick Comparison Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">Lowest Annual Fee</p>
                  <p className="text-lg font-bold text-blue-600">
                    {Math.min(...cards.map(c => c.annualFee)) === 0 
                      ? 'Free' 
                      : formatCurrency(Math.min(...cards.map(c => c.annualFee)))}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">Highest Cashback</p>
                  <p className="text-lg font-bold text-green-600">
                    {maxCashback}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">Premium Features</p>
                  <p className="text-lg font-bold text-purple-600">
                    {cards.filter(c => c.loungeAccess).length}/{cards.length} with Lounge
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
} 