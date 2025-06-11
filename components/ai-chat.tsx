'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Send, MessageSquare, Loader2 } from 'lucide-react'
import { CreditCard, AIResponse } from '@/lib/types'
import { CreditCardGrid } from './credit-card-grid'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  cards?: CreditCard[]
  recommendations?: string[]
}

interface AIChatProps {
  onAddToComparison?: (card: CreditCard) => void
  comparisonCards?: string[]
}

export function AIChat({ onAddToComparison, comparisonCards }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I can help you find the perfect credit card. Try asking me something like "Best cards with airport lounge access" or "Compare HDFC Infinia vs Axis Magnus".',
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const aiResponse: AIResponse = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.message,
        cards: aiResponse.cards,
        recommendations: aiResponse.recommendations
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl w-full ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white rounded-lg p-3'
                  : 'space-y-4'
              }`}
            >
              {message.type === 'user' ? (
                <p>{message.content}</p>
              ) : (
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {message.recommendations && message.recommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {message.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span className="text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {message.cards && message.cards.length > 0 && (
                    <div>
                      <CreditCardGrid
                        cards={message.cards}
                        onAddToComparison={onAddToComparison}
                        comparisonCards={comparisonCards}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-xs">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about credit cards... (e.g., 'Best travel cards with lounge access')"
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
        
        <div className="mt-2 text-xs text-gray-500">
          Try: "Best cards for online shopping" • "Compare HDFC vs ICICI cards" • "Cards with no annual fee"
        </div>
      </div>
    </div>
  )
} 