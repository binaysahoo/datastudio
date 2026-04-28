'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export default function GoogleAdSense({ adSenseId }: { adSenseId: string }) {
  useEffect(() => {
    // Enable Auto Ads
    if (typeof window !== 'undefined') {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: adSenseId,
          enable_page_level_ads: true
        })
      } catch (e) {
        console.error('AdSense Auto Ads error:', e)
      }
    }
  }, [adSenseId])

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
