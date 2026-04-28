'use client'

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

// LLM Models data with usage statistics
const llmData = [
  {
    name: 'GPT-4',
    users: 15000000,
    performance: 95,
    tokens: 32000,
    color: '#10b981',
    company: 'OpenAI',
  },
  {
    name: 'Claude 3 Opus',
    users: 8500000,
    performance: 94,
    tokens: 200000,
    color: '#3b82f6',
    company: 'Anthropic',
  },
  {
    name: 'GPT-3.5',
    users: 25000000,
    performance: 82,
    tokens: 16000,
    color: '#22c55e',
    company: 'OpenAI',
  },
  {
    name: 'Gemini Pro',
    users: 12000000,
    performance: 91,
    tokens: 32000,
    color: '#8b5cf6',
    company: 'Google',
  },
  {
    name: 'Claude 3 Sonnet',
    users: 10000000,
    performance: 92,
    tokens: 200000,
    color: '#06b6d4',
    company: 'Anthropic',
  },
  {
    name: 'Llama 3',
    users: 6000000,
    performance: 88,
    tokens: 8000,
    color: '#f59e0b',
    company: 'Meta',
  },
  {
    name: 'Mistral Large',
    users: 3500000,
    performance: 87,
    tokens: 32000,
    color: '#ec4899',
    company: 'Mistral AI',
  },
  {
    name: 'Claude 3 Haiku',
    users: 7000000,
    performance: 85,
    tokens: 200000,
    color: '#14b8a6',
    company: 'Anthropic',
  },
  {
    name: 'Gemini Ultra',
    users: 5000000,
    performance: 96,
    tokens: 32000,
    color: '#a855f7',
    company: 'Google',
  },
  {
    name: 'Command R+',
    users: 2000000,
    performance: 84,
    tokens: 128000,
    color: '#f97316',
    company: 'Cohere',
  },
]

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
          Users: <span className="font-semibold">{(data.users / 1000000).toFixed(1)}M</span>
        </p>
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
          Bubble size = Context window • X-axis = Performance • Y-axis = User base
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
            name="Users"
            domain={[0, 30000000]}
            stroke="#64748b"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            label={{
              value: 'Active Users',
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
