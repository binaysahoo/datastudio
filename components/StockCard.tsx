'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Clock } from 'lucide-react'
import AnimatedNumber from './AnimatedNumber'

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  currency: string
  isLive?: boolean
}

interface StockCardProps {
  symbol: string
  name: string
  index: number
  isSelected?: boolean
  onClick?: () => void
}

export default function StockCard({ symbol, name, index, isSelected = false, onClick }: StockCardProps) {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [, setTick] = useState(0) // Force re-render for time updates

  useEffect(() => {
    async function fetchStockData() {
      try {
        // Use API key from build-time environment variable (GitHub Secret)
        const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY
        
        if (!FINNHUB_API_KEY) {
          throw new Error('API key not configured')
        }
        
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          }
        )
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        // Finnhub response: { c: current, pc: previous close, d: change, dp: change percent }
        if (data.c && data.c > 0) {
          const currentPrice = data.c
          const change = data.d || 0
          const changePercent = data.dp || 0

          setStockData({
            symbol: symbol,
            name: name,
            price: currentPrice,
            change: change,
            changePercent: changePercent,
            currency: 'USD',
            isLive: true,
          })
          setLastUpdated(new Date())
          setError(null)
          setLoading(false)
          return // Success, exit function
        }
        
        // If Finnhub fails, throw to use fallback
        throw new Error('Invalid Finnhub response')
      } catch (err) {
        console.error(`Error fetching ${symbol}:`, err)
        
        // Fallback to recent approximate market data (Updated: April 2026)
        const recentData: Record<string, { price: number; change: number; changePercent: number }> = {
          'SNPS': { price: 482.35, change: -16.19, changePercent: -3.25 },
          'CDNS': { price: 319.98, change: -16.56, changePercent: -4.92 },
          'QCOM': { price: 189.45, change: 3.72, changePercent: 2.00 },
          'NVDA': { price: 892.50, change: 15.45, changePercent: 1.76 },
          'AVGO': { price: 1312.80, change: 18.92, changePercent: 1.46 },
        }
        
        const fallbackData = recentData[symbol] || { 
          price: 100, 
          change: (Math.random() - 0.5) * 5,
          changePercent: (Math.random() - 0.5) * 2 
        }
        
        const mockPrice = fallbackData.price
        const mockChange = fallbackData.change
        const mockChangePercent = fallbackData.changePercent
        
        setStockData({
          symbol: symbol,
          name: name,
          price: mockPrice,
          change: mockChange,
          changePercent: mockChangePercent,
          currency: 'USD',
          isLive: false,
        })
        setLastUpdated(new Date())
        setError(null) // Don't show error, use fallback data
      }
      
      setLoading(false)
    }

    fetchStockData()
    
    // Refresh every 15 seconds for real-time updates
    const interval = setInterval(fetchStockData, 15 * 1000)
    
    // Update "time ago" display every second
    const tickInterval = setInterval(() => setTick(t => t + 1), 1000)
    
    return () => {
      clearInterval(interval)
      clearInterval(tickInterval)
    }
  }, [symbol, name])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass-card p-6"
      >
        <div className="animate-pulse">
          <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-24 mb-3"></div>
          <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-32 mb-2"></div>
          <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-20"></div>
        </div>
      </motion.div>
    )
  }

  if (error || !stockData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass-card p-6"
      >
        <p className="text-sm text-red-500">Failed to load {symbol}</p>
      </motion.div>
    )
  }

  const isPositive = stockData.change >= 0
  const colorClass = isPositive
    ? 'from-emerald-500 to-teal-500'
    : 'from-red-500 to-rose-500'

  const getTimeAgo = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000)
    if (seconds < 15) return 'Just now'
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={`glass-card p-6 hover:scale-105 transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg shadow-blue-500/20' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              NASDAQ: {stockData.symbol}
            </p>
            {!stockData.isLive && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
                Demo
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {stockData.name}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            <AnimatedNumber 
              value={stockData.price} 
              decimals={2} 
              prefix="$" 
              suffix={` ${stockData.currency}`}
            />
          </h3>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClass}`}>
          {isPositive ? (
            <TrendingUp className="w-5 h-5 text-white" />
          ) : (
            <TrendingDown className="w-5 h-5 text-white" />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between flex-wrap">
        <span
          className={`text-sm font-semibold ${
            isPositive ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          <AnimatedNumber 
            value={stockData.change} 
            decimals={2} 
            prefix={isPositive ? '+' : ''}
          />
          {' '}
          (<AnimatedNumber 
            value={stockData.changePercent} 
            decimals={2} 
            suffix="%"
          />)
        </span>
        <span className="text-xs text-slate-500">today</span>
      </div>
      <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
        <Clock className="w-3 h-3" />
        <span>{getTimeAgo()}</span>
      </div>
    </motion.div>
  )
}
