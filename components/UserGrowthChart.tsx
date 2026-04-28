'use client'

import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const data = [
  { month: 'Jan', newUsers: 1200, activeUsers: 3400 },
  { month: 'Feb', newUsers: 1800, activeUsers: 4200 },
  { month: 'Mar', newUsers: 1500, activeUsers: 3900 },
  { month: 'Apr', newUsers: 2200, activeUsers: 5100 },
  { month: 'May', newUsers: 2800, activeUsers: 6200 },
  { month: 'Jun', newUsers: 3200, activeUsers: 7100 },
  { month: 'Jul', newUsers: 3600, activeUsers: 8200 },
]

export default function UserGrowthChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          User Growth
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          New vs active users over time
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
          <XAxis
            dataKey="month"
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          <Bar dataKey="newUsers" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          <Bar dataKey="activeUsers" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
