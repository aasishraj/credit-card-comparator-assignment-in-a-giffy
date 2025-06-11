'use client'

import { useState, useEffect } from 'react'
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
import { MessageSquare, Search, BarChart3, Filter, X } from 'lucide-react'
import creditCardsData from '@/data/credit-cards.json'

const creditCards: CreditCard[] = creditCardsData as CreditCard[]

export default function HomePage() {
  const [filteredCards, setFilteredCards] = useState<CreditCard[]>(creditCards)
  const [searchQuery, setSearchQuery] = useState('')
  const [comparisonCards, setComparisonCards] = useState<CreditCard[]>([])
  const [activeTab, setActiveTab] = useState('explore')
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

    // Sort by annual fee (ascending) by default
    results = sortCards(results, 'annualFee', 'asc')

    setFilteredCards(results)
  }, [searchQuery, filters])

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CreditCard Comparator</h1>
              <Badge variant="secondary" className="ml-2">AI Powered</Badge>
            </div>
            <div className="flex items-center space-x-4">
              {comparisonCards.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('compare')}
                  className="relative"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Compare ({comparisonCards.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="explore" className="flex items-center">
              <Search className="w-4 h-4 mr-2" />
              Explore Cards
            </TabsTrigger>
            <TabsTrigger value="ai-chat" className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Compare ({comparisonCards.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Search & Filters
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="ml-auto text-red-500"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear All
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Bar */}
                <div>
                  <Input
                    placeholder="Search credit cards by name, bank, or benefits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Filter Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Bank Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Bank</label>
                    <div className="space-y-2">
                      {uniqueBanks.map((bank) => (
                        <label key={bank} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.banks?.includes(bank) || false}
                            onChange={(e) => {
                              const banks = filters.banks || []
                              if (e.target.checked) {
                                handleFilterChange('banks', [...banks, bank])
                              } else {
                                handleFilterChange('banks', banks.filter(b => b !== bank))
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{bank}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <div className="space-y-2">
                      {uniqueCategories.map((category) => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.categories?.includes(category) || false}
                            onChange={(e) => {
                              const categories = filters.categories || []
                              if (e.target.checked) {
                                handleFilterChange('categories', [...categories, category])
                              } else {
                                handleFilterChange('categories', categories.filter(c => c !== category))
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Features Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Features</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.loungeAccess === true}
                          onChange={(e) => handleFilterChange('loungeAccess', e.target.checked ? true : null)}
                          className="mr-2"
                        />
                        <span className="text-sm">Lounge Access</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.fuelCashback === true}
                          onChange={(e) => handleFilterChange('fuelCashback', e.target.checked ? true : null)}
                          className="mr-2"
                        />
                        <span className="text-sm">Fuel Cashback</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.noAnnualFee === true}
                          onChange={(e) => handleFilterChange('noAnnualFee', e.target.checked ? true : null)}
                          className="mr-2"
                        />
                        <span className="text-sm">No Annual Fee</span>
                      </label>
                    </div>
                  </div>

                  {/* Max Annual Fee */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Annual Fee</label>
                    <Input
                      type="number"
                      placeholder="Enter max fee"
                      value={filters.maxAnnualFee || ''}
                      onChange={(e) => handleFilterChange('maxAnnualFee', e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'All Credit Cards'}
                  <span className="text-gray-500 ml-2">({filteredCards.length} cards)</span>
                </h2>
              </div>

              <CreditCardGrid
                cards={filteredCards}
                onAddToComparison={handleAddToComparison}
                comparisonCards={comparisonCards.map(c => c.id)}
              />
            </div>
          </TabsContent>

          <TabsContent value="ai-chat">
            <Card className="h-[800px]">
              <AIChat
                onAddToComparison={handleAddToComparison}
                comparisonCards={comparisonCards.map(c => c.id)}
              />
            </Card>
          </TabsContent>

          <TabsContent value="compare">
            <ComparisonTable
              cards={comparisonCards}
              onRemoveCard={handleRemoveFromComparison}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
