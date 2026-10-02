import { NAV_LINKS } from '../lib/content';

const LEGAL = ['Mentions légales', 'Confidentialité', 'Conditions générales'];

export default function Footer() {
  return (
    <footer className="relative z-10 rounded-t-[4rem] bg-obsidian px-6 pb-10 pt-20 text-ivory md:px-16 md:pt-24 lg:px-24">
      <div className="grid gap-14 md:grid-cols-12">
        <div className="md:col-span-6">
          <a href="#hero" className="link-lift text-3xl font-bold tracking-tight">
            Livr<span className="font-drama font-medium italic text-champagne">Express</span>
          </a>
          <p className="mt-5 max-w-sm leading-relaxed text-ivory/50">
            Dakar, livré en deux heures. Avec la précision d'un horloger.
          </p>
        </div>

        <nav className="md:col-span-3" aria-label="Navigation du pied de page">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-champagne">Navigation</p>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="link-lift text-ivory/60 hover:text-ivory">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#liste-attente" className="link-lift text-ivory/60 hover:text-ivory">
                Liste d'attente
              </a>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-champagne">Légal</p>
          <ul className="mt-5 space-y-3 text-sm">
            {LEGAL.map((item) => (
              <li key={item}>
                <a href="#" className="link-lift text-ivory/60 hover:text-ivory">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-20 flex flex-col-reverse gap-6 border-t border-ivory/10 pt-8 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-ivory/40">© {new Date().getFullYear()} LivrExpress — Dakar, Sénégal</p>
        <p className="flex items-center gap-3 self-start rounded-full bg-ivory/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory/60 ring-1 ring-ivory/10 md:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Système opérationnel
        </p>
      </div>
    </footer>
  );
}
