import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import SectionHeader from './ui/SectionHeader';

/* ───────────── Visuel 1 — Cadran d'horloger en rotation lente ───────────── */

const TICKS = Array.from({ length: 60 }, (_, i) => i);
const GEAR = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 * Math.PI) / 180;
  return { x: 200 + 92 * Math.sin(a), y: 200 - 92 * Math.cos(a) };
});

function DialVisual() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const spin = (target, duration, direction = 1) =>
        gsap.to(target, { rotation: 360 * direction, svgOrigin: '200 200', duration, repeat: -1, ease: 'none' });
      spin('.dial-ticks', 120);
      spin('.dial-dash', 45, -1);
      spin('.dial-gear', 30);
      spin('.dial-hand-min', 10);
      spin('.dial-hand-hour', 120);
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={ref} viewBox="0 0 400 400" className="h-full max-h-[440px] w-full" aria-hidden="true">
      <circle cx="200" cy="200" r="192" fill="none" stroke="currentColor" strokeOpacity="0.12" />
      <g className="dial-ticks">
        {TICKS.map((i) => {
          const major = i % 5 === 0;
          return (
            <line
              key={i}
              x1="200"
              y1={major ? 16 : 22}
              x2="200"
              y2="32"
              stroke={major ? '#C9A84C' : 'currentColor'}
              strokeOpacity={major ? 1 : 0.3}
              strokeWidth={major ? 2 : 1}
              transform={`rotate(${i * 6} 200 200)`}
            />
          );
        })}
      </g>
      <circle className="dial-dash" cx="200" cy="200" r="148" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="2 10" />
      {/* Fenêtre de deux heures sur le cadran */}
      <circle cx="200" cy="200" r="122" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="6" />
      <path d="M200 78 A122 122 0 0 1 305.66 139" fill="none" stroke="#C9A84C" strokeWidth="6" strokeLinecap="round" />
      <g className="dial-gear">
        {GEAR.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i % 3 === 0 ? 5 : 3} fill={i % 3 === 0 ? '#C9A84C' : 'currentColor'} fillOpacity={i % 3 === 0 ? 1 : 0.3} />
        ))}
      </g>
      <circle cx="200" cy="200" r="66" fill="none" stroke="currentColor" strokeOpacity="0.15" />
      <line className="dial-hand-hour" x1="200" y1="200" x2="200" y2="138" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line className="dial-hand-min" x1="200" y1="214" x2="200" y2="96" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
      <circle cx="200" cy="200" r="7" fill="#C9A84C" />
      <circle cx="200" cy="200" r="2.5" fill="currentColor" />
    </svg>
  );
}

/* ───────────── Visuel 2 — Laser de balayage sur grille de points ───────────── */

const GAP = 22;

