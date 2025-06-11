import { openai } from '@ai-sdk/openai'
import { generateObject, generateText } from 'ai'
import { z } from 'zod'
import { CreditCard, AIQuery, AIResponse, FilterOptions } from './types'
import { filterCards, searchCards } from './utils'
import creditCardsData from '../data/credit-cards.json'

const creditCards: CreditCard[] = creditCardsData as CreditCard[]

const querySchema = z.object({
  intent: z.enum(['search', 'compare', 'recommend']).describe('The user intent: search for cards, compare specific cards, or get recommendations'),
  filters: z.object({
    banks: z.array(z.string()).optional().describe('Banks to filter by (HDFC Bank, ICICI Bank, Axis Bank, State Bank of India)'),
    categories: z.array(z.string()).optional().describe('Card categories (Premium, Mid-tier, Entry-level, Cashback)'),
    loungeAccess: z.boolean().optional().describe('Whether lounge access is required'),
    fuelCashback: z.boolean().optional().describe('Whether fuel cashback is required'),
    noAnnualFee: z.boolean().optional().describe('Whether no annual fee is required'),
    networkTypes: z.array(z.string()).optional().describe('Network types (Visa, Mastercard, RuPay)'),
    maxAnnualFee: z.number().optional().describe('Maximum annual fee acceptable')
  }).optional(),
  cardNames: z.array(z.string()).optional().describe('Specific card names mentioned for comparison'),
  bestFor: z.array(z.string()).optional().describe('Categories the user is interested in (Travel, Dining, Shopping, etc.)')
})

export async function processAIQuery(userQuery: string): Promise<AIResponse> {
  try {
    // Parse the user query to extract intent and filters
    const { object: parsedQuery } = await generateObject({
      model: openai('gpt-4'),
      prompt: `
        Analyze this credit card query and extract the user's intent and any filters:
        "${userQuery}"
        
        Available banks: HDFC Bank, ICICI Bank, Axis Bank, State Bank of India
        Available categories: Premium, Mid-tier, Entry-level, Cashback
        Available networks: Visa, Mastercard, RuPay
        
        Extract filters based on keywords like:
        - "lounge access", "airport lounge" -> loungeAccess: true
        - "fuel cashback", "petrol cashback" -> fuelCashback: true
        - "no annual fee", "free card" -> noAnnualFee: true
        - "best for travel", "travel cards" -> bestFor: ["Travel"]
        - "under 5000", "below 2000" -> maxAnnualFee: number
        
        For comparison queries, extract specific card names mentioned.
      `,
      schema: querySchema,
    })

    let results: CreditCard[] = creditCards

    // Apply filters based on parsed query
    if (parsedQuery.filters) {
      results = filterCards(results, parsedQuery.filters)
    }

    // Filter by bestFor categories
    if (parsedQuery.bestFor && parsedQuery.bestFor.length > 0) {
      results = results.filter(card => 
        parsedQuery.bestFor!.some(category => 
          card.bestFor.some(cardCategory => 
            cardCategory.toLowerCase().includes(category.toLowerCase())
          )
        )
      )
    }

    // Handle specific card comparisons
    if (parsedQuery.intent === 'compare' && parsedQuery.cardNames && parsedQuery.cardNames.length > 0) {
      results = creditCards.filter(card => 
        parsedQuery.cardNames!.some(name => 
          card.name.toLowerCase().includes(name.toLowerCase()) ||
          card.bank.toLowerCase().includes(name.toLowerCase())
        )
      )
    }

    // Generate AI response message
    const responseMessage = await generateResponseMessage(userQuery, results, parsedQuery.intent)

    // Generate recommendations if needed
    let recommendations: string[] = []
    if (parsedQuery.intent === 'recommend' && results.length > 0) {
      recommendations = await generateRecommendations(results.slice(0, 3))
    }

    return {
      cards: results,
      message: responseMessage,
      comparison: parsedQuery.intent === 'compare',
      recommendations: recommendations.length > 0 ? recommendations : undefined
    }
  } catch (error) {
    console.error('AI query processing error:', error)
    
    // Fallback to simple text search
    const results = searchCards(creditCards, userQuery)
    
    return {
      cards: results,
      message: `Found ${results.length} credit cards matching your search for "${userQuery}".`,
      comparison: false
    }
  }
}

async function generateResponseMessage(userQuery: string, results: CreditCard[], intent: string): Promise<string> {
  const { text } = await generateText({
    model: openai('gpt-4'),
    prompt: `
      User asked: "${userQuery}"
      Intent: ${intent}
      Found ${results.length} credit cards.
      
      Generate a helpful response message that:
      1. Acknowledges their query
      2. Mentions how many cards were found
      3. Gives a brief summary of the results
      4. Is conversational and helpful
      
      Keep it concise (1-2 sentences).
    `,
  })

  return text
}

async function generateRecommendations(cards: CreditCard[]): Promise<string[]> {
  const { text } = await generateText({
    model: openai('gpt-4'),
    prompt: `
      Analyze these credit cards and provide 3-4 concise bullet points about why each is recommended:
      
      ${cards.map(card => `
        ${card.name} (${card.bank}):
        - Annual Fee: ₹${card.annualFee}
        - Cashback Rate: ${card.cashbackRate}
        - Best For: ${card.bestFor.join(', ')}
        - Benefits: ${card.benefits.slice(0, 2).join(', ')}
      `).join('\n')}
      
      Format as bullet points, one key benefit per card.
    `,
  })

  return text.split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(1).trim())
}

export async function generateCardSummary(card: CreditCard): Promise<{ pros: string[], cons: string[] }> {
  try {
    const { text } = await generateText({
      model: openai('gpt-4'),
      prompt: `
        Analyze this credit card and provide pros and cons:
        
        ${card.name} (${card.bank}):
        - Annual Fee: ₹${card.annualFee}
        - Joining Fee: ₹${card.joiningFee}
        - Cashback Rate: ${card.cashbackRate}
        - Lounge Access: ${card.loungeAccess ? 'Yes' : 'No'}
        - Fuel Cashback: ${card.fuelCashback ? 'Yes' : 'No'}
        - Best For: ${card.bestFor.join(', ')}
        - Benefits: ${card.benefits.join(', ')}
        - Eligibility: ${card.eligibility}
        
        Provide 3-4 pros and 2-3 cons in this format:
        PROS:
        - [pro 1]
        - [pro 2]
        
        CONS:
        - [con 1]
        - [con 2]
      `,
    })

    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const prosIndex = lines.findIndex(line => line.toUpperCase().includes('PROS'))
    const consIndex = lines.findIndex(line => line.toUpperCase().includes('CONS'))
    
    const pros = lines.slice(prosIndex + 1, consIndex).filter(line => line.startsWith('-')).map(line => line.substring(1).trim())
    const cons = lines.slice(consIndex + 1).filter(line => line.startsWith('-')).map(line => line.substring(1).trim())
    
    return { pros, cons }
  } catch (error) {
    console.error('Error generating card summary:', error)
    return {
      pros: [`${card.cashbackRate} cashback rate`, `${card.rewardType} rewards`],
      cons: [`₹${card.annualFee} annual fee`]
    }
  }
} 