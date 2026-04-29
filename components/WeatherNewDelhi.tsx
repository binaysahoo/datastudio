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
    aqi: number
  }
  hourly: Array<{
    time: string
    date: string
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

export default function WeatherNewDelhi() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'temp' | 'precip' | 'wind'>('temp')
  const [selectedDay, setSelectedDay] = useState(0)

  useEffect(() => {
    async function fetchWeather() {
      try {
        // New Delhi coordinates: 28.6139°N, 77.2090°E
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code,us_aqi&hourly=temperature_2m,precipitation,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia/Kolkata&forecast_days=8'
        )
        
        const data = await response.json()
        
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
        
        const hourlyData = []
        for (let i = 0; i < Math.min(192, data.hourly.time.length); i += 3) {
          if (i < data.hourly.time.length) {
            const time = new Date(data.hourly.time[i])
            hourlyData.push({
              time: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
              date: time.toISOString().split('T')[0],
              temp: Math.round(data.hourly.temperature_2m[i]),
              precipitation: data.hourly.precipitation[i] || 0,
              wind: Math.round(data.hourly.wind_speed_10m[i]),
            })
          }
        }
        
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
            aqi: data.current.us_aqi || 0,
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
    const interval = setInterval(fetchWeather, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = (icon: string, size: 'small' | 'large' = 'large') => {
    const className = size === 'large' ? 'w-12 h-12' : 'w-8 h-8'
    switch (icon) {
      case 'sunny': return <Sun className={`${className} text-yellow-500`} />
      case 'partly-cloudy': return <Cloud className={`${className} text-neutral-500`} />
      case 'cloudy': return <Cloud className={`${className} text-neutral-600`} />
      case 'rainy': return <CloudRain className={`${className} text-blue-500`} />
      default: return <Cloud className={`${className} text-neutral-500`} />
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
          <div className="h-6 bg-neutral-300 dark:bg-neutral-700 rounded w-48 mb-4"></div>
          <div className="h-32 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
        </div>
      </motion.div>
    )
  }

  if (!weather) return null

  // Filter hourly data by selected day
  const selectedDate = weather.daily[selectedDay]?.date
  const filteredHourlyData = selectedDate 
    ? weather.hourly.filter(h => h.date === selectedDate)
    : weather.hourly.slice(0, 8)

  const chartData = filteredHourlyData.map(h => ({
    time: h.time,
    value: activeTab === 'temp' ? h.temp : activeTab === 'precip' ? h.precipitation : h.wind,
  }))

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-600 dark:text-green-500'
    if (aqi <= 100) return 'text-yellow-600 dark:text-yellow-500'
    if (aqi <= 150) return 'text-orange-600 dark:text-orange-500'
    return 'text-red-600 dark:text-red-500'
  }

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
    return 'Unhealthy'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold gradient-text mb-1">
          New Delhi
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">India</p>
      </div>

      {/* Current Weather */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-neutral-800 dark:to-neutral-700 rounded-xl">
        <div className="flex items-center gap-4">
          {getWeatherIcon(weather.daily[0].icon)}
          <div>
            <p className="text-4xl font-bold text-neutral-900 dark:text-white">
              {weather.current.temp}°C
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">{weather.current.condition}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-neutral-600 dark:text-neutral-400">
              Precipitation: {weather.current.precipitation}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-500" />
            <span className="text-neutral-600 dark:text-neutral-400">
              Humidity: {weather.current.humidity}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-600 dark:text-neutral-400">
              Wind: {weather.current.windSpeed} km/h
            </span>
          </div>
          {weather.current.aqi > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-red-500" />
              <span className={`font-semibold ${getAQIColor(weather.current.aqi)}`}>
                AQI: {weather.current.aqi} ({getAQILabel(weather.current.aqi)})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Trend Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('temp')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'temp'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
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
              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
          }`}
        >
          <CloudDrizzle className="w-4 h-4 inline mr-2" />
          Precipitation
        </button>
        <button
          onClick={() => setActiveTab('wind')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'wind'
              ? 'bg-gradient-to-r from-neutral-500 to-gray-500 text-white'
              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
          }`}
        >
          <Wind className="w-4 h-4 inline mr-2" />
          Wind Speed
        </button>
      </div>

      {/* Trend Chart */}
      <div className="h-48 mb-6">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTempDelhi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrecipDelhi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorWindDelhi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" opacity={0.3} />
            <XAxis
              dataKey="time"
              stroke="currentColor"
              className="text-neutral-500 dark:text-neutral-500"
              style={{ fontSize: '10px' }}
              interval={3}
            />
            <YAxis
              stroke="currentColor"
              className="text-neutral-500 dark:text-neutral-500"
              style={{ fontSize: '11px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={activeTab === 'temp' ? '#f59e0b' : activeTab === 'precip' ? '#3b82f6' : '#64748b'}
              fill={`url(#color${activeTab === 'temp' ? 'Temp' : activeTab === 'precip' ? 'Precip' : 'Wind'}Delhi)`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">No hourly data available for this day</p>
          </div>
        )}
      </div>

      {/* 7-Day Forecast */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
          7-Day Forecast {selectedDay > 0 && <span className="text-xs font-normal text-neutral-600 dark:text-neutral-400">(Click to view hourly data)</span>}
        </h4>
        <div className="grid grid-cols-7 gap-2">
          {weather.daily.slice(0, 7).map((day, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedDay(idx)}
              className={`text-center p-2 rounded-lg transition-all cursor-pointer ${
                selectedDay === idx
                  ? 'bg-orange-500 dark:bg-orange-600 ring-2 ring-orange-400 dark:ring-orange-500'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <p className={`text-xs font-medium mb-1 ${
                selectedDay === idx
                  ? 'text-white'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}>
                {day.day}
              </p>
              <div className="flex justify-center mb-1">
                {getWeatherIcon(day.icon, 'small')}
              </div>
              <p className={`text-xs font-semibold ${
                selectedDay === idx
                  ? 'text-white'
                  : 'text-neutral-900 dark:text-white'
              }`}>
                {day.high}°
              </p>
              <p className={`text-xs ${
                selectedDay === idx
                  ? 'text-orange-100'
                  : 'text-neutral-500 dark:text-neutral-500'
              }`}>
                {day.low}°
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
