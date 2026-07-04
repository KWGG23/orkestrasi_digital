import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'

export default function FeatureCard({ icon: Icon, eyebrow, title, description, to, badge, tone = 'primary' }) {
  const toneClasses = tone === 'accent' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'

  return (
    <Link
      to={to}
      className="group flex h-full flex-col rounded-3xl border border-border bg-white p-6 transition-shadow duration-200 hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses}`}>
          <Icon size={24} weight="duotone" />
        </span>
        {badge && (
          <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-medium text-clay">{badge}</span>
        )}
      </div>

      {eyebrow && (
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">{eyebrow}</p>
      )}
      <h3 className="mt-1 font-heading text-lg font-semibold text-primary-dark">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-bark/75">{description}</p>

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-transform duration-200 group-hover:translate-x-1">
        Lihat selengkapnya
        <ArrowRight size={16} />
      </span>
    </Link>
  )
}
