'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { CreditCard } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { generateCardSummary } from '@/lib/ai-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Plane, Fuel, CreditCard as CreditCardIcon, Loader2, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import creditCardsData from '@/data/credit-cards.json'

const creditCards: CreditCard[] = creditCardsData as CreditCard[]

export default function CardDetailPage() {
  const params = useParams()
  const [card, setCard] = useState<CreditCard | null>(null)
  const [prosCons, setProsCons] = useState<{ pros: string[], cons: string[] } | null>(null)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)

  useEffect(() => {
    if (params.id) {
      const foundCard = creditCards.find(c => c.id === params.id)
      setCard(foundCard || null)
    }
  }, [params.id])

  useEffect(() => {
    if (card) {
      loadAIAnalysis()
    }
  }, [card])

  const loadAIAnalysis = async () => {
    if (!card) return
    
    setIsLoadingAnalysis(true)
    try {
      const analysis = await generateCardSummary(card)
      setProsCons(analysis)
    } catch (error) {
      console.error('Error loading AI analysis:', error)
    } finally {
      setIsLoadingAnalysis(false)
    }
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Card not found</h3>
          <p className="mt-1 text-sm text-gray-500">The credit card you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cards
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Card Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">{card.name}</CardTitle>
                <p className="text-xl text-gray-600 mt-2">{card.bank}</p>
              </div>
              <Badge variant={card.category === 'Premium' ? 'default' : 'secondary'} className="text-lg px-3 py-1">
                {card.category}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Annual Fee</p>
                        <p className="text-lg font-semibold">{card.annualFee === 0 ? 'Free' : formatCurrency(card.annualFee)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Joining Fee</p>
                        <p className="text-lg font-semibold">{card.joiningFee === 0 ? 'Free' : formatCurrency(card.joiningFee)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cashback Rate</p>
                        <p className="text-lg font-semibold">{card.cashbackRate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Network</p>
                        <p className="text-lg font-semibold">{card.networkType}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Reward Type</p>
                      <p className="text-lg font-semibold">{card.rewardType}</p>
                      <p className="text-sm text-gray-500">{card.rewardRate}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Eligibility</p>
                      <p className="text-sm">{card.eligibility}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        {card.loungeAccess ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span>Airport Lounge Access</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {card.fuelCashback ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span>Fuel Cashback</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {card.contactless ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span>Contactless Payments</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cashback Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Online Shopping</p>
                      <p className="font-semibold">{card.onlineShoppingCashback}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dining</p>
                      <p className="font-semibold">{card.diningCashback}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="benefits">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {card.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      AI Analysis
                      {isLoadingAnalysis && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingAnalysis ? (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                        <p className="text-gray-500">Analyzing card features...</p>
                      </div>
                    ) : prosCons ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-green-600 mb-3">Pros</h4>
                          <ul className="space-y-2">
                            {prosCons.pros.map((pro, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-sm">{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-red-600 mb-3">Cons</h4>
                          <ul className="space-y-2">
                            {prosCons.cons.map((con, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                <span className="text-sm">{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Failed to load AI analysis.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Best For</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {card.bestFor.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">Apply Now</Button>
                <Button variant="outline" className="w-full">Compare with Others</Button>
                <Button variant="outline" className="w-full">Save to Favorites</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 