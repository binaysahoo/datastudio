'use client'

import { useState, useEffect } from 'react'
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
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react'

interface ModelData {
  id: string
  name: string
  provider: string
  percentage: number
  trend: 'up' | 'down' | 'stable'
  trendValue: number
  color: string
  description: string
}

interface ChartDataPoint {
  date: string
  [key: string]: number | string
}

const topModels: ModelData[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    percentage: 28.4,
    trend: 'up',
    trendValue: 2.3,
    color: '#10b981',
    description: 'Most capable GPT-4 model'
  },
  {
    id: 'claude-sonnet',
    name: 'Claude Sonnet 4.5',
    provider: 'Anthropic',
    percentage: 24.7,
    trend: 'up',
    trendValue: 5.2,
    color: '#f59e0b',
    description: 'Balanced performance & speed'
  },
  {
    id: 'gemini-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    percentage: 18.3,
    trend: 'up',
    trendValue: 3.8,
    color: '#3b82f6',
    description: 'Fast and efficient'
  },
  {
    id: 'grok',
    name: 'Grok 4.1 Fast',
    provider: 'xAI',
    percentage: 12.1,
    trend: 'down',
    trendValue: -1.2,
    color: '#8b5cf6',
    description: 'Real-time knowledge'
  },
  {
    id: 'llama',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    percentage: 8.9,
    trend: 'stable',
    trendValue: 0.1,
    color: '#ec4899',
    description: 'Open source powerhouse'
  },
  {
    id: 'mistral',
    name: 'Mistral Large 2',
    provider: 'Mistral AI',
    percentage: 4.8,
    trend: 'up',
    trendValue: 1.4,
    color: '#06b6d4',
    description: 'European AI leader'
  },
  {
    id: 'command-r',
    name: 'Command R+',
    provider: 'Cohere',
    percentage: 2.8,
    trend: 'stable',
    trendValue: -0.3,
    color: '#f97316',
    description: 'Enterprise focused'
  },
]

// Generate time series data for the past 60 days
const generateChartData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []
  const now = new Date()
  
  for (let i = 59; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    
    const point: ChartDataPoint = { date: dateStr }
    
    topModels.forEach((model) => {
      // Generate realistic trending data
      const baseValue = model.percentage
      const variance = Math.random() * 4 - 2
      const trendEffect = (59 - i) * (model.trend === 'up' ? 0.05 : model.trend === 'down' ? -0.03 : 0)
      point[model.name] = Math.max(0, baseValue + variance + trendEffect)
    })
    
    data.push(point)
  }
  
  return data
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-4 shadow-xl border border-neutral-200 dark:border-neutral-800">
        <p className="font-semibold text-neutral-900 dark:text-white mb-2 text-sm">
          {label}
        </p>
        {payload
          .sort((a: any, b: any) => b.value - a.value)
          .map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-neutral-600 dark:text-neutral-400">
                  {entry.name}
                </span>
              </div>
              <span className="font-semibold text-neutral-900 dark:text-white">
                {entry.value.toFixed(1)}%
              </span>
            </div>
          ))}
      </div>
    )
  }
  return null
}

export default function LLMBubbleChart() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [selectedModels, setSelectedModels] = useState<Set<string>>(
    new Set(topModels.slice(0, 5).map(m => m.name))
  )

  useEffect(() => {
    setChartData(generateChartData())
  }, [])

  const toggleModel = (modelName: string) => {
    const newSelected = new Set(selectedModels)
    if (newSelected.has(modelName)) {
      newSelected.delete(modelName)
    } else {
      newSelected.add(modelName)
    }
    setSelectedModels(newSelected)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-6 md:p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-xl md:text-2xl font-bold gradient-text mb-2 tracking-tight">
          Top Models
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Most popular AI models by usage • Updated in real-time
        </p>
      </div>

      {/* Chart */}
      <div className="mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              {topModels.map((model) => (
                <linearGradient key={model.id} id={`gradient-${model.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={model.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={model.color} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" opacity={0.5} />
            <XAxis
              dataKey="date"
              stroke="currentColor"
              className="text-neutral-500 dark:text-neutral-500"
              style={{ fontSize: '11px' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="currentColor"
              className="text-neutral-500 dark:text-neutral-500"
              style={{ fontSize: '11px' }}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            {topModels
              .filter(model => selectedModels.has(model.name))
              .map((model) => (
                <Area
                  key={model.id}
                  type="monotone"
                  dataKey={model.name}
                  stroke={model.color}
                  fill={`url(#gradient-${model.id})`}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Rankings */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-500 uppercase tracking-wide px-4 pb-2">
          <span>Rank</span>
          <span>Model</span>
          <span>Usage</span>
        </div>
        
        {topModels.map((model, index) => (
          <motion.button
            key={model.id}
            onClick={() => toggleModel(model.name)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4 }}
            className={`w-full group relative overflow-hidden rounded-lg transition-all duration-200 ${
              selectedModels.has(model.name)
                ? 'bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800'
                : 'bg-transparent border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800'
            }`}
          >
            <div className="flex items-center justify-between p-4">
              {/* Rank & Model Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-3 min-w-[40px]">
                  <span className="text-lg font-bold text-neutral-400 dark:text-neutral-600 w-6 text-right">
                    {index + 1}
                  </span>
                  <div
                    className="w-1 h-8 rounded-full"
                    style={{ backgroundColor: model.color }}
                  />
                </div>
                
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900 dark:text-white text-sm">
                      {model.name}
                    </span>
                    <ExternalLink className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-500">
                    {model.provider} • {model.description}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                {/* Trend */}
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  model.trend === 'up' ? 'text-green-600 dark:text-green-500' :
                  model.trend === 'down' ? 'text-red-600 dark:text-red-500' :
                  'text-neutral-500 dark:text-neutral-500'
                }`}>
                  {model.trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
                   model.trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
                   <Minus className="w-3 h-3" />}
                  <span>{Math.abs(model.trendValue).toFixed(1)}%</span>
                </div>

                {/* Percentage */}
                <div className="text-right min-w-[60px]">
                  <div className="text-lg font-bold text-neutral-900 dark:text-white">
                    {model.percentage}%
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-100 dark:bg-neutral-900">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${model.percentage}%` }}
                transition={{ delay: index * 0.1, duration: 1, ease: 'easeOut' }}
                className="h-full"
                style={{ backgroundColor: model.color }}
              />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Legend hint */}
      <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <p className="text-xs text-neutral-500 dark:text-neutral-500 text-center">
          Click on models to toggle visibility in chart • Data updated every 5 minutes
        </p>
      </div>
    </motion.div>
  )
}
