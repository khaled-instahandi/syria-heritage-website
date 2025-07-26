"use client"

import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'

// Dynamically import the Map component with no SSR
const DynamicMap = dynamic(() => import('./map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4 animate-pulse" />
        <p className="text-slate-600 font-medium">Loading Map...</p>
      </div>
    </div>
  )
})

interface InteractiveMapProps {
  center?: [number, number]
  zoom?: number
  className?: string
  markerTitle?: string
  markerDescription?: string
}

export default function InteractiveMap(props: InteractiveMapProps) {
  try {
    return <DynamicMap {...props} />
  } catch (error) {
    console.error('Map loading error:', error)
    return (
      <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Map temporarily unavailable</p>
          <p className="text-slate-500 text-sm">Ministry of Religious Endowments - Damascus, Syria</p>
        </div>
      </div>
    )
  }
}
