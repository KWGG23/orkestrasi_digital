import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Desa Digital Karangasem & Blongkeng'
const DEFAULT_DESCRIPTION =
  'Desa Digital Karangasem — Bank Sampah Digital dan Portal Desa yang menghubungkan setoran sampah dengan tabungan warga dan katalog UMKM Dusun Karangasem & Blongkeng.'
const DEFAULT_IMAGE = '/images/slider/foto1.jpg'

export default function Seo({ title, description, image, canonicalPath, noindex = false }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Bank Sampah & Portal Desa`
  const desc = description ?? DEFAULT_DESCRIPTION
  const resolvedImage = image ?? DEFAULT_IMAGE
  // storageUrl() (foto UMKM/kegiatan) sudah mengembalikan URL absolut ke backend;
  // path statis di /public masih relatif, baru perlu di-prefix origin FE di sini.
  const isAbsolute = /^https?:\/\//.test(resolvedImage)
  const ogImage =
    isAbsolute || typeof window === 'undefined' ? resolvedImage : `${window.location.origin}${resolvedImage}`
  const canonicalUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${canonicalPath ?? window.location.pathname}` : undefined

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="id_ID" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
