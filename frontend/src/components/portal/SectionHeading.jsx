export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>
      <h2 className="mt-2 font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-bark/75">{description}</p>
    </div>
  )
}