function LaserGrid() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const c = canvas.getContext('2d');
    const scan = { p: 0 };
    let dots = [];
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.max(4, Math.floor(w / GAP));
      const rows = Math.max(4, Math.floor(h / GAP));
      const ox = (w - (cols - 1) * GAP) / 2;
      const oy = (h - (rows - 1) * GAP) / 2;

      // Itinéraire en escalier du coin bas-gauche au coin haut-droit.
      const route = new Set();
      let x = 1;
      let y = rows - 2;
      let step = 0;
      route.add(`${x},${y}`);
      while (x < cols - 2 || y > 1) {
        if ((step % 3 !== 2 && x < cols - 2) || y <= 1) x += 1;
        else y -= 1;
        route.add(`${x},${y}`);
        step += 1;
      }

      dots = [];
      for (let gy = 0; gy < rows; gy += 1) {
        for (let gx = 0; gx < cols; gx += 1) {
          dots.push({
            x: ox + gx * GAP,
            y: oy + gy * GAP,
            glow: 0,
            onRoute: route.has(`${gx},${gy}`),
            endpoint: (gx === 1 && gy === rows - 2) || (gx === cols - 2 && gy === 1),
          });
        }
      }
    };

    const draw = () => {
      if (!w || !h) return;
      c.clearRect(0, 0, w, h);
      const ly = scan.p * h;

      for (const d of dots) {
        d.glow = Math.abs(d.y - ly) < 12 ? 1 : d.glow * 0.94;
        const base = d.onRoute ? 0.55 : 0.14;
        const alpha = Math.max(base, d.glow * (d.onRoute ? 1 : 0.85));
        const lit = d.onRoute || d.glow > 0.05;
        c.fillStyle = lit ? `rgba(201,168,76,${alpha})` : `rgba(250,248,245,${base})`;
        c.beginPath();
        c.arc(d.x, d.y, d.onRoute ? 2.2 : 1.4, 0, Math.PI * 2);
        c.fill();

        if (d.endpoint) {
          c.strokeStyle = 'rgba(201,168,76,0.9)';
          c.lineWidth = 1.25;
          c.beginPath();
          c.arc(d.x, d.y, 7, 0, Math.PI * 2);
          c.stroke();
        }
      }

      const grad = c.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, 'rgba(201,168,76,0)');
      grad.addColorStop(0.5, 'rgba(201,168,76,1)');
      grad.addColorStop(1, 'rgba(201,168,76,0)');
      c.save();
      c.strokeStyle = grad;
      c.lineWidth = 1.5;
      c.shadowColor = '#C9A84C';
      c.shadowBlur = 14;
      c.beginPath();
      c.moveTo(0, ly);
      c.lineTo(w, ly);
      c.stroke();
      c.restore();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const ctx = gsap.context(() => {
      gsap.to(scan, { p: 1, duration: 3.2, ease: 'power1.inOut', repeat: -1, yoyo: true });
    });
    gsap.ticker.add(draw);

    return () => {
      gsap.ticker.remove(draw);
      ro.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-6 overflow-hidden rounded-[2rem] border border-ivory/10 bg-obsidian/40 md:inset-10">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      <span className="absolute left-5 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40">
        Scan itinéraire · Dakar
      </span>
    </div>
  );
}

/* ───────────── Visuel 3 — Forme d'onde pulsante (ECG) ───────────── */

const ECG_PATH =
  'M0 120 H130 L145 104 L160 120 H180 L192 136 L208 28 L224 204 L238 120 H270 L290 96 L315 120 H400 L415 104 L430 120 H450 L462 136 L478 28 L494 204 L508 120 H540 L560 98 L580 120 H600';

function PulseWave() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const path = ref.current.querySelector('.ecg-live');
      const len = path.getTotalLength();
      const seg = len * 0.3;
      gsap.set(path, { strokeDasharray: `${seg} ${len}` });
      gsap.fromTo(path, { strokeDashoffset: seg }, { strokeDashoffset: -len, duration: 2.6, ease: 'none', repeat: -1 });
      gsap.fromTo('.ecg-badge', { opacity: 0.45 }, { opacity: 1, duration: 0.65, ease: 'power2.inOut', repeat: -1, yoyo: true });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="w-full">
      <svg viewBox="0 0 600 240" className="w-full" aria-hidden="true">
        <defs>
          <pattern id="ecg-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0H0V30" fill="none" stroke="#FAF8F5" strokeOpacity="0.06" />
          </pattern>
        </defs>
        <rect width="600" height="240" fill="url(#ecg-grid)" />
        <path d={ECG_PATH} fill="none" stroke="#FAF8F5" strokeOpacity="0.14" strokeWidth="2" strokeLinejoin="round" />
        <path
          className="ecg-live"
          d={ECG_PATH}
          fill="none"
          stroke="#C9A84C"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 6px rgba(201,168,76,0.8))' }}
        />
      </svg>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
        <span className="ecg-badge flex items-center gap-2 text-champagne">
          <span className="h-1.5 w-1.5 rounded-full bg-champagne" />
          Signature reçue
        </span>
        <span className="text-ivory/40">Preuve photo · horodatée</span>
      </div>
    </div>
  );
}

/* ───────────── Section ───────────── */

const THEMES = {
  light: {
    panel: 'bg-[#F2EEE6] text-obsidian ring-1 ring-obsidian/10',
    muted: 'text-ardoise/70',
    chip: 'border-obsidian/15 text-ardoise/80',
    visual: 'text-obsidian',
  },
  slate: {
    panel: 'bg-ardoise text-ivory',
    muted: 'text-ivory/60',
    chip: 'border-ivory/15 text-ivory/70',
    visual: 'text-ivory',
  },
  dark: {
    panel: 'bg-obsidian text-ivory ring-1 ring-ivory/10',
    muted: 'text-ivory/60',
    chip: 'border-ivory/15 text-ivory/70',
    visual: 'text-ivory',
  },
};

