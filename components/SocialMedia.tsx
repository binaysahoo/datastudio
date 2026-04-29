'use client'

import { motion } from 'framer-motion'
import { Youtube, Twitter, Instagram, Facebook, Linkedin, Globe } from 'lucide-react'

const socialLinks = [
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@datastudioz',
    icon: Youtube,
    color: 'hover:bg-red-600',
    description: 'Subscribe to our channel'
  },
  {
    name: 'Website',
    url: 'https://raglab.site',
    icon: Globe,
    color: 'hover:bg-blue-600',
    description: 'Visit our website'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/datastudioz',
    icon: Twitter,
    color: 'hover:bg-sky-500',
    description: 'Follow us on Twitter'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/datastudioz',
    icon: Linkedin,
    color: 'hover:bg-blue-700',
    description: 'Connect on LinkedIn'
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/datastudioz',
    icon: Instagram,
    color: 'hover:bg-pink-600',
    description: 'Follow on Instagram'
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/datastudioz',
    icon: Facebook,
    color: 'hover:bg-blue-600',
    description: 'Like our page'
  },
]

export default function SocialMedia() {
  return (
    <div className="glass-card p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold gradient-text mb-2">Connect With Us</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Follow us on social media for the latest updates and insights
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {socialLinks.map((social, index) => (
          <motion.a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`group flex flex-col items-center justify-center p-6 glass-card rounded-xl hover:scale-105 transition-all duration-300 ${social.color} hover:text-white`}
            title={social.description}
          >
            <social.icon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{social.name}</span>
          </motion.a>
        ))}
      </div>
    </div>
  )
}
