import { NextResponse } from 'next/server'

// In-memory cache for stock prices
interface CachedQuote {
  price: number
  previousClose: number
  change: number
  changePercent: number
  high?: number
  low?: number
  open?: number
  timestamp: number
}

const priceCache: Record<string, CachedQuote> = {}
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
      const cached = priceCache[symbol]
      return NextResponse.json({
        status: 'success',
        symbol,
        price: cached.price,
        previousClose: cached.previousClose,
        change: cached.change,
        changePercent: cached.changePercent,
        high: cached.high,
        low: cached.low,
        open: cached.open,
        lastUpdated: new Date(cached.timestamp).toISOString(),
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
    
    // Finnhub quote API returns: { c: current, pc: previous close, d: change, dp: change percent, h: high, l: low, o: open }
    if (data.c && data.c > 0) {
      const quoteData = {
        price: data.c,
        previousClose: data.pc || data.c,
        change: data.d || 0,
        changePercent: data.dp || 0,
        high: data.h,
        low: data.l,
        open: data.o,
        timestamp: now
      }
      
      priceCache[symbol] = quoteData
      
      return NextResponse.json({
        status: 'success',
        symbol,
        price: quoteData.price,
        previousClose: quoteData.previousClose,
        change: quoteData.change,
        changePercent: quoteData.changePercent,
        high: quoteData.high,
        low: quoteData.low,
        open: quoteData.open,
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
