'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: LucideIcon
  color: string
  index: number
}

export default function StatsCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
  index,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-6 hover:scale-105 transition-transform"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-semibold ${
            trend === 'up' ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {change}
        </span>
        <span className="text-sm text-slate-500">vs last month</span>
      </div>
    </motion.div>
  )
}
