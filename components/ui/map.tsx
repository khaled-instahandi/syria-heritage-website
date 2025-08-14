"use client"

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { MapPin } from 'lucide-react'
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

// أيقونة خاصة للموقع المحدد
const SelectedIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -40],
  shadowSize: [49, 49]
})

L.Marker.prototype.options.icon = DefaultIcon

interface MapProps {
  center?: [number, number]
  zoom?: number
  className?: string
  markerTitle?: string
  markerDescription?: string
  // خصائص للخريطة التفاعلية
  interactive?: boolean
  onLocationSelect?: (lat: number, lng: number) => void
  selectedLocation?: [number, number] | null
  showCurrentMarker?: boolean
}

// مكون للتعامل مع أحداث الخريطة
function MapEvents({ onLocationSelect, interactive }: { 
  onLocationSelect?: (lat: number, lng: number) => void
  interactive?: boolean 
}) {
  useMapEvents({
    click: (e) => {
      if (interactive && onLocationSelect) {
        const { lat, lng } = e.latlng
        onLocationSelect(lat, lng)
      }
    }
  })
  return null
}

export default function Map({ 
  center = [33.5138, 36.2765], // Damascus, Syria - Ministry of Religious Endowments area
  zoom = 13,
  className = "w-full h-96",
  markerTitle = "Ministry of Religious Endowments",
  markerDescription = "Damascus - Syria",
  interactive = false,
  onLocationSelect,
  selectedLocation,
  showCurrentMarker = true
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
          zIndex: 1,
          cursor: interactive ? 'crosshair' : 'grab'
        }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* إضافة أحداث الخريطة */}
        <MapEvents onLocationSelect={onLocationSelect} interactive={interactive} />
        
        {/* عرض الموقع الحالي/الافتراضي */}
        {showCurrentMarker && (
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
        )}
        
        {/* عرض الموقع المحدد */}
        {selectedLocation && (
          <Marker position={selectedLocation} icon={SelectedIcon}>
            <Popup>
              <div className="text-center p-2">
                <h3 className="font-semibold text-emerald-900 mb-1">🕌 الموقع المحدد</h3>
                <p className="text-slate-600 text-sm">موقع المسجد الجديد</p>
                <div className="mt-2 text-xs text-slate-500">
                  📍 {selectedLocation[0].toFixed(6)}, {selectedLocation[1].toFixed(6)}
                </div>
                <div className="mt-2 text-xs text-emerald-600 font-medium">
                  ✓ تم تحديد الموقع
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* رسالة توجيهية للخريطة التفاعلية */}
      {interactive && (
        <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-800">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">
              انقر على الخريطة لتحديد موقع المسجد
            </span>
          </div>
          {selectedLocation && (
            <div className="mt-2 text-xs text-emerald-700">
              الإحداثيات المحددة: {selectedLocation[0].toFixed(6)}, {selectedLocation[1].toFixed(6)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
