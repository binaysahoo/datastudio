import { NextResponse } from 'next/server'

// In-memory cache
let cachedRate: number | null = null
let lastFetched: number = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export async function GET() {
  try {
    const now = Date.now()
    
    // Return cached rate if still valid
    if (cachedRate && (now - lastFetched) < CACHE_DURATION) {
      return NextResponse.json({
        status: 'success',
        rate: cachedRate,
        lastUpdated: new Date(lastFetched).toISOString(),
        cached: true
      })
    }
    
    // Fetch fresh rate from a free exchange rate API
    // Using exchangerate-api.com (free tier: 1,500 requests/month, no auth required)
    const response = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD',
      { next: { revalidate: 3600 } } // Next.js cache for 1 hour
    )
    
    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // exchangerate-api.com returns: { base: "USD", rates: { INR: 94.97, ... } }
    if (data.rates && data.rates.INR && data.rates.INR > 0) {
      cachedRate = data.rates.INR
      lastFetched = now
      
      return NextResponse.json({
        status: 'success',
        rate: cachedRate,
        lastUpdated: new Date(lastFetched).toISOString(),
        cached: false
      })
    }
    
    // Fallback if response structure is unexpected
    throw new Error('Invalid response structure from exchange rate API')
    
  } catch (error) {
    console.error('Failed to fetch USD to INR rate:', error)
    
    // Return cached rate if available, otherwise fallback
    const fallbackRate = cachedRate || 94.62
    
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch exchange rate',
        rate: fallbackRate,
        lastUpdated: new Date(lastFetched || Date.now()).toISOString(),
        cached: !!cachedRate
      },
      { status: cachedRate ? 200 : 500 }
    )
  }
}
