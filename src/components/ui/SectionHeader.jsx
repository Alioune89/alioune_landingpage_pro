export default function SectionHeader({ index, eyebrow, title, drama, dark = false, children, className = '' }) {
  return (
    <div className={`section-reveal max-w-3xl ${className}`}>
      <p
        className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] ${
          dark ? 'text-champagne' : 'text-ardoise/60'
        }`}
      >
        <span>{index}</span>
        <span className="h-px w-8 bg-champagne" />
        <span>{eyebrow}</span>
      </p>
      <h2
        className={`mt-5 text-4xl font-bold tracking-tight md:text-6xl ${dark ? 'text-ivory' : 'text-obsidian'}`}
      >
        {title} <span className="font-drama font-normal italic">{drama}</span>
      </h2>
      {children && (
        <p className={`mt-5 max-w-xl text-base leading-relaxed md:text-lg ${dark ? 'text-ivory/60' : 'text-ardoise/70'}`}>
          {children}
        </p>
      )}
    </div>
  );
}
