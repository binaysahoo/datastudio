'use client'

import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// AI/ML API usage trends over time
const apiData = [
  {
    month: 'Jan',
    'Text Generation': 45000,
    'Image Gen': 28000,
    'Code Assist': 35000,
    'Embeddings': 22000,
  },
  {
    month: 'Feb',
    'Text Generation': 52000,
    'Image Gen': 32000,
    'Code Assist': 41000,
    'Embeddings': 26000,
  },
  {
    month: 'Mar',
    'Text Generation': 58000,
    'Image Gen': 38000,
    'Code Assist': 48000,
    'Embeddings': 31000,
  },
  {
    month: 'Apr',
    'Text Generation': 67000,
    'Image Gen': 45000,
    'Code Assist': 56000,
    'Embeddings': 37000,
  },
  {
    month: 'May',
    'Text Generation': 78000,
    'Image Gen': 52000,
    'Code Assist': 65000,
    'Embeddings': 43000,
  },
  {
    month: 'Jun',
    'Text Generation': 89000,
    'Image Gen': 61000,
    'Code Assist': 75000,
    'Embeddings': 51000,
  },
  {
    month: 'Jul',
    'Text Generation': 98000,
    'Image Gen': 68000,
    'Code Assist': 84000,
    'Embeddings': 58000,
  },
]

export default function APIUsageChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7 }}
      className="glass-card p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          AI API Usage Trends
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Monthly API calls by category (in thousands)
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={apiData}>
          <defs>
            <linearGradient id="colorTextGen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorImageGen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCodeAssist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorEmbeddings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
          <XAxis
            dataKey="month"
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#64748b"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="Text Generation"
            stackId="1"
            stroke="#3b82f6"
            fill="url(#colorTextGen)"
          />
          <Area
            type="monotone"
            dataKey="Image Gen"
            stackId="1"
            stroke="#8b5cf6"
            fill="url(#colorImageGen)"
          />
          <Area
            type="monotone"
            dataKey="Code Assist"
            stackId="1"
            stroke="#10b981"
            fill="url(#colorCodeAssist)"
          />
          <Area
            type="monotone"
            dataKey="Embeddings"
            stackId="1"
            stroke="#f59e0b"
            fill="url(#colorEmbeddings)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
