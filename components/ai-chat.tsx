'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from 'ai/react'
import { CreditCard } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Plus, 
  Check, 
  MessageSquare,
  Loader2,
  TrendingUp,
  Star,
  Shield,
  Zap
} from 'lucide-react'
import creditCardsData from '@/data/credit-cards.json'

const creditCards: CreditCard[] = creditCardsData as CreditCard[]

interface AIChatProps {
  onAddToComparison?: (card: CreditCard) => void
  comparisonCards?: string[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
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

export function AIChat({ onAddToComparison, comparisonCards = [] }: AIChatProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  })
  const [suggestedCards, setSuggestedCards] = useState<CreditCard[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(e)
    
    // Simple card suggestion logic based on input
    if (input.toLowerCase().includes('premium') || input.toLowerCase().includes('lounge')) {
      setSuggestedCards(creditCards.filter(card => card.category === 'Premium').slice(0, 3))
    } else if (input.toLowerCase().includes('cashback') || input.toLowerCase().includes('cash back')) {
      setSuggestedCards(creditCards.filter(card => card.category === 'Cashback').slice(0, 3))
    } else if (input.toLowerCase().includes('fuel') || input.toLowerCase().includes('petrol')) {
      setSuggestedCards(creditCards.filter(card => card.fuelCashback).slice(0, 3))
    } else {
      setSuggestedCards(creditCards.slice(0, 3))
    }
  }

  return (
    <motion.div 
      className="h-full flex flex-col chat-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
        <motion.div variants={messageVariants}>
          <CardTitle className="flex items-center text-xl">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg mr-3">
              <Bot className="w-5 h-5 text-white" />
            </div>
            AI Credit Card Assistant
            <Badge variant="secondary" className="ml-3">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by AI
            </Badge>
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Ask me anything about credit cards, get personalized recommendations, or compare features!
          </p>
        </motion.div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Chat Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-6 min-h-0 chat-messages">
          <motion.div className="space-y-6" variants={containerVariants}>
            {messages.length === 0 && (
              <motion.div 
                className="text-center py-12"
                variants={messageVariants}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <MessageSquare className="mx-auto h-16 w-16 text-blue-300" />
                </motion.div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Welcome to AI Assistant</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                  Start a conversation to get personalized credit card recommendations based on your needs and preferences.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                    "Best cashback cards"
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                    "Premium cards with lounge access"
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                    "No annual fee cards"
                  </Badge>
                </div>
              </motion.div>
            )}
            
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                >
                  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-3xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                      <Avatar className="h-8 w-8 border-2 border-white shadow-md">
                        {message.role === 'user' ? (
                          <>
                            <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      
                      <div className={`${message.role === 'user' ? 'mr-3' : 'ml-3'} max-w-full`}>
                        <motion.div
                          className={`p-4 rounded-2xl ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                              : 'bg-white border border-gray-200 shadow-sm'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </motion.div>
                        
                        <div className={`mt-1 text-xs text-gray-500 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Loading indicator */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8 border-2 border-white shadow-md">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Suggested Cards */}
            <AnimatePresence>
              {suggestedCards.length > 0 && (
                <motion.div
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-4"
                >
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                      Recommended Cards
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {suggestedCards.map((card, cardIndex) => (
                        <motion.div
                          key={card.id}
                          variants={cardVariants}
                          custom={cardIndex}
                        >
                          <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-white/20 shadow-md hover:shadow-lg transition-all duration-300">
                            <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(card.category)} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                            
                            <CardContent className="p-4 relative">
                              {/* Category Badge */}
                              <div className="flex justify-end mb-2">
                                <Badge 
                                  variant={card.category === 'Premium' ? 'default' : 'secondary'} 
                                  className={`bg-gradient-to-r ${getCategoryColor(card.category)} text-white border-0 text-xs`}
                                >
                                  {card.category}
                                </Badge>
                              </div>
                              
                              <div className="flex items-start space-x-3">
                                <Avatar className="h-8 w-8 border border-white shadow-sm">
                                  <AvatarImage src={card.image} alt={card.name} />
                                  <AvatarFallback className={`bg-gradient-to-br ${getCategoryColor(card.category)} text-white font-bold text-xs`}>
                                    {card.bank.split(' ').map(word => word[0]).join('').slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-sm font-medium leading-tight group-hover:text-blue-600 transition-colors">
                                    {card.name}
                                  </h5>
                                  <p className="text-xs text-gray-600">{card.bank}</p>
                                </div>
                              </div>
                              
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600">Annual Fee</span>
                                  <span className="font-medium">
                                    {card.annualFee === 0 ? 'Free' : `₹${card.annualFee.toLocaleString()}`}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600">Cashback</span>
                                  <span className="font-medium text-green-600">{card.cashbackRate}</span>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex items-center space-x-1">
                                {card.loungeAccess && (
                                  <Badge variant="outline" className="text-xs h-5">
                                    <Shield className="w-2 h-2 mr-1" />
                                    Lounge
                                  </Badge>
                                )}
                                {card.fuelCashback && (
                                  <Badge variant="outline" className="text-xs h-5">
                                    <Zap className="w-2 h-2 mr-1" />
                                    Fuel
                                  </Badge>
                                )}
                              </div>
                              
                              {onAddToComparison && (
                                <motion.div 
                                  className="mt-3"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onAddToComparison(card)}
                                    disabled={comparisonCards.includes(card.id) || comparisonCards.length >= 4}
                                    className={`w-full text-xs h-7 ${
                                      comparisonCards.includes(card.id) 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                        : 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
                                    }`}
                                  >
                                    {comparisonCards.includes(card.id) ? (
                                      <>
                                        <Check className="w-3 h-3 mr-1" />
                                        Added
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="w-3 h-3 mr-1" />
                                        Add to Compare
                                      </>
                                    )}
                                  </Button>
                                </motion.div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} />
          </motion.div>
        </ScrollArea>

        {/* Input Form */}
        <div className="border-t bg-gray-50/50 p-6 flex-shrink-0 chat-input">
          <motion.form 
            onSubmit={handleFormSubmit} 
            className="flex space-x-3"
            variants={messageVariants}
          >
            <div className="relative flex-1">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me about credit cards, rates, benefits, or get recommendations..."
                className="pr-12 h-12 bg-white/80 border-white/20 focus:bg-white"
                disabled={isLoading}
              />
              <motion.div
                className="absolute right-3 top-1/2 -translate-y-1/2"
                animate={{ 
                  rotate: isLoading ? 360 : 0,
                  scale: isLoading ? [1, 1.2, 1] : 1
                }}
                transition={{ 
                  duration: isLoading ? 1 : 0.3,
                  repeat: isLoading ? Infinity : 0,
                  ease: "linear"
                }}
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
              </motion.div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </motion.div>
          </motion.form>
          
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-blue-50 text-xs"
              onClick={() => handleInputChange({ target: { value: 'Best premium credit cards with lounge access' } } as any)}
            >
              Premium cards
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-green-50 text-xs"
              onClick={() => handleInputChange({ target: { value: 'Highest cashback credit cards for online shopping' } } as any)}
            >
              Cashback cards
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-purple-50 text-xs"
              onClick={() => handleInputChange({ target: { value: 'Credit cards with no annual fee' } } as any)}
            >
              No annual fee
            </Badge>
          </div>
        </div>
      </CardContent>
    </motion.div>
  )
} 