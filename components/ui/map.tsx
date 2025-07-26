"use client"

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

interface MapProps {
  center?: [number, number]
  zoom?: number
  className?: string
  markerTitle?: string
  markerDescription?: string
}

export default function Map({ 
  center = [33.5138, 36.2765], // Damascus, Syria - Ministry of Religious Endowments area
  zoom = 13,
  className = "w-full h-96",
  markerTitle = "Ministry of Religious Endowments",
  markerDescription = "Damascus - Syria"
}: MapProps) {
  const mapRef = useRef<any>(null)

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ 
          height: '100%', 
          width: '100%', 
          borderRadius: '12px',
          zIndex: 1
        }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>
            <div className="text-center p-2">
              <h3 className="font-semibold text-slate-900 mb-1">{markerTitle}</h3>
              <p className="text-slate-600 text-sm">{markerDescription}</p>
              <div className="mt-2 text-xs text-slate-500">
                📍 {center[0].toFixed(4)}, {center[1].toFixed(4)}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
