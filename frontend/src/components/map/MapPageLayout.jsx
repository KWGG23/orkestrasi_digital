import PortalLayout from '../layout/PortalLayout.jsx'
import GeoMap from './GeoMap.jsx'
import { useGeoLayer } from '../../hooks/useGeoLayer.js'
import Seo from '../Seo.jsx'

export default function MapPageLayout({ crumbLabel, icon: Icon, title, description, layer, layerColor, sourceNote }) {
  const { data, isLoading } = useGeoLayer(layer)

  return (
    <PortalLayout crumbs={[{ label: crumbLabel }]}>
      <Seo title={title} description={description} />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-moss px-4 py-1.5 text-sm font-medium text-primary-dark">
          <Icon size={18} weight="bold" />
          {crumbLabel}
        </span>
        <h1 className="mt-4 font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-bark/75">{description}</p>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex h-[420px] items-center justify-center rounded-3xl border border-border bg-white text-sm text-muted">
              Memuat peta…
            </div>
          ) : (
            <GeoMap geojson={data} layerColor={layerColor} />
          )}
        </div>

        {sourceNote && <p className="mt-4 text-xs text-muted">{sourceNote}</p>}
      </div>
    </PortalLayout>
  )
}
