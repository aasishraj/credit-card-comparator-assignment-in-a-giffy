'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, FilterOptions } from '@/lib/types'
import { filterCards, getUniqueValues, sortCards } from '@/lib/utils'
import { CreditCardGrid } from '@/components/credit-card-grid'
import { AIChat } from '@/components/ai-chat'
import { ComparisonTable } from '@/components/comparison-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  MessageSquare, 
  Search, 
  BarChart3, 
  Filter, 
  X, 
  CreditCard as CreditCardIcon,
  Sparkles,
  ChevronDown,
  Settings2,
  TrendingUp,
  Star,
  Zap
} from 'lucide-react'
import creditCardsData from '@/data/credit-cards.json'

const creditCards: CreditCard[] = creditCardsData as CreditCard[]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
}

export default function HomePage() {
  const [filteredCards, setFilteredCards] = useState<CreditCard[]>(creditCards)
  const [searchQuery, setSearchQuery] = useState('')
  const [comparisonCards, setComparisonCards] = useState<CreditCard[]>([])
  const [activeTab, setActiveTab] = useState('explore')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('annualFee')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState<Partial<FilterOptions>>({
    banks: [],
    categories: [],
    loungeAccess: null,
    fuelCashback: null,
    noAnnualFee: null,
    networkTypes: [],
    maxAnnualFee: null
  })

  const uniqueBanks = getUniqueValues(creditCards, 'bank') as string[]
  const uniqueCategories = getUniqueValues(creditCards, 'category') as string[]
  const uniqueNetworks = getUniqueValues(creditCards, 'networkType') as string[]

  useEffect(() => {
    let results = creditCards

    // Apply search filter
    if (searchQuery.trim()) {
      results = results.filter(card =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.benefits.some(benefit => benefit.toLowerCase().includes(searchQuery.toLowerCase())) ||
        card.bestFor.some(category => category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply filters
    results = filterCards(results, filters)

    // Sort cards
    results = sortCards(results, sortBy as any, sortOrder)

    setFilteredCards(results)
  }, [searchQuery, filters, sortBy, sortOrder])

  const handleAddToComparison = (card: CreditCard) => {
    if (comparisonCards.length < 4 && !comparisonCards.find(c => c.id === card.id)) {
      setComparisonCards([...comparisonCards, card])
    }
  }

  const handleRemoveFromComparison = (cardId: string) => {
    setComparisonCards(comparisonCards.filter(c => c.id !== cardId))
  }

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      banks: [],
      categories: [],
      loungeAccess: null,
      fuelCashback: null,
      noAnnualFee: null,
      networkTypes: [],
      maxAnnualFee: null
    })
    setSearchQuery('')
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== null
  ) || searchQuery.trim().length > 0

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Modern Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 sticky top-0 z-50"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <CreditCardIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    CreditCard Comparator
                  </h1>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Powered
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {creditCards.length} Cards
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <AnimatePresence>
                {comparisonCards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('compare')}
                      className="relative bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 hover:from-emerald-600 hover:to-teal-700"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Compare ({comparisonCards.length})
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="explore" className="flex items-center data-[state=active]:bg-white">
                <Search className="w-4 h-4 mr-2" />
                Explore Cards
              </TabsTrigger>
              <TabsTrigger value="ai-chat" className="flex items-center data-[state=active]:bg-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center data-[state=active]:bg-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                Compare ({comparisonCards.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="explore" className="space-y-6">
              {/* Enhanced Search and Filters */}
              <motion.div variants={itemVariants}>
                <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-xl">
                        <Search className="w-5 h-5 mr-2 text-blue-600" />
                        Discover Your Perfect Card
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {hasActiveFilters && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearFilters}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Clear All
                            </Button>
                          </motion.div>
                        )}
                        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                          <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-white/50">
                              <Settings2 className="w-4 h-4 mr-2" />
                              Advanced Filters
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[400px] sm:w-[540px]">
                            <SheetHeader>
                              <SheetTitle>Advanced Filters</SheetTitle>
                              <SheetDescription>
                                Fine-tune your search to find the perfect credit card
                              </SheetDescription>
                            </SheetHeader>
                            <ScrollArea className="h-[calc(100vh-120px)] pr-6">
                              <div className="space-y-6 py-6">
                                {/* Bank Filter */}
                                <div className="space-y-3">
                                  <h4 className="font-medium flex items-center">
                                    <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                                    Banks
                                  </h4>
                                  <div className="space-y-2">
                                    {uniqueBanks.map((bank) => (
                                      <div key={bank} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`bank-${bank}`}
                                          checked={filters.banks?.includes(bank) || false}
                                          onCheckedChange={(checked) => {
                                            const banks = filters.banks || []
                                            if (checked) {
                                              handleFilterChange('banks', [...banks, bank])
                                            } else {
                                              handleFilterChange('banks', banks.filter(b => b !== bank))
                                            }
                                          }}
                                        />
                                        <label htmlFor={`bank-${bank}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                          {bank}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <Separator />

                                {/* Category Filter */}
                                <div className="space-y-3">
                                  <h4 className="font-medium flex items-center">
                                    <Star className="w-4 h-4 mr-2 text-amber-600" />
                                    Categories
                                  </h4>
                                  <div className="space-y-2">
                                    {uniqueCategories.map((category) => (
                                      <div key={category} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`category-${category}`}
                                          checked={filters.categories?.includes(category) || false}
                                          onCheckedChange={(checked) => {
                                            const categories = filters.categories || []
                                            if (checked) {
                                              handleFilterChange('categories', [...categories, category])
                                            } else {
                                              handleFilterChange('categories', categories.filter(c => c !== category))
                                            }
                                          }}
                                        />
                                        <label htmlFor={`category-${category}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                          {category}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <Separator />

                                {/* Features */}
                                <div className="space-y-3">
                                  <h4 className="font-medium flex items-center">
                                    <Zap className="w-4 h-4 mr-2 text-purple-600" />
                                    Features
                                  </h4>
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <label htmlFor="lounge-access" className="text-sm font-medium">
                                        Lounge Access
                                      </label>
                                      <Switch
                                        id="lounge-access"
                                        checked={filters.loungeAccess === true}
                                        onCheckedChange={(checked) => 
                                          handleFilterChange('loungeAccess', checked ? true : null)
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <label htmlFor="fuel-cashback" className="text-sm font-medium">
                                        Fuel Cashback
                                      </label>
                                      <Switch
                                        id="fuel-cashback"
                                        checked={filters.fuelCashback === true}
                                        onCheckedChange={(checked) => 
                                          handleFilterChange('fuelCashback', checked ? true : null)
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <label htmlFor="no-annual-fee" className="text-sm font-medium">
                                        No Annual Fee
                                      </label>
                                      <Switch
                                        id="no-annual-fee"
                                        checked={filters.noAnnualFee === true}
                                        onCheckedChange={(checked) => 
                                          handleFilterChange('noAnnualFee', checked ? true : null)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                {/* Annual Fee Range */}
                                <div className="space-y-3">
                                  <h4 className="font-medium">Maximum Annual Fee</h4>
                                  <div className="space-y-2">
                                    <Slider
                                      value={[filters.maxAnnualFee || 50000]}
                                      onValueChange={(value) => handleFilterChange('maxAnnualFee', value[0])}
                                      max={50000}
                                      step={1000}
                                      className="w-full"
                                    />
                                    <p className="text-sm text-gray-600">
                                      Up to ₹{filters.maxAnnualFee?.toLocaleString() || '50,000'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </ScrollArea>
                          </SheetContent>
                        </Sheet>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Enhanced Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search credit cards by name, bank, benefits, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 bg-white/50 border-white/20 focus:bg-white"
                      />
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium">Sort by:</label>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px] bg-white/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="annualFee">Annual Fee</SelectItem>
                              <SelectItem value="cashbackRate">Cashback Rate</SelectItem>
                              <SelectItem value="name">Name</SelectItem>
                              <SelectItem value="bank">Bank</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                          className="bg-white/50"
                        >
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </Button>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        Showing {filteredCards.length} of {creditCards.length} cards
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Results */}
              <motion.div className="space-y-4" variants={itemVariants}>
                <CreditCardGrid
                  cards={filteredCards}
                  onAddToComparison={handleAddToComparison}
                  comparisonCards={comparisonCards.map(c => c.id)}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="ai-chat">
              <motion.div variants={itemVariants}>
                <Card className="h-[800px] bg-white/70 backdrop-blur-sm border-white/20 shadow-lg rounded-xl">
                  <AIChat
                    onAddToComparison={handleAddToComparison}
                    comparisonCards={comparisonCards.map(c => c.id)}
                  />
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="compare">
              <motion.div variants={itemVariants}>
                <ComparisonTable
                  cards={comparisonCards}
                  onRemoveCard={handleRemoveFromComparison}
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  )
}