const STEPS = [
  {
    n: '01',
    title: 'Collecte',
    drama: 'à votre porte.',
    desc: 'Réservez en trente secondes. Un coursier vérifié vient chercher votre colis et le scelle devant vous.',
    meta: ['Réservation en 30 s', 'Colis scellé'],
    theme: 'light',
    Visual: DialVisual,
  },
  {
    n: '02',
    title: 'Routage',
    drama: 'à travers Dakar.',
    desc: 'Notre moteur trace l’itinéraire le plus rapide et le recalcule en continu, de la VDN à la Corniche.',
    meta: ['Itinéraire dynamique', 'Suivi GPS'],
    theme: 'slate',
    Visual: LaserGrid,
  },
  {
    n: '03',
    title: 'Remise',
    drama: 'en main propre.',
    desc: 'Signature du destinataire et photo horodatée : la preuve arrive sur votre téléphone, en moins de deux heures.',
    meta: ['Signature', 'Photo horodatée'],
    theme: 'dark',
    Visual: PulseWave,
  },
];

export default function Protocol() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.section-reveal', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.section-reveal', start: 'top 85%' },
      });
    }, root);

    const mm = gsap.matchMedia(root);

    // Bureau : archive empilée — chaque carte est épinglée puis recouverte par la suivante.
    mm.add('(min-width: 768px)', () => {
      const cards = gsap.utils.toArray('.protocol-card');
      const last = cards[cards.length - 1];
      cards.forEach((card, i) => {
        if (card === last) return;
        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          endTrigger: last,
          end: 'top top',
          pin: true,
          pinSpacing: false,
        });
        gsap.to(card.querySelector('.protocol-inner'), {
          scale: 0.9,
          filter: 'blur(20px)',
          opacity: 0.5,
          ease: 'none',
          scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top top', scrub: true },
        });
      });
    });

    // Mobile : simple apparition des cartes, sans épinglage.
    mm.add('(max-width: 767px)', () => {
      gsap.utils.toArray('.protocol-inner').forEach((inner) => {
        gsap.from(inner, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: inner, start: 'top 85%' },
        });
      });
    });

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section id="protocole" ref={root} className="relative z-0 bg-ivory pb-10 md:pb-0">
      <div className="px-6 pb-12 pt-24 md:px-16 md:pt-32 lg:px-24">
        <SectionHeader index="03" eyebrow="La méthode" title="Du clic à la signature," drama="en trois temps." />
      </div>

      {STEPS.map(({ n, title, drama, desc, meta, theme, Visual }, i) => {
        const t = THEMES[theme];
        return (
          <div
            key={n}
            className="protocol-card relative flex items-center justify-center px-4 py-2 md:h-[100dvh] md:px-8 md:pb-6 md:pt-24"
            style={{ zIndex: i + 1 }}
          >
            <div
              className={`protocol-inner grid h-full w-full max-w-7xl overflow-hidden rounded-[2rem] will-change-transform md:grid-cols-2 md:rounded-[3rem] ${t.panel}`}
            >
              <div className="flex flex-col justify-between gap-10 p-8 md:p-14">
                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.25em]">
                  <span className="text-champagne">Étape {n}</span>
                  <span className={t.muted}>{n} / 03</span>
                </div>
                <div>
                  <h3 className="text-5xl font-bold tracking-tight md:text-7xl">
                    {title}
                    <span className="mt-1 block font-drama text-4xl font-normal italic md:text-6xl">{drama}</span>
                  </h3>
                  <p className={`mt-6 max-w-md text-base leading-relaxed md:text-lg ${t.muted}`}>{desc}</p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {meta.map((m) => (
                      <span key={m} className={`rounded-full border px-3 py-1.5 font-mono text-[11px] ${t.chip}`}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`relative flex min-h-[320px] items-center justify-center p-8 md:p-12 ${t.visual}`}>
                <Visual />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
