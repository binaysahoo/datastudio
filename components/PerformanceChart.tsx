'use client'

import { motion } from 'framer-motion'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const data = [
  { metric: 'Speed', value: 92, fullMark: 100 },
  { metric: 'Reliability', value: 88, fullMark: 100 },
  { metric: 'Security', value: 95, fullMark: 100 },
  { metric: 'UX', value: 85, fullMark: 100 },
  { metric: 'Support', value: 90, fullMark: 100 },
  { metric: 'Innovation', value: 87, fullMark: 100 },
]

export default function PerformanceChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="glass-card p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Performance Metrics
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Overall system performance analysis
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
          <Radar
            name="Performance"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
