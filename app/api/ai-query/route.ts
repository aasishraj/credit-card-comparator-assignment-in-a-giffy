import { NextRequest, NextResponse } from 'next/server'
import { processAIQuery } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    const result = await processAIQuery(query)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('AI Query API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 