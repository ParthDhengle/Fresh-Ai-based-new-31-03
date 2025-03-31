"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

type PositionChangeHandler = (lat: number, lng: number) => void

function LocationMarker({ onPositionChange }: { onPositionChange: PositionChangeHandler }) {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng
      onPositionChange(lat, lng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return null
}

interface MapComponentProps {
  position: [number, number]
  onPositionChange: PositionChangeHandler
  zoom?: number
  draggable?: boolean
}

export default function MapComponent({ position, onPositionChange, zoom = 5, draggable = false }: MapComponentProps) {
  // Need to use a ref to update the marker's position
  const [markerPosition, setMarkerPosition] = useState<[number, number]>(position)

  useEffect(() => {
    setMarkerPosition(position)
  }, [position])

  return (
    <MapContainer center={position} zoom={zoom} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={markerPosition}
        draggable={draggable}
        eventHandlers={
          draggable
            ? {
                dragend: (e) => {
                  const marker = e.target
                  const position = marker.getLatLng()
                  onPositionChange(position.lat, position.lng)
                },
              }
            : undefined
        }
      />
      <LocationMarker onPositionChange={onPositionChange} />
    </MapContainer>
  )
}

