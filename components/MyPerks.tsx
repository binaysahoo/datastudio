'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, IndianRupee, Package } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

// Constants
const INVESTMENT_USD = 22000
const BASELINE_RSU = 46
const BASELINE_PRICE = 475
const TARGET_PRICE = 650

interface PerkData {
  sharePrice: number
  rsu: number
  extraShares: number
  usdGain: number
  inrGain: number
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as PerkData
    const isGain = data.usdGain >= 0
    
    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <p className="font-semibold text-slate-900 dark:text-white mb-2">
          Share Price: ${data.sharePrice}
        </p>
        <div className="space-y-1 text-sm">
          <p className="text-slate-700 dark:text-slate-300">
            <span className="font-medium">Shares:</span> {data.rsu}
          </p>
          <p className={`${data.extraShares >= 0 ? 'text-emerald-600' : 'text-red-600'} font-medium`}>
            <span className="text-slate-700 dark:text-slate-300 font-normal">Extra Shares:</span> {data.extraShares >= 0 ? '+' : ''}{data.extraShares}
          </p>
          <p className={`${isGain ? 'text-emerald-600' : 'text-red-600'} font-medium`}>
            <span className="text-slate-700 dark:text-slate-300 font-normal">USD Gain:</span> {isGain ? '+' : ''}${data.usdGain.toLocaleString()}
          </p>
          <p className={`${isGain ? 'text-emerald-600' : 'text-red-600'} font-medium`}>
            <span className="text-slate-700 dark:text-slate-300 font-normal">INR Gain:</span> {isGain ? '+' : ''}₹{data.inrGain.toLocaleString()}
          </p>
        </div>
      </div>
    )
  }
  return null
}

function generateData(usdToInr: number): PerkData[] {
  const data: PerkData[] = []
  for (let price = 400; price <= 650; price += 1) {
    const rsu = Math.floor(INVESTMENT_USD / price)
    const extraShares = rsu - BASELINE_RSU
    const usdGain = extraShares * TARGET_PRICE
    const inrGain = Math.round(usdGain * usdToInr)
    
    data.push({
      sharePrice: price,
      rsu: rsu,
      extraShares: extraShares,
      usdGain: usdGain,
      inrGain: inrGain,
    })
  }
  return data
}

