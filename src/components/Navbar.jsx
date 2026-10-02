import { useEffect, useState } from 'react';
import { NAV_LINKS } from '../lib/content';
import MagneticButton from './ui/MagneticButton';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return undefined;

    // La pilule devient opaque dès que le hero passe sous la navbar.
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      rootMargin: '-88px 0px 0px 0px',
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 rounded-full border transition-[background-color,border-color,color,box-shadow] duration-500 ease-magnetic ${
        scrolled
          ? 'border-obsidian/10 bg-ivory/60 text-obsidian shadow-[0_10px_40px_-20px_rgba(13,13,18,0.35)] backdrop-blur-xl'
          : 'border-transparent bg-transparent text-ivory'
      }`}
    >
      <nav className="flex items-center justify-between py-2 pl-5 pr-2 md:pl-7">
        <a href="#hero" className="link-lift text-lg font-bold tracking-tight">
          Livr<span className="font-drama font-medium italic text-champagne">Express</span>
        </a>

        <ul className="hidden items-center gap-8 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="link-lift opacity-80 hover:opacity-100">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <MagneticButton href="#liste-attente" size="sm">
          Liste d'attente
        </MagneticButton>
      </nav>
    </header>
  );
}
