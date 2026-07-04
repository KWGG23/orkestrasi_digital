import { useMemo } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'

// Vite tidak menyertakan URL ikon default Leaflet secara otomatis.
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const MUNTILAN_CENTER = [-7.6155, 110.2495]
const TILE_URL =
  import.meta.env.VITE_MAPS_TILE_URL ?? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

export default function GeoMap({ geojson, layerColor = '#15803d', height = 420, zoom = 14 }) {
  const featureCount = geojson?.features?.length ?? 0

  const geoJsonStyle = useMemo(
    () => ({
      color: layerColor,
      weight: 2,
      fillColor: layerColor,
      fillOpacity: 0.15,
    }),
    [layerColor]
  )

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border" style={{ height }}>
      <MapContainer
        center={MUNTILAN_CENTER}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={TILE_URL}
        />
        {featureCount > 0 && <GeoJSON data={geojson} style={geoJsonStyle} />}
      </MapContainer>

      {featureCount === 0 && (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[1000] rounded-2xl bg-white/95 px-4 py-3 text-sm text-bark shadow-lg">
          Batas wilayah untuk lapisan ini belum tersedia — menunggu hasil survei lapangan. Peta
          menampilkan lokasi perkiraan Kelurahan Muntilan.
        </div>
      )}
    </div>
  )
}
