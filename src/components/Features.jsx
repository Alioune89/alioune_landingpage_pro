import { useEffect, useRef, useState } from 'react';
import { Bike, Package, PenLine } from 'lucide-react';
import { gsap } from '../lib/gsap';
import SectionHeader from './ui/SectionHeader';

/* ───────────── Carte 1 — Mélangeur diagnostique (Design) ───────────── */

const SHUFFLE_ITEMS = [
  {
    id: 'ecrin',
    code: '01 · Écrin',
    title: 'Emballage scellé',
    detail: 'Scellé et étiqueté devant vous, à l’enlèvement.',
    Icon: Package,
  },
  {
    id: 'coursier',
    code: '02 · Coursier',
    title: 'Coursier dédié',
    detail: 'Vérifié, formé, en tenue LivrExpress.',
    Icon: Bike,
  },
  {
    id: 'remise',
    code: '03 · Remise',
    title: 'Remise signée',
    detail: 'Signature et photo horodatée à la livraison.',
    Icon: PenLine,
  },
];

// Position 0 = carte au premier plan.
// Les cartes arrière s'éclaircissent au lieu de devenir transparentes : aucun texte ne se superpose.
const STACK = [
  { y: 0, scale: 1, bg: '#0D0D12', z: 30 },
  { y: -18, scale: 0.94, bg: '#2A2A35', z: 20 },
  { y: -36, scale: 0.88, bg: '#4A4A55', z: 10 },
];

