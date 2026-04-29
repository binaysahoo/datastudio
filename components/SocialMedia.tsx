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
        <h3 className="text-2xl font-bold gradient-text mb-2 tracking-tight">Connect With Us</h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Follow us on social media for the latest updates
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {socialLinks.map((social, index) => (
          <motion.a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.05,
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1]
            }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`group flex flex-col items-center justify-center p-5 glass-card transition-colors duration-300 ${social.color} hover:text-white`}
            title={social.description}
          >
            <social.icon className="w-7 h-7 mb-2 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xs font-medium">{social.name}</span>
          </motion.a>
        ))}
      </div>
    </div>
  )
}
