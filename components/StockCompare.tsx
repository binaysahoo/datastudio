'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, TrendingDown, Plus, X } from 'lucide-react'

interface StockCompareProps {
  initialSymbols: string[]
  availableStocks: Array<{ symbol: string; name: string }>
}

interface StockData {
  timestamp: number
  displayDate: string
  [key: string]: number | string // Dynamic keys for each stock symbol
}

const STOCK_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
]

export default function StockCompare({ initialSymbols, availableStocks }: StockCompareProps) {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(initialSymbols)
  const [chartData, setChartData] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y'>('1D')
  const [showAddStock, setShowAddStock] = useState(false)

  useEffect(() => {
    async function fetchAllStocksData() {
      setLoading(true)
      try {
        // Map timeRange to Twelve Data intervals and output size
        let interval: string
        let outputsize: number
        
        if (timeRange === '1D') {
          interval = '15min'
          outputsize = 50 // Request extra data to ensure we capture from market open (9:30 AM ET)
        } else if (timeRange === '1W') {
          interval = '1h'
          outputsize = 168
        } else if (timeRange === '1M') {
          interval = '1day'
          outputsize = 30
        } else if (timeRange === '3M') {
          interval = '1day'
          outputsize = 90
        } else if (timeRange === '6M') {
          interval = '1day'
          outputsize = 180
        } else {
          interval = '1day'
          outputsize = 365
        }
        
        const TWELVE_DATA_API_KEY = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY
        
        if (!TWELVE_DATA_API_KEY) {
          throw new Error('Twelve Data API key not configured')
        }

        // Fetch data for all selected stocks
        const promises = selectedSymbols.map(symbol =>
          fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${TWELVE_DATA_API_KEY}`)
            .then(res => res.json())
            .then(data => ({ symbol, data }))
        )

        const results = await Promise.all(promises)
        
        // Combine all stock data into a single timeline
        const timelineMap = new Map<number, StockData>()
        
        results.forEach(({ symbol, data }) => {
          if (data.values && Array.isArray(data.values)) {
            data.values.forEach((item: any) => {
              const date = new Date(item.datetime)
              const timestamp = date.getTime()
              
              let displayDate: string
              if (timeRange === '1D') {
                displayDate = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
              } else if (timeRange === '1W') {
                displayDate = date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric' })
              } else {
                displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }
              
              if (!timelineMap.has(timestamp)) {
                timelineMap.set(timestamp, {
                  timestamp,
                  displayDate,
                })
              }
              
              const entry = timelineMap.get(timestamp)!
              entry[symbol] = parseFloat(item.close)
            })
          }
        })
        
        // Convert map to array and sort by timestamp
        const combined = Array.from(timelineMap.values()).sort((a, b) => a.timestamp - b.timestamp)
        setChartData(combined)
      } catch (error) {
        console.error('Error fetching stock data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (selectedSymbols.length > 0) {
      fetchAllStocksData()
    }
  }, [selectedSymbols, timeRange])

  const toggleStock = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      // Don't allow removing the last stock
      if (selectedSymbols.length > 1) {
        setSelectedSymbols(selectedSymbols.filter(s => s !== symbol))
      }
    } else {
      // Limit to 6 stocks max
      if (selectedSymbols.length < 6) {
        setSelectedSymbols([...selectedSymbols, symbol])
      }
    }
  }

  const timeRanges: Array<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y'> = ['1D', '1W', '1M', '3M', '6M', '1Y']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6"
    >
      {/* Header with stock chips */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {selectedSymbols.map((symbol, index) => {
          const stockInfo = availableStocks.find(s => s.symbol === symbol)
          return (
            <div
              key={symbol}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{
                backgroundColor: STOCK_COLORS[index % STOCK_COLORS.length] + '20',
                border: `2px solid ${STOCK_COLORS[index % STOCK_COLORS.length]}`,
              }}
            >
              <span style={{ color: STOCK_COLORS[index % STOCK_COLORS.length] }}>
                {stockInfo?.name || symbol}
              </span>
              {selectedSymbols.length > 1 && (
                <button
                  onClick={() => toggleStock(symbol)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X className="w-4 h-4" style={{ color: STOCK_COLORS[index % STOCK_COLORS.length] }} />
                </button>
              )}
            </div>
          )
        })}
        
        {selectedSymbols.length < 6 && (
          <button
            onClick={() => setShowAddStock(!showAddStock)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Compare
          </button>
        )}
      </div>

      {/* Add stock dropdown */}
      {showAddStock && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
        >
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Add stock to compare:</p>
          <div className="flex flex-wrap gap-2">
            {availableStocks
              .filter(stock => !selectedSymbols.includes(stock.symbol))
              .map(stock => (
                <button
                  key={stock.symbol}
                  onClick={() => {
                    toggleStock(stock.symbol)
                    setShowAddStock(false)
                  }}
                  className="px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {stock.symbol} - {stock.name}
                </button>
              ))}
          </div>
        </motion.div>
      )}

      {/* Time range buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {timeRanges.map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === range
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-96">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse text-slate-500 dark:text-slate-400">Loading comparison...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis 
                dataKey="displayDate" 
                stroke="#94a3b8" 
                fontSize={12}
                angle={timeRange === '1D' ? -45 : 0}
                textAnchor={timeRange === '1D' ? 'end' : 'middle'}
                height={timeRange === '1D' ? 60 : 30}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  padding: '12px',
                }}
                formatter={(value: any, name: string) => [`$${parseFloat(value).toFixed(2)}`, availableStocks.find(s => s.symbol === name)?.name || name]}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => availableStocks.find(s => s.symbol === value)?.name || value}
              />
              {selectedSymbols.map((symbol, index) => (
                <Line
                  key={symbol}
                  type="monotone"
                  dataKey={symbol}
                  stroke={STOCK_COLORS[index % STOCK_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          💡 Compare up to 6 stocks side-by-side. Click "Compare" to add more stocks.
        </p>
      </div>
    </motion.div>
  )
}
