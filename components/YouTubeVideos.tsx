'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

interface Video {
  id: string
  title: string
}

const videos: Video[] = [
  { id: 'kClPgHyQPH4', title: 'Video 1' },
  { id: 'WXFaJVeaRUg', title: 'Video 2' },
  { id: 'HSS2OgVBM4o', title: 'Video 3' },
  { id: 'mQAXTjsc-VE', title: 'Video 4' },
]

export default function YouTubeVideos() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {videos.map((video, index) => (
        <motion.a
          key={video.id}
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative glass-card overflow-hidden rounded-xl hover:scale-105 transition-transform duration-300"
        >
          {/* Thumbnail */}
          <div className="relative aspect-video bg-slate-200 dark:bg-slate-800">
            <img
              src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to medium quality thumbnail if maxres doesn't exist
                e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`
              }}
            />
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
              <div className="bg-red-600 rounded-full p-4 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          </div>

          {/* Duration badge (optional - you can customize) */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            Watch
          </div>
        </motion.a>
      ))}
    </div>
  )
}
