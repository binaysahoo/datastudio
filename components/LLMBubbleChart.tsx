'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Legend,
  Cell,
} from 'recharts'

interface LLMModel {
  name: string
  users: number
  performance: number
  tokens: number
  color: string
  company: string
  likes?: number
  modelId?: string
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="glass-card p-4 shadow-xl">
        <p className="font-bold text-slate-900 dark:text-white mb-2">
          {data.name}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Company: <span className="font-semibold">{data.company}</span>
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Downloads: <span className="font-semibold">{data.users.toLocaleString()}</span>
        </p>
        {data.likes && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Likes: <span className="font-semibold">{data.likes.toLocaleString()}</span>
          </p>
        )}
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Performance: <span className="font-semibold">{data.performance}/100</span>
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Context: <span className="font-semibold">{data.tokens.toLocaleString()} tokens</span>
        </p>
      </div>
    )
  }
  return null
}

export default function LLMBubbleChart() {
  const [llmData, setLlmData] = useState<LLMModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    async function fetchLLMStats() {
      try {
        setLoading(true)
        
        // Popular LLM models to track from HuggingFace
        const modelsToTrack = [
          'meta-llama/Meta-Llama-3-8B',
          'meta-llama/Meta-Llama-3-70B',
          'mistralai/Mistral-7B-v0.1',
          'mistralai/Mixtral-8x7B-v0.1',
          'google/gemma-7b',
          'google/gemma-2b',
          'tiiuae/falcon-7b',
          'microsoft/phi-2',
        ]

        const colors = [
          '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', 
          '#ec4899', '#06b6d4', '#14b8a6', '#f97316',
        ]

        // Fetch data from HuggingFace API
        const modelPromises = modelsToTrack.map(async (modelId, index) => {
          try {
            const response = await fetch(`https://huggingface.co/api/models/${modelId}`)
            if (!response.ok) return null
            
            const data = await response.json()
            const name = modelId.split('/')[1] || modelId
            const company = modelId.split('/')[0] || 'Unknown'
            const downloads = data.downloads || 0
            const likes = data.likes || 0
            
            // Calculate performance score based on likes (normalized to 80-98)
            const performanceScore = Math.min(98, 80 + (likes / 1000))
            
            // Estimate token context
            const tokens = name.includes('70B') || name.includes('40B') ? 32000 :
                           name.includes('8B') || name.includes('7B') ? 8000 :
                           name.includes('2B') ? 4000 : 16000

            return {
              name,
              users: downloads,
              performance: parseFloat(performanceScore.toFixed(1)),
              tokens,
              color: colors[index % colors.length],
              company,
              likes,
              modelId,
            }
          } catch (error) {
            console.error(`Error fetching ${modelId}:`, error)
            return null
          }
        })

        const modelsData = await Promise.all(modelPromises)
        const validModels = modelsData.filter((model) => model !== null) as LLMModel[]
        
        // Sort by downloads
        validModels.sort((a, b) => b.users - a.users)

        setLlmData(validModels)
        setLastUpdated(new Date().toLocaleString())
        setError(null)
      } catch (err) {
        setError('Failed to fetch LLM statistics from HuggingFace')
        console.error('Error fetching LLM stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLLMStats()
  }, [])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            LLM Models Comparison
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Loading real-time data from HuggingFace...
          </p>
        </div>
        <div className="h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            LLM Models Comparison
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 }}
      className="glass-card p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          LLM Models Comparison
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Bubble size = Context window • X-axis = Performance • Y-axis = Downloads
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
          🔴 Live data from HuggingFace API • Last updated: {lastUpdated}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
          <XAxis
            type="number"
            dataKey="performance"
            name="Performance Score"
            domain={[80, 100]}
            stroke="#64748b"
            style={{ fontSize: '12px' }}
            label={{
              value: 'Performance Score',
              position: 'insideBottom',
              offset: -10,
              style: { fill: '#64748b' },
            }}
          />
          <YAxis
            type="number"
            dataKey="users"
            name="Downloads"
            stroke="#64748b"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
              if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
              return value.toString()
            }}
            label={{
              value: 'Downloads',
              angle: -90,
              position: 'insideLeft',
              style: { fill: '#64748b' },
            }}
          />
          <ZAxis
            type="number"
            dataKey="tokens"
            range={[100, 1000]}
            name="Context Window"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px',
            }}
          />
          <Scatter name="LLM Models" data={llmData}>
            {llmData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
        {llmData.slice(0, 5).map((model) => (
          <div
            key={model.name}
            className="flex items-center gap-2 text-xs"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: model.color }}
            />
            <span className="text-slate-600 dark:text-slate-400">
              {model.name}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
