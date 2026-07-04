function humanize(key) {
  return key.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function Value({ value }) {
  if (Array.isArray(value)) {
    return (
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-bark/80">
        {value.map((item, i) => (
          <li key={i}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
        ))}
      </ul>
    )
  }

  if (value && typeof value === 'object') {
    return (
      <div className="mt-2 space-y-3 border-l-2 border-border pl-4">
        {Object.entries(value).map(([key, val]) => (
          <div key={key}>
            <p className="text-sm font-semibold text-primary-dark">{humanize(key)}</p>
            <Value value={val} />
          </div>
        ))}
      </div>
    )
  }

  return <p className="mt-1 text-sm leading-relaxed text-bark/80">{String(value)}</p>
}

// Merender JSON `konten` profil dusun secara defensif — struktur field-nya fleksibel
// karena diisi manual oleh admin lewat panel, bukan skema tetap.
export default function ProfilContent({ konten }) {
  return (
    <div className="space-y-6">
      {Object.entries(konten).map(([key, value]) => (
        <div key={key}>
          <h3 className="font-heading text-lg font-semibold text-primary-dark">{humanize(key)}</h3>
          <Value value={value} />
        </div>
      ))}
    </div>
  )
}
