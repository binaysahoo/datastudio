'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts'
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react'

interface StockTrendChartProps {
  symbol: string
  name: string
}

interface HistoricalData {
  date: string
  price: number
  displayDate: string
  timestamp?: number // Full timestamp for intraday matching
}

export default function StockTrendChart({ symbol, name }: StockTrendChartProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y'>('3M')

  useEffect(() => {
    async function fetchHistoricalData() {
      setLoading(true)
      try {
        // Map timeRange to Twelve Data intervals and output size
        let interval: string
        let outputsize: number
        
        if (timeRange === '1D') {
          interval = '15min' // 15-minute intervals for 1 day
          outputsize = 96 // 24 hours * 4 per hour
        } else if (timeRange === '1W') {
          interval = '1h' // Hourly for 1 week
          outputsize = 168 // 7 days * 24 hours
        } else if (timeRange === '1M') {
          interval = '1day' // Daily for 1 month
          outputsize = 30
        } else if (timeRange === '3M') {
          interval = '1day' // Daily for 3 months
          outputsize = 90
        } else if (timeRange === '6M') {
          interval = '1day' // Daily for 6 months
          outputsize = 180
        } else {
          interval = '1day' // Daily for 1 year
          outputsize = 365
        }
        
        const response = await fetch(
          `/api/stock-history?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}`
        )
        
        if (!response.ok) throw new Error('Failed to fetch')
        
        const data = await response.json()
        
        if (data.status === 'success' && data.values && Array.isArray(data.values)) {
          // Twelve Data returns values in reverse chronological order (newest first)
          // We need to reverse it for chart display (oldest to newest)
          const chartData: HistoricalData[] = data.values
            .reverse()
            .map((item: any) => {
              const date = new Date(item.datetime)
              let displayDate: string
              
              if (timeRange === '1D') {
                // Show time for 1 day view
                displayDate = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
              } else if (timeRange === '1W') {
                // Show day and time for 1 week view
                displayDate = date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric' })
              } else {
                // Show date for longer ranges
                displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }
              
              return {
                date: date.toISOString().split('T')[0],
                price: parseFloat(item.close),
                displayDate,
                timestamp: date.getTime()
              }
            })
          setHistoricalData(chartData)
        } else {
          // Fallback to mock data if API returns error
          const daysBack = timeRange === '1D' ? 1 : timeRange === '1W' ? 7 : timeRange === '1M' ? 30 : timeRange === '3M' ? 90 : timeRange === '6M' ? 180 : 365
          const resolution = timeRange === '1D' ? '15' : timeRange === '1W' ? '60' : 'D'
          generateMockData(daysBack, resolution)
        }
      } catch (error) {
        console.error('Error fetching historical data:', error)
        const daysBack = timeRange === '1D' ? 1 : timeRange === '1W' ? 7 : timeRange === '1M' ? 30 : timeRange === '3M' ? 90 : timeRange === '6M' ? 180 : 365
        const resolution = timeRange === '1D' ? '15' : timeRange === '1W' ? '60' : 'D'
        generateMockData(daysBack, resolution)
      } finally {
        setLoading(false)
      }
    }

    function generateMockData(days: number, resolution: string) {
      const currentPrice: Record<string, number> = {
        'SNPS': 482,
        'CDNS': 320,
        'QCOM': 189,
        'NVDA': 892,
        'AVGO': 1312,
        'INTC': 42,
      }
      
      // Historical peaks for more realistic data (SNPS peaked at ~$650 in Aug 2025)
      const historicalPeaks: Record<string, { peakPrice: number, peakMonthsAgo: number }> = {
        'SNPS': { peakPrice: 650, peakMonthsAgo: 8 }, // Aug 2025
        'CDNS': { peakPrice: 380, peakMonthsAgo: 10 },
        'QCOM': { peakPrice: 210, peakMonthsAgo: 6 },
        'NVDA': { peakPrice: 950, peakMonthsAgo: 4 },
        'AVGO': { peakPrice: 1400, peakMonthsAgo: 5 },
        'INTC': { peakPrice: 52, peakMonthsAgo: 12 },
      }
      
      const price = currentPrice[symbol] || 100
      const peak = historicalPeaks[symbol] || { peakPrice: price * 1.2, peakMonthsAgo: 6 }
      const data: HistoricalData[] = []
      const now = Date.now()
      
      // Determine interval in milliseconds
      let intervalMs: number
      let iterations: number
      
      if (resolution === '15') {
        // 15-minute intervals for 1 day
        intervalMs = 15 * 60 * 1000
        iterations = 96 // 24 hours * 4 per hour
      } else if (resolution === '60') {
        // Hourly intervals for 1 week
        intervalMs = 60 * 60 * 1000
        iterations = days * 24
      } else {
        // Daily intervals
        intervalMs = 24 * 60 * 60 * 1000
        iterations = days
      }
      
      for (let i = iterations; i >= 0; i--) {
        const date = new Date(now - i * intervalMs)
        const randomChange = (Math.random() - 0.5) * 0.02 // ±1% variation
        
        let historicalPrice: number
        
        if (resolution === 'D' && days >= 180) {
          // For longer time ranges, show realistic trend with peak
          const progress = (iterations - i) / iterations // 0 to 1
          const peakPosition = 1 - (peak.peakMonthsAgo * 30 / days) // Where peak occurred
          
          // Calculate realistic start price (slightly above current for gradual trend)
          const startPrice = price + (peak.peakPrice - price) * 0.25 // Start 25% up from current toward peak
          
          if (progress < peakPosition) {
            // Rising to peak from start price
            const riseProgress = progress / peakPosition
            historicalPrice = startPrice + (peak.peakPrice - startPrice) * riseProgress
          } else {
            // Declining from peak to current
            const fallProgress = (progress - peakPosition) / (1 - peakPosition)
            historicalPrice = peak.peakPrice - (peak.peakPrice - price) * fallProgress
          }
          historicalPrice = historicalPrice * (1 + randomChange)
        } else {
          // Shorter time ranges: simpler trend
          const trendFactor = (iterations - i) / iterations * 0.05
          historicalPrice = price * (0.98 + trendFactor + randomChange)
        }
        
        let displayDate: string
        if (resolution === '15') {
          displayDate = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        } else if (resolution === '60') {
          displayDate = date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric' })
        } else {
          displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }
        
        data.push({
          date: date.toISOString().split('T')[0],
          price: Math.round(historicalPrice * 100) / 100,
          displayDate,
          timestamp: date.getTime() // Store full timestamp for accurate matching
        })
      }
      
      setHistoricalData(data)
    }

    fetchHistoricalData()
  }, [symbol, timeRange])

  const priceChange = historicalData.length > 1 
    ? ((historicalData[historicalData.length - 1].price - historicalData[0].price) / historicalData[0].price * 100)
    : 0

  const isPositive = priceChange >= 0

  // Calculate current time pointer for intraday views (1D, 1W)
  const showTimePointer = timeRange === '1D' || timeRange === '1W'
  let currentTimeIndex = -1
  
  if (showTimePointer && historicalData.length > 0) {
    // Get current time in New York (stock market timezone)
    const now = new Date()
    const nyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
    const currentTimestamp = nyTime.getTime()
    
    // Find closest data point to current NY time
    let minDiff = Infinity
    historicalData.forEach((dataPoint, index) => {
      if (dataPoint.timestamp) {
        const diff = Math.abs(currentTimestamp - dataPoint.timestamp)
        if (diff < minDiff) {
          minDiff = diff
          currentTimeIndex = index
        }
      }
    })
  }

  return (
    <motion.div
      key={symbol}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
            {symbol} - {name}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
              ${historicalData.length > 0 ? historicalData[historicalData.length - 1].price.toFixed(2) : '---'}
            </span>
            <span className={`flex items-center gap-1 text-sm font-semibold ${
              isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mt-4 md:mt-0">
          {(['1D', '1W', '1M', '3M', '6M', '1Y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-72">
        {loading ? (
          <div className="flex items-center justify-center h-full bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <Calendar className="w-5 h-5 animate-pulse" />
              <span>Loading historical data...</span>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalData}>
              <defs>
                <linearGradient id={`stockGradient${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-neutral-700" opacity={0.3} />
              <XAxis
                dataKey="displayDate"
                stroke="#94a3b8"
                fontSize={11}
                interval={Math.floor(historicalData.length / 8)}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: '#374151', fontWeight: 600 }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? '#10b981' : '#ef4444'}
                fill={`url(#stockGradient${symbol})`}
                strokeWidth={2}
              />
              {/* Current Time Marker - Only for intraday views */}
              {showTimePointer && currentTimeIndex >= 0 && currentTimeIndex < historicalData.length && (
                <>
                  <ReferenceLine
                    x={historicalData[currentTimeIndex].displayDate}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    label={{
                      value: 'Now (NY)',
                      position: 'top',
                      fill: '#3b82f6',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  />
                  <ReferenceDot
                    x={historicalData[currentTimeIndex].displayDate}
                    y={historicalData[currentTimeIndex].price}
                    r={6}
                    fill="#3b82f6"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  )
}
