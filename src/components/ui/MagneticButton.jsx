const VARIANTS = {
  accent: {
    base: 'bg-champagne text-obsidian ring-1 ring-champagne',
    slide: 'bg-obsidian',
    label: 'group-hover:text-champagne',
  },
  dark: {
    base: 'bg-obsidian text-ivory',
    slide: 'bg-champagne',
    label: 'group-hover:text-obsidian',
  },
  ghost: {
    base: 'text-ivory ring-1 ring-ivory/25',
    slide: 'bg-ivory',
    label: 'group-hover:text-obsidian',
  },
};

const SIZES = {
  sm: 'px-4 py-2.5 text-[13px]',
  md: 'px-6 py-3.5 text-sm',
  lg: 'px-8 py-4 text-[15px]',
};

export default function MagneticButton({
  as: Tag = 'a',
  variant = 'accent',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const v = VARIANTS[variant];

  return (
    <Tag className={`btn-magnetic group ${SIZES[size]} ${v.base} ${className}`} {...props}>
      <span aria-hidden="true" className={`btn-slide ${v.slide}`} />
      <span className={`btn-label ${v.label}`}>{children}</span>
    </Tag>
  );
}
