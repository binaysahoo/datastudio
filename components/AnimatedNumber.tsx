'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AnimatedNumberProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

export default function AnimatedNumber({ 
  value, 
  decimals = 2, 
  prefix = '', 
  suffix = '',
  className = ''
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true)
      
      // Animate from current to new value
      const duration = 800 // ms
      const steps = 20
      const stepTime = duration / steps
      const increment = (value - displayValue) / steps
      let currentStep = 0

      const timer = setInterval(() => {
        currentStep++
        if (currentStep >= steps) {
          setDisplayValue(value)
          setIsAnimating(false)
          clearInterval(timer)
        } else {
          setDisplayValue(prev => prev + increment)
        }
      }, stepTime)

      return () => clearInterval(timer)
    }
  }, [value, displayValue])

  const formattedValue = displayValue.toFixed(decimals)
  const digits = formattedValue.split('')

  return (
    <span className={`inline-flex items-center ${className}`}>
      {prefix}
      {digits.map((digit, index) => (
        <motion.span
          key={`${index}-${digit}`}
          initial={{ y: isAnimating ? -20 : 0, opacity: isAnimating ? 0 : 1 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.3,
            delay: index * 0.02,
            ease: 'easeOut'
          }}
          className="inline-block"
          style={{ minWidth: digit === '.' || digit === '-' ? 'auto' : '0.6em' }}
        >
          {digit}
        </motion.span>
      ))}
      {suffix}
    </span>
  )
}
