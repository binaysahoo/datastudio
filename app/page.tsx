'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import Image from 'next/image'
import WeatherBangalore from '@/components/WeatherBangalore'
import WeatherOdisha from '@/components/WeatherOdisha'
import WeatherHouston from '@/components/WeatherHouston'
import WeatherNewDelhi from '@/components/WeatherNewDelhi'
import LLMBubbleChart from '@/components/LLMBubbleChart'
import APIUsageChart from '@/components/APIUsageChart'
import StockCard from '@/components/StockCard'
import MyPerks from '@/components/MyPerks'
import YouTubeVideos from '@/components/YouTubeVideos'
import SocialMedia from '@/components/SocialMedia'
import Hero from '@/components/Hero'

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    // Apply dark mode on initial load
    document.documentElement.classList.add('dark')
  }, [])

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
    <div className="min-h-screen p-4 md:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2 tracking-tight">
              DataStudioz Analytics
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-base">
              Real-time insights and analytics at your fingertips
            </p>
          </div>
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card p-3 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-neutral-700" />
            )}
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <Hero />

      {/* Stock Prices Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-12"
      >
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-2 tracking-tight">
            Semiconductor & Tech Stocks
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Live real-time prices • Updates every 15 seconds • Powered by Finnhub
            </span>
          </p>
        </div>

        {/* Stock Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stocks.map((stock, index) => (
            <motion.div 
              key={stock.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <StockCard
                symbol={stock.symbol}
                name={stock.name}
                index={index}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* YouTube Videos Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-12"
      >
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-2 tracking-tight">
            Latest Videos
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Check out our latest content •{' '}
            <a 
              href="https://www.youtube.com/@datastudioz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 font-medium transition-colors underline-offset-2 hover:underline"
            >
              Subscribe @datastudioz
            </a>
          </p>
        </div>
        <YouTubeVideos />
      </motion.section>
      {/* AI/ML Analytics Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="mb-12 relative overflow-hidden rounded-2xl"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/ai-analytics-bg.png"
            alt="AI Analytics Background"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-black/50 dark:to-black" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-2 tracking-tight">
              AI & Machine Learning Analytics
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Real-time insights into LLM usage and API performance
            </p>
          </div>
          <div className="space-y-4">
            <LLMBubbleChart />
            <APIUsageChart />
          </div>
        </div>
      </motion.section>

      {/* Weather Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-12"
      >
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-2 tracking-tight">
            Live Weather Updates
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Real-time weather with 7-day forecasts • Powered by Open-Meteo
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WeatherBangalore />
          <WeatherOdisha />
          <WeatherHouston />
          <WeatherNewDelhi />
        </div>
      </motion.section>

      {/* Tools & Utilities Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="mb-12"
      >
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-2 tracking-tight">
            Tools & Utilities
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Personal finance calculators and investment simulators
          </p>
        </div>
        <MyPerks />
      </motion.section>

      {/* Social Media Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="mb-12"
      >
        <SocialMedia />
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>© 2026 DataStudioz. All rights reserved.</p>
          <p className="text-neutral-500 dark:text-neutral-500">
            Built with Next.js • React • Tailwind CSS
          </p>
        </div>
      </motion.footer>
    </div>
  )
}
