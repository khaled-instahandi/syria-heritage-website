"use client"

import { MapPin } from 'lucide-react'

interface SimpleMapProps {
  center?: [number, number]
  zoom?: number
  className?: string
  markerTitle?: string
  markerDescription?: string
}

export default function SimpleMap({ 
  center = [33.5138, 36.2765], // Damascus, Syria - Ministry of Religious Endowments area
  zoom = 15,
  className = "w-full h-96",
  markerTitle = "Ministry of Religious Endowments",
  markerDescription = "Damascus - Syria"
}: SimpleMapProps) {
  // Create Google Maps embed URL
  const lat = center[0]
  const lng = center[1]
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`
  
  return (
    <div className={className}>
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <iframe
          src={mapUrl}
          style={{ 
            border: 0,
            width: '100%',
            height: '100%'
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map showing ${markerTitle}`}
        />
        
        {/* Overlay with location info */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="font-semibold text-slate-900 text-sm">{markerTitle}</p>
              <p className="text-slate-600 text-xs">{markerDescription}</p>
              <p className="text-slate-500 text-xs">📍 {lat.toFixed(4)}, {lng.toFixed(4)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