export default function MyPerks() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [livePrice, setLivePrice] = useState<number>(482.35)
  const [usdToInr, setUsdToInr] = useState<number>(94.62)
  
  useEffect(() => {
    async function fetchSNPSPrice() {
      try {
        const FINNHUB_API_KEY = 'd7oe9a9r01qsb7bejn3gd7oe9a9r01qsb7bejn40'
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=SNPS&token=${FINNHUB_API_KEY}`
        )
        
        if (response.ok) {
          const data = await response.json()
          if (data.c && data.c > 0) {
            setLivePrice(data.c)
          }
        }
      } catch (error) {
        console.error('Failed to fetch SNPS price:', error)
      }
    }
    
    fetchSNPSPrice()
    const interval = setInterval(fetchSNPSPrice, 15 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    async function fetchUSDToINR() {
      try {
        const FINNHUB_API_KEY = 'd7oe9a9r01qsb7bejn3gd7oe9a9r01qsb7bejn40'
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=OANDA:USD_INR&token=${FINNHUB_API_KEY}`
        )
        
        if (response.ok) {
          const data = await response.json()
          if (data.c && data.c > 0) {
            setUsdToInr(data.c)
          }
        }
      } catch (error) {
        console.error('Failed to fetch USD to INR rate:', error)
      }
    }
    
    fetchUSDToINR()
    const interval = setInterval(fetchUSDToINR, 15 * 1000)
    return () => clearInterval(interval)
  }, [])
  
  const data = generateData(usdToInr)
  const currentPrice = livePrice
  
  // Find exact or nearest price point
  const roundedPrice = Math.round(currentPrice)
  const currentData = data.find(d => d.sharePrice === roundedPrice) || data[75] // Default to 475 baseline

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          💎 SNPS Share Calculator
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Simulate SNPS share gains/losses from $400 to $650
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-purple-600" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Baseline Shares</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {BASELINE_RSU} @ ${BASELINE_PRICE}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-blue-600" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Live Shares</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {currentData.rsu} @ ${Math.round(currentPrice)}
          </p>
          <p className={`text-sm font-semibold mt-1 ${
            currentData.extraShares >= 0 ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {currentData.extraShares >= 0 ? '+' : ''}{currentData.extraShares} shares
          </p>
        </div>

        <div className={`bg-gradient-to-br ${
          currentData.usdGain >= 0 
            ? 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20' 
            : 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20'
        } p-4 rounded-xl`}>
          <div className="flex items-center gap-2 mb-2">
            {currentData.usdGain >= 0 ? (
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">USD Gain/Loss</p>
          </div>
          <p className={`text-2xl font-bold ${
            currentData.usdGain >= 0 ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {currentData.usdGain >= 0 ? '+' : ''}${currentData.usdGain.toLocaleString()}
          </p>
        </div>

        <div className={`bg-gradient-to-br ${
          currentData.inrGain >= 0 
            ? 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20' 
            : 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20'
        } p-4 rounded-xl`}>
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee className="w-5 h-5 text-orange-600" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">INR Gain/Loss</p>
          </div>
          <p className={`text-2xl font-bold ${
            currentData.inrGain >= 0 ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {currentData.inrGain >= 0 ? '+' : ''}₹{currentData.inrGain.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            @ ₹{usdToInr.toFixed(2)} per USD
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
          Gain/Loss Trend (USD)
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis 
                dataKey="sharePrice" 
                stroke="#94a3b8" 
                fontSize={12}
                label={{ value: 'Share Price ($)', position: 'insideBottom', offset: -5 }}
                domain={['dataMin', 'dataMax']}
                ticks={[400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650]}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                label={{ value: 'USD Gain/Loss', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={0} 
                stroke="#64748b" 
                strokeDasharray="3 3" 
                label={{ value: 'Break-even', fill: '#64748b', fontSize: 12 }}
              />
              <ReferenceLine 
                x={BASELINE_PRICE} 
                stroke="#8b5cf6" 
                strokeDasharray="3 3"
                label={{ value: 'Baseline $475', fill: '#8b5cf6', fontSize: 12, position: 'top' }}
              />
              <ReferenceLine 
                x={Math.round(currentPrice)} 
                stroke="#f59e0b" 
                strokeWidth={3}
                strokeDasharray="5 5"
                label={{ value: `Live $${Math.round(currentPrice)}`, fill: '#f59e0b', fontSize: 12, fontWeight: 'bold', position: 'top' }}
              />
              <Line
                type="monotone"
                dataKey="usdGain"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-x-auto">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
          Detailed Simulation Table
        </h4>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10">
              <tr>
                <th className="text-left p-3 font-semibold text-slate-900 dark:text-white">Share Price</th>
                <th className="text-right p-3 font-semibold text-slate-900 dark:text-white">Shares</th>
                <th className="text-right p-3 font-semibold text-slate-900 dark:text-white">Extra Shares</th>
                <th className="text-right p-3 font-semibold text-slate-900 dark:text-white">USD Gain</th>
                <th className="text-right p-3 font-semibold text-slate-900 dark:text-white">INR Gain</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const isBaseline = row.sharePrice === BASELINE_PRICE
                const isCurrentPrice = row.sharePrice === Math.round(currentPrice)
                const isProfit = row.usdGain > 0
                const isLoss = row.usdGain < 0
                
                return (
                  <motion.tr
                    key={row.sharePrice}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.002 }}
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`
                      border-b border-slate-200 dark:border-slate-700 transition-colors
                      ${hoveredRow === idx ? 'bg-slate-100 dark:bg-slate-800' : ''}
                      ${isBaseline ? 'bg-purple-50 dark:bg-purple-900/20' : ''}
                      ${isCurrentPrice ? 'bg-orange-50 dark:bg-orange-900/20' : ''}
                    `}
                  >
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      ${row.sharePrice}
                      {isBaseline && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200">
                          Baseline
                        </span>
                      )}
                      {isCurrentPrice && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-orange-200 dark:bg-orange-700 text-orange-800 dark:text-orange-200">
                          Live
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                      {row.rsu}
                    </td>
                    <td className={`p-3 text-right font-semibold ${
                      row.extraShares > 0 ? 'text-emerald-600' : 
                      row.extraShares < 0 ? 'text-red-600' : 
                      'text-slate-500'
                    }`}>
                      {row.extraShares > 0 ? '+' : ''}{row.extraShares}
                    </td>
                    <td className={`p-3 text-right font-semibold ${
                      isProfit ? 'text-emerald-600' : 
                      isLoss ? 'text-red-600' : 
                      'text-slate-500'
                    }`}>
                      {row.usdGain > 0 ? '+' : ''}${row.usdGain.toLocaleString()}
                    </td>
                    <td className={`p-3 text-right font-semibold ${
                      isProfit ? 'text-emerald-600' : 
                      isLoss ? 'text-red-600' : 
                      'text-slate-500'
                    }`}>
                      {row.inrGain > 0 ? '+' : ''}₹{row.inrGain.toLocaleString()}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <strong>Note:</strong> Calculations assume target price of ${TARGET_PRICE} for gain/loss computation. 
          Exchange rate: 1 USD = ₹{usdToInr.toFixed(2)}. Baseline: {BASELINE_RSU} shares @ ${BASELINE_PRICE}. Live price: ${currentPrice.toFixed(2)}.
        </p>
      </div>
    </motion.div>
  )
}
