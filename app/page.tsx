'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import WeatherBangalore from '@/components/WeatherBangalore'
import WeatherOdisha from '@/components/WeatherOdisha'
import CategoryChart from '@/components/CategoryChart'
import PerformanceChart from '@/components/PerformanceChart'
import LLMBubbleChart from '@/components/LLMBubbleChart'
import APIUsageChart from '@/components/APIUsageChart'
import StockCard from '@/components/StockCard'
import MyPerks from '@/components/MyPerks'

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const stocks = [
    { symbol: 'SNPS', name: 'Synopsys' },
    { symbol: 'CDNS', name: 'Cadence Design' },
    { symbol: 'QCOM', name: 'Qualcomm' },
    { symbol: 'NVDA', name: 'NVIDIA' },
    { symbol: 'AVGO', name: 'Broadcom' },
  ]

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              DataStudioz Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Welcome back! Here&apos;s what&apos;s happening with your data today.
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="glass-card p-3 hover:scale-105 transition-transform"
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-500" />
            ) : (
              <Moon className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>
      </motion.header>

      {/* Stock Prices Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold gradient-text mb-2">
          Semiconductor & Tech Stocks
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          🔴 Live real-time stock prices with smooth rolling animations • Updates every 15 seconds • Powered by Finnhub
        </p>
      </div>

      {/* Stock Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stocks.map((stock, index) => (
          <StockCard
            key={stock.symbol}
            symbol={stock.symbol}
            name={stock.name}
            index={index}
          />
        ))}
      </div>

      {/* Weather Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold gradient-text mb-2">
          🌦️ Live Weather Updates
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Real-time weather data with 7-day forecasts • Powered by Open-Meteo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <WeatherBangalore />
        <WeatherOdisha />
      </div>

      {/* Tools & Utilities Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold gradient-text mb-2">
          🛠️ Tools & Utilities
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Personal finance calculators and investment simulators
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <MyPerks />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CategoryChart />
        <PerformanceChart />
      </div>

      {/* AI/ML Analytics Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold gradient-text mb-2">
          AI & Machine Learning Analytics
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Real-time insights into LLM model usage and API performance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <LLMBubbleChart />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <APIUsageChart />
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center text-slate-600 dark:text-slate-400"
      >
        <p>© 2026 DataStudioz. Built with Next.js, React & Tailwind CSS</p>
      </motion.footer>
    </div>
  )
}
