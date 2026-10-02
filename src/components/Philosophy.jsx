import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { IMAGES } from '../lib/content';
import SplitWords from './ui/SplitWords';

export default function Philosophy() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.manifesto-texture',
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );

      gsap.utils.toArray('.manifesto-line').forEach((line) => {
        gsap.from(line.querySelectorAll('.split-word'), {
          yPercent: 110,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: line, start: 'top 82%' },
        });
      });

      gsap.from('.manifesto-meta', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '.manifesto-meta', start: 'top 90%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="manifeste" ref={root} className="relative overflow-hidden bg-obsidian px-6 py-32 md:px-16 md:py-48 lg:px-24">
      <img
        src={IMAGES.texture}
        alt=""
        loading="lazy"
        className="manifesto-texture absolute inset-x-0 -top-[15%] h-[130%] w-full object-cover opacity-[0.18]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/40 to-obsidian" />

      <div className="relative mx-auto max-w-6xl">
        <p className="manifesto-meta flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-champagne">
          <span>02</span>
          <span className="h-px w-8 bg-champagne" />
          <span>Manifeste</span>
        </p>

        <p className="manifesto-line mt-12 max-w-2xl text-xl leading-snug text-ivory/55 md:text-2xl">
          <SplitWords
            segments={[{ text: 'La plupart des services de livraison se concentrent sur : le volume, quitte à sacrifier vos délais.' }]}
          />
        </p>

        <p className="manifesto-line mt-10 font-drama text-[clamp(2.6rem,7vw,6.5rem)] italic leading-[1.05] text-ivory md:mt-14">
          <SplitWords
            segments={[
              { text: 'Nous nous concentrons sur : la' },
              { text: 'précision', className: 'text-champagne' },
              { text: 'de chaque remise.' },
            ]}
          />
        </p>

        <div className="mt-16 grid gap-8 border-t border-ivory/10 pt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory/45 sm:grid-cols-3 md:mt-24">
          <p className="manifesto-meta">
            <span className="text-champagne">I.</span> Un colis, un coursier, un itinéraire.
          </p>
          <p className="manifesto-meta">
            <span className="text-champagne">II.</span> Chaque minute est mesurée.
          </p>
          <p className="manifesto-meta">
            <span className="text-champagne">III.</span> Chaque remise est prouvée.
          </p>
        </div>
      </div>
    </section>
  );
}
