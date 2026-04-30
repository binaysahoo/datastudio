import { NextResponse } from 'next/server'

// In-memory cache for historical stock data
interface CacheEntry {
  data: any
  timestamp: number
}

const historyCache: Record<string, CacheEntry> = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes for historical data

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const interval = searchParams.get('interval') || '1day'
    const outputsize = searchParams.get('outputsize') || '100'
    
    if (!symbol) {
      return NextResponse.json(
        { status: 'error', message: 'Symbol parameter is required' },
        { status: 400 }
      )
    }
    
    // Create cache key
    const cacheKey = `${symbol}_${interval}_${outputsize}`
    const now = Date.now()
    
    // Check cache
    if (historyCache[cacheKey] && (now - historyCache[cacheKey].timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        status: 'success',
        ...historyCache[cacheKey].data,
        cached: true
      })
    }
    
    // Fetch from Twelve Data API
    const apiKey = process.env.TWELVE_DATA_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { status: 'error', message: 'Twelve Data API key not configured' },
        { status: 500 }
      )
    }
    
    const response = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${apiKey}`,
      { next: { revalidate: 300 } } // Next.js cache for 5 minutes
    )
    
    if (!response.ok) {
      throw new Error(`Twelve Data API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Check if API returned error (e.g., invalid symbol, rate limit)
    if (data.status === 'error') {
      return NextResponse.json(
        { status: 'error', message: data.message || 'API returned error', code: data.code },
        { status: 400 }
      )
    }
    
    // Twelve Data returns: { meta: {...}, values: [{datetime, open, high, low, close, volume}], status: "ok" }
    if (data.values && Array.isArray(data.values)) {
      const result = {
        status: 'success',
        symbol: data.meta?.symbol || symbol,
        interval: data.meta?.interval || interval,
        values: data.values,
        meta: data.meta,
        cached: false
      }
      
      // Cache the result
      historyCache[cacheKey] = {
        data: result,
        timestamp: now
      }
      
      return NextResponse.json(result)
    }
    
    throw new Error('Invalid response structure from Twelve Data')
    
  } catch (error) {
    console.error('Failed to fetch stock history:', error)
    
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch stock history'
      },
      { status: 500 }
    )
  }
}
