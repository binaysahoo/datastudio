'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cloud, CloudRain, Sun, CloudDrizzle, Wind, Droplets, Thermometer } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface WeatherData {
  current: {
    temp: number
    precipitation: number
    humidity: number
    windSpeed: number
    condition: string
  }
  hourly: Array<{
    time: string
    temp: number
    precipitation: number
    wind: number
  }>
  daily: Array<{
    date: string
    day: string
    high: number
    low: number
    condition: string
    icon: string
  }>
}

export default function WeatherOdisha() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'temp' | 'precip' | 'wind'>('temp')

  useEffect(() => {
    async function fetchWeather() {
      try {
        // Bhubaneswar, Odisha coordinates: 20.2961°N, 85.8245°E
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=20.2961&longitude=85.8245&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia/Kolkata&forecast_days=8'
        )
        
        const data = await response.json()
        
        // Map weather codes to conditions
        const getCondition = (code: number) => {
          if (code === 0) return 'Clear'
          if (code <= 3) return 'Partly Cloudy'
          if (code <= 48) return 'Cloudy'
          if (code <= 67) return 'Rainy'
          if (code <= 77) return 'Snowy'
          return 'Cloudy'
        }
        
        const getIcon = (code: number) => {
          if (code === 0) return 'sunny'
          if (code <= 3) return 'partly-cloudy'
          if (code <= 48) return 'cloudy'
          if (code <= 67) return 'rainy'
          return 'cloudy'
        }
        
        // Process hourly data (next 72 hours, showing every 3 hours)
        const hourlyData = []
        for (let i = 0; i < 72; i += 3) {
          if (i < data.hourly.time.length) {
            const time = new Date(data.hourly.time[i])
            hourlyData.push({
              time: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
              temp: Math.round(data.hourly.temperature_2m[i]),
              precipitation: data.hourly.precipitation[i] || 0,
              wind: Math.round(data.hourly.wind_speed_10m[i]),
            })
          }
        }
        
        // Process daily data
        const dailyData = data.daily.time.map((date: string, idx: number) => {
          const d = new Date(date)
          return {
            date: date,
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            high: Math.round(data.daily.temperature_2m_max[idx]),
            low: Math.round(data.daily.temperature_2m_min[idx]),
            condition: getCondition(data.daily.weather_code[idx]),
            icon: getIcon(data.daily.weather_code[idx]),
          }
        })
        
        setWeather({
          current: {
            temp: Math.round(data.current.temperature_2m),
            precipitation: data.current.precipitation || 0,
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m),
            condition: getCondition(data.current.weather_code),
          },
          hourly: hourlyData,
          daily: dailyData,
        })
        
        setLoading(false)
      } catch (error) {
        console.error('Weather fetch error:', error)
        setLoading(false)
      }
    }
    
    fetchWeather()
    const interval = setInterval(fetchWeather, 10 * 60 * 1000) // Update every 10 minutes
    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = (icon: string, size: 'small' | 'large' = 'large') => {
    const className = size === 'large' ? 'w-12 h-12' : 'w-8 h-8'
    switch (icon) {
      case 'sunny': return <Sun className={`${className} text-yellow-500`} />
      case 'partly-cloudy': return <Cloud className={`${className} text-slate-500`} />
      case 'cloudy': return <Cloud className={`${className} text-slate-600`} />
      case 'rainy': return <CloudRain className={`${className} text-blue-500`} />
      default: return <Cloud className={`${className} text-slate-500`} />
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-48 mb-4"></div>
          <div className="h-32 bg-slate-300 dark:bg-slate-700 rounded"></div>
        </div>
      </motion.div>
    )
  }

  if (!weather) return null

  const chartData = weather.hourly.map(h => ({
    time: h.time,
    value: activeTab === 'temp' ? h.temp : activeTab === 'precip' ? h.precipitation : h.wind,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Weather in Odisha
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">Bhubaneswar, India</p>
      </div>

      {/* Current Weather */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl">
        <div className="flex items-center gap-4">
          {getWeatherIcon(weather.daily[0].icon)}
          <div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">
              {weather.current.temp}°C
            </p>
            <p className="text-slate-600 dark:text-slate-400">{weather.current.condition}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-slate-600 dark:text-slate-400">
              Precipitation: {weather.current.precipitation}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-500" />
            <span className="text-slate-600 dark:text-slate-400">
              Humidity: {weather.current.humidity}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600 dark:text-slate-400">
              Wind: {weather.current.windSpeed} km/h
            </span>
          </div>
        </div>
      </div>

      {/* Trend Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('temp')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'temp'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Thermometer className="w-4 h-4 inline mr-2" />
          Temperature
        </button>
        <button
          onClick={() => setActiveTab('precip')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'precip'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
          }`}
        >
          <CloudDrizzle className="w-4 h-4 inline mr-2" />
          Precipitation
        </button>
        <button
          onClick={() => setActiveTab('wind')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'wind'
              ? 'bg-gradient-to-r from-slate-500 to-gray-500 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Wind className="w-4 h-4 inline mr-2" />
          Wind Speed
        </button>
      </div>

      {/* Trend Chart */}
      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTempOdisha" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrecipOdisha" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorWindOdisha" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#94a3b8" 
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={activeTab === 'temp' ? '#f59e0b' : activeTab === 'precip' ? '#3b82f6' : '#64748b'}
              strokeWidth={2}
              fill={`url(#color${activeTab === 'temp' ? 'TempOdisha' : activeTab === 'precip' ? 'PrecipOdisha' : 'WindOdisha'})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 7-Day Forecast */}
      <div>
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
          7-Day Forecast
        </h4>
        <div className="grid grid-cols-7 gap-2">
          {weather.daily.slice(0, 7).map((day, idx) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="text-center p-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                {day.day}
              </p>
              <div className="flex justi, 'small'fy-center mb-2">
                {getWeatherIcon(day.icon)}
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {day.high}°
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {day.low}°
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
