import { NextResponse } from 'next/server'

// In-memory cache for stock prices
const priceCache: Record<string, { price: number; timestamp: number }> = {}
const CACHE_DURATION = 15 * 1000 // 15 seconds in milliseconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    
    if (!symbol) {
      return NextResponse.json(
        { status: 'error', message: 'Symbol parameter is required' },
        { status: 400 }
      )
    }
    
    const now = Date.now()
    
    // Return cached price if still valid
    if (priceCache[symbol] && (now - priceCache[symbol].timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        status: 'success',
        symbol,
        price: priceCache[symbol].price,
        lastUpdated: new Date(priceCache[symbol].timestamp).toISOString(),
        cached: true
      })
    }
    
    // Fetch fresh price from Finnhub
    const apiKey = process.env.FINNHUB_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { status: 'error', message: 'API key not configured' },
        { status: 500 }
      )
    }
    
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
      { next: { revalidate: 15 } } // Next.js cache for 15 seconds
    )
    
    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Finnhub quote API returns: { c: currentPrice, ... }
    if (data.c && data.c > 0) {
      priceCache[symbol] = {
        price: data.c,
        timestamp: now
      }
      
      return NextResponse.json({
        status: 'success',
        symbol,
        price: data.c,
        lastUpdated: new Date(now).toISOString(),
        cached: false
      })
    }
    
    throw new Error('Invalid response from Finnhub')
    
  } catch (error) {
    console.error('Failed to fetch stock price:', error)
    
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch stock price'
      },
      { status: 500 }
    )
  }
}
