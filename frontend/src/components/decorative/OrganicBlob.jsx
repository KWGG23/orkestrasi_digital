// Bentuk blob organik untuk aksen latar biophilic. Murni dekoratif — disembunyikan dari screen reader.
export default function OrganicBlob({ className = '', tone = 'primary' }) {
  const fill = tone === 'accent' ? 'var(--color-accent-light)' : 'var(--color-primary-light)'

  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill={fill}
        d="M45.3,-58.5C58.4,-49.8,68.4,-35.4,72.6,-19.4C76.9,-3.4,75.3,14.2,67.6,28.6C59.9,43,46,54.3,30.5,61.6C15,68.9,-2.1,72.3,-18.6,69.1C-35.1,65.9,-51,56.1,-61.6,42C-72.2,27.9,-77.5,9.5,-75.3,-7.8C-73.1,-25.1,-63.4,-41.3,-49.8,-50.3C-36.2,-59.3,-18.1,-61.1,-0.6,-60.2C16.9,-59.3,32.2,-67.2,45.3,-58.5Z"
        transform="translate(100 100)"
      />
    </svg>
  )
}
