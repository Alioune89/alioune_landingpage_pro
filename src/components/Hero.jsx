import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { IMAGES } from '../lib/content';
import MagneticButton from './ui/MagneticButton';

const ZONES = ['Plateau', 'Médina', 'Fann', 'Point E', 'Mermoz', 'Almadies', 'Ngor', 'Yoff'];

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-bg', { scale: 1.12 }, { scale: 1, duration: 2.6, ease: 'power3.out' });
      gsap.from('.hero-reveal', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.2,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={root} className="relative h-[100dvh] min-h-[640px] w-full overflow-hidden bg-obsidian">
      <img
        src={IMAGES.hero}
        alt=""
        className="hero-bg absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/80 to-obsidian/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-obsidian/30 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-14 md:px-16 md:pb-20 lg:px-24">
        <div className="flex items-end justify-between gap-12">
          <div className="max-w-5xl">
            <p className="hero-reveal flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-champagne">
              <span className="h-px w-8 bg-champagne" />
              Livraison express · Dakar
            </p>

            <h1 className="mt-6 text-ivory">
              <span className="hero-reveal block text-[clamp(1.35rem,4vw,3.25rem)] font-bold leading-tight tracking-tight">
                L'urgence rencontre
              </span>
              <span className="hero-reveal block font-drama text-[clamp(3.4rem,14.5vw,12rem)] italic leading-[0.92] tracking-tight">
                la <span className="text-champagne">Précision.</span>
              </span>
            </h1>

            <p className="hero-reveal mt-7 max-w-xl text-base leading-relaxed text-ivory/70 md:text-lg">
              Vos colis traversent Dakar en moins de deux heures — enlevés à votre porte, suivis à la minute, remis en
              main propre contre signature.
            </p>

            <div className="hero-reveal mt-9 flex flex-wrap items-center gap-3">
              <MagneticButton href="#liste-attente" size="lg">
                Rejoindre la liste d'attente
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </MagneticButton>
              <MagneticButton href="#protocole" variant="ghost" size="lg">
                Découvrir la méthode
              </MagneticButton>
            </div>
          </div>

          <aside className="hero-reveal hidden shrink-0 border-l border-ivory/15 pl-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory/50 lg:block">
            <p className="text-champagne">Zones de lancement</p>
            <ul className="mt-4 space-y-2">
              {ZONES.map((zone) => (
                <li key={zone}>{zone}</li>
              ))}
            </ul>
          </aside>
        </div>

        <a
          href="#service"
          className="hero-reveal link-lift mt-12 hidden items-center gap-2 self-start font-mono text-[11px] uppercase tracking-[0.25em] text-ivory/50 hover:text-ivory md:inline-flex"
        >
          <ArrowDown className="h-3.5 w-3.5" /> Défiler
        </a>
      </div>
    </section>
  );
}
