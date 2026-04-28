'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, IndianRupee, Package } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

// Constants
const INVESTMENT_USD = 22000
const BASELINE_RSU = 46
const BASELINE_PRICE = 475
const TARGET_PRICE = 650
const USD_TO_INR = 94

interface PerkData {
  sharePrice: number
  rsu: number
  extraShares: number
  usdGain: number
  inrGain: number
}

function generateData(): PerkData[] {
  const data: PerkData[] = []
  for (let price = 400; price <= 650; price += 5) {
    const rsu = Math.floor(INVESTMENT_USD / price)
    const extraShares = rsu - BASELINE_RSU
    const usdGain = extraShares * TARGET_PRICE
    const inrGain = usdGain * USD_TO_INR
    
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
  
  const data = generateData()
  const currentPrice = 482.35
  
  let currentData = data[16]
  for (let i = 0; i < data.length; i++) {
    if (Math.abs(data[i].sharePrice - currentPrice) < 3) {
      currentData = data[i]
      break
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          💎 MyPerks - SNPS Share Calculator
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Simulate SNPS share gains/losses from $400 to $650 with ${INVESTMENT_USD.toLocaleString()} investment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Investment</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            ${INVESTMENT_USD.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-purple-600" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Baseline RSU</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {BASELINE_RSU} @ ${BASELINE_PRICE}
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
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Current USD</p>
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
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Current INR</p>
          </div>
          <p className={`text-2xl font-bold ${
            currentData.inrGain >= 0 ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {currentData.inrGain >= 0 ? '+' : ''}₹{currentData.inrGain.toLocaleString()}
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
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                label={{ value: 'USD Gain/Loss', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
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
                label={{ value: 'Baseline', fill: '#8b5cf6', fontSize: 12 }}
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
                <th className="text-right p-3 font-semibold text-slate-900 dark:text-white">RSU</th>
                <th className="text-right p-3 font-semibold text-slate-900 dark:text-white">Extra Shares</th>
                <th className="text-right p-3 font-semibold text-slate-900 dark:text-white">USD Gain</th>
                <th className="text-right p-3 font-semibold text-slate-900 dark:text-white">INR Gain</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const isBaseline = row.sharePrice === BASELINE_PRICE
                const isProfit = row.usdGain > 0
                const isLoss = row.usdGain < 0
                
                return (
                  <motion.tr
                    key={row.sharePrice}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.01 }}
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`
                      border-b border-slate-200 dark:border-slate-700 transition-colors
                      ${hoveredRow === idx ? 'bg-slate-100 dark:bg-slate-800' : ''}
                      ${isBaseline ? 'bg-purple-50 dark:bg-purple-900/20' : ''}
                    `}
                  >
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      ${row.sharePrice}
                      {isBaseline && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200">
                          Baseline
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
          Exchange rate: 1 USD = ₹{USD_TO_INR}. Baseline: {BASELINE_RSU} RSU @ ${BASELINE_PRICE}.
        </p>
      </div>
    </motion.div>
  )
}
