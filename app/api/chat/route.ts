import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import creditCardsData from '@/data/credit-cards.json'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Create a system prompt with credit card data context
    const systemPrompt = `You are a helpful credit card comparison assistant. You have access to a comprehensive database of Indian credit cards. 

Here are some of the available credit cards in our database:
${creditCardsData.slice(0, 10).map(card => 
  `- ${card.name} by ${card.bank}: ${card.category} category, ₹${card.annualFee} annual fee, ${card.cashbackRate} cashback rate, ${card.loungeAccess ? 'with' : 'without'} lounge access`
).join('\n')}

When users ask about credit cards, provide helpful, accurate information based on this data. Be conversational and helpful. If asked about specific comparisons, highlight key differences in features, fees, and benefits. Always be honest about the limitations of any card and suggest alternatives when appropriate.

Keep responses concise but informative. Focus on the most relevant details for the user's query.`

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 500,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error in chat API:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
} 