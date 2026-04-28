'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, TrendingUp, Users, DollarSign, Activity } from 'lucide-react'
import RevenueChart from '@/components/RevenueChart'
import UserGrowthChart from '@/components/UserGrowthChart'
import CategoryChart from '@/components/CategoryChart'
import PerformanceChart from '@/components/PerformanceChart'
import StatsCard from '@/components/StatsCard'

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const stats = [
    {
      title: 'Total Revenue',
      value: '$124,593',
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Active Users',
      value: '48,256',
      change: '+18.2%',
      trend: 'up' as const,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Conversion Rate',
      value: '3.42%',
      change: '+2.4%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'from-violet-500 to-purple-500',
    },
    {
      title: 'Performance Score',
      value: '94.2',
      change: '+5.1%',
      trend: 'up' as const,
      icon: Activity,
      color: 'from-orange-500 to-red-500',
    },
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} index={index} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart />
        <UserGrowthChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart />
        <PerformanceChart />
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