function DiagnosticShuffler() {
  const [order, setOrder] = useState(SHUFFLE_ITEMS.map((item) => item.id));

  useEffect(() => {
    const id = setInterval(() => {
      setOrder((prev) => {
        const next = [...prev];
        next.unshift(next.pop());
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-full">
      {SHUFFLE_ITEMS.map(({ id, code, title, detail, Icon }) => {
        const position = order.indexOf(id);
        const p = STACK[position];
        return (
          <div
            key={id}
            className="absolute inset-x-0 bottom-10 origin-top rounded-[1.5rem] p-5 text-ivory shadow-[0_20px_40px_-20px_rgba(13,13,18,0.7)]"
            style={{
              transform: `translateY(${p.y}px) scale(${p.scale})`,
              backgroundColor: p.bg,
              zIndex: p.z,
              transition:
                'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <div
              className="transition-opacity duration-500 ease-magnetic"
              style={{ opacity: position === 0 ? 1 : 0 }}
              aria-hidden={position !== 0}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-champagne/15 text-champagne">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40">{code}</span>
              </div>
              <p className="mt-5 text-lg font-semibold tracking-tight">{title}</p>
              <p className="mt-1 text-[13px] leading-snug text-ivory/55">{detail}</p>
            </div>
          </div>
        );
      })}

      <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1.5">
        {SHUFFLE_ITEMS.map(({ id }) => (
          <span
            key={id}
            className={`h-1 rounded-full transition-all duration-500 ease-magnetic ${
              order[0] === id ? 'w-6 bg-champagne' : 'w-1.5 bg-obsidian/15'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ───────────── Carte 2 — Machine à écrire télémétrie (Vitesse) ───────────── */

const FEED = [
  'LX-2041 · Plateau → Almadies',
  'Coursier assigné en 6 min',
  'Corniche Ouest fluide · ETA 41 min',
  'LX-2041 · remis en main propre ✓',
  'LX-2042 · Médina → Point E',
  'Itinéraire recalculé · VDN',
  'LX-2042 · livré en 1 h 12 ✓',
];

const dakarTime = () =>
  new Intl.DateTimeFormat('fr-FR', { timeZone: 'Africa/Dakar', hour: '2-digit', minute: '2-digit' }).format(new Date());

function TelemetryTypewriter() {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState('');
  const [clock, setClock] = useState(dakarTime);

  useEffect(() => {
    let msgIndex = 0;
    let charIndex = 0;
    let lineId = 0;
    let timer;

    const type = () => {
      const message = FEED[msgIndex];
      if (charIndex <= message.length) {
        setCurrent(message.slice(0, charIndex));
        charIndex += 1;
        timer = setTimeout(type, 28 + Math.random() * 45);
        return;
      }
      timer = setTimeout(() => {
        lineId += 1;
        const done = { id: lineId, text: message };
        setHistory((prev) => [...prev, done].slice(-3));
        setCurrent('');
        charIndex = 0;
        msgIndex = (msgIndex + 1) % FEED.length;
        type();
      }, 1200);
    };

    type();
    const clockTimer = setInterval(() => setClock(dakarTime()), 15000);
    return () => {
      clearTimeout(timer);
      clearInterval(clockTimer);
    };
  }, []);

  return (
    <div className="flex h-full flex-col rounded-[1.5rem] bg-obsidian p-5 font-mono text-[11.5px] leading-relaxed text-ivory">
      <div className="flex items-center justify-between border-b border-ivory/10 pb-3">
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-ivory/70">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-champagne opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-champagne" />
          </span>
          Flux en direct
        </span>
        <span className="text-[10px] tracking-[0.15em] text-ivory/40">DKR {clock}</span>
      </div>

      <div className="mt-3 flex flex-1 flex-col justify-end gap-1.5 overflow-hidden">
        {history.map((line) => (
          <p key={line.id} className="text-ivory/35">
            <span className="text-champagne/50">›</span> {line.text}
          </p>
        ))}
        <p className="min-h-[1.25rem] text-ivory">
          <span className="text-champagne">›</span> {current}
          <span className="caret-blink ml-0.5 inline-block h-[13px] w-[7px] translate-y-[2px] bg-champagne" />
        </p>
      </div>
    </div>
  );
}

/* ───────────── Carte 3 — Planificateur protocole curseur (Suivi) ───────────── */

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const RECURRING = [0, 3]; // lundi et jeudi déjà programmés
const CYCLE = [2, 5, 4]; // jours activés tour à tour par le curseur

function CursorScheduler() {
  const areaRef = useRef(null);
  const cursorRef = useRef(null);
  const saveRef = useRef(null);
  const cellRefs = useRef([]);
  const [active, setActive] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let ctx;

    const build = () => {
      ctx?.revert();
      setActive(null);
      setSaved(false);

      ctx = gsap.context(() => {
        const area = areaRef.current.getBoundingClientRect();
        const cursor = cursorRef.current;
        const save = saveRef.current;
        const centerOf = (el) => {
          const r = el.getBoundingClientRect();
          return { x: r.left - area.left + r.width / 2 - 3, y: r.top - area.top + r.height / 2 - 2 };
        };
        const start = { x: area.width - 28, y: area.height - 70 };
        const target = centerOf(save);

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
        CYCLE.forEach((dayIndex) => {
          const cell = cellRefs.current[dayIndex];
          const c = centerOf(cell);
          tl.set(cursor, { x: start.x, y: start.y, opacity: 0, scale: 1 })
            .to(cursor, { opacity: 1, duration: 0.3, ease: 'power3.out' })
            .to(cursor, { x: c.x, y: c.y, duration: 1, ease: 'power2.inOut' })
            .to(cursor, { scale: 0.82, duration: 0.1 })
            .to(cell, { scale: 0.95, duration: 0.1 }, '<')
            .call(() => setActive(dayIndex))
            .to([cursor, cell], { scale: 1, duration: 0.2, ease: 'power3.out' })
            .to(cursor, { x: target.x, y: target.y, duration: 0.85, ease: 'power2.inOut' }, '+=0.35')
            .to(cursor, { scale: 0.82, duration: 0.1 })
            .to(save, { scale: 0.95, duration: 0.1 }, '<')
            .call(() => setSaved(true))
            .to([cursor, save], { scale: 1, duration: 0.2, ease: 'power3.out' })
            .to(cursor, { opacity: 0, duration: 0.3 }, '+=0.3')
            .call(
              () => {
                setActive(null);
                setSaved(false);
              },
              null,
              '+=0.9',
            );
        });
      }, areaRef);
    };

    build();
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 250);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
      ctx?.revert();
    };
  }, []);

  const count = RECURRING.length + (active !== null ? 1 : 0);

  return (
    <div
      ref={areaRef}
      className="relative flex h-full flex-col rounded-[1.5rem] border border-obsidian/10 bg-white/60 p-5"
    >
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
        <span className="text-ardoise/60">Enlèvements récurrents</span>
        <span className="text-ardoise/40">Hebdo</span>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {DAYS.map((day, i) => {
          const isActive = active === i;
          const isRecurring = RECURRING.includes(i);
          return (
            <div
              key={i}
              ref={(el) => {
                cellRefs.current[i] = el;
              }}
              className={`flex aspect-square items-center justify-center rounded-xl font-mono text-[11px] transition-colors duration-300 ${
                isActive
                  ? 'bg-champagne text-obsidian'
                  : isRecurring
                    ? 'bg-obsidian text-ivory'
                    : 'border border-obsidian/10 text-ardoise/50'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      <dl className="mt-4 space-y-1.5 font-mono text-[10.5px] text-ardoise/55">
        <div className="flex justify-between">
          <dt>Créneau</dt>
          <dd className="text-obsidian">09:00 – 11:00</dd>
        </div>
        <div className="flex justify-between">
          <dt>Par semaine</dt>
          <dd className="text-obsidian">{count} enlèvements</dd>
        </div>
      </dl>

      <div className="mt-auto flex items-center justify-between pt-3">
        <span
          className={`font-mono text-[10.5px] text-ardoise transition-opacity duration-300 ${saved ? 'opacity-100' : 'opacity-0'}`}
        >
          ✓ Planning enregistré
        </span>
        <div ref={saveRef} className="rounded-full bg-obsidian px-4 py-2 text-[11px] font-medium text-ivory">
          Sauvegarder
        </div>
      </div>

      <div ref={cursorRef} className="pointer-events-none absolute left-0 top-0 z-10 origin-top-left opacity-0">
        <svg viewBox="0 0 24 24" className="h-5 w-5 drop-shadow-[0_2px_4px_rgba(13,13,18,0.35)]" aria-hidden="true">
          <path
            d="M4 2 4 19.5 8.6 15.2 12 22l3-1.4-3.3-6.6H18.5Z"
            fill="#FAF8F5"
            stroke="#0D0D12"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

/* ───────────── Section ───────────── */

const FEATURES = [
  {
    tag: 'Design',
    title: 'Un service dessiné au détail près',
    desc: 'Chaque envoi est traité comme un objet précieux, de l’emballage à la signature.',
    Visual: DiagnosticShuffler,
  },
  {
    tag: 'Vitesse',
    title: 'Livré en moins de deux heures',
    desc: 'Le coursier le plus proche part dans les minutes qui suivent votre demande.',
    Visual: TelemetryTypewriter,
  },
  {
    tag: 'Suivi',
    title: 'Un suivi qui se planifie',
    desc: 'Programmez vos enlèvements récurrents et suivez chaque colis jusqu’à la remise.',
    Visual: CursorScheduler,
  },
];

export default function Features() {
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
      gsap.from('.feature-card', {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '.feature-grid', start: 'top 80%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="service" ref={root} className="relative px-6 py-24 md:px-16 md:py-32 lg:px-24">
      <SectionHeader index="01" eyebrow="Le service" title="Trois promesses," drama="tenues à la minute.">
        Pensé pour les commerçants, les e-shops et tous ceux pour qui un colis en retard est un client perdu.
      </SectionHeader>

      <div className="feature-grid mt-14 grid gap-6 md:mt-20 md:grid-cols-3">
        {FEATURES.map(({ tag, title, desc, Visual }) => (
          <article
            key={tag}
            className="feature-card flex flex-col rounded-[2rem] border border-obsidian/10 bg-ivory p-5 shadow-[0_30px_60px_-35px_rgba(13,13,18,0.45)] md:p-6"
          >
            <div className="h-64">
              <Visual />
            </div>
            <div className="mt-6 px-1 pb-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ardoise/50">{tag}</p>
              <h3 className="mt-2 text-xl font-bold tracking-tight text-obsidian">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ardoise/70">{desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
