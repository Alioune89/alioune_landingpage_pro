import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { IMAGES, PLANS } from '../lib/content';
import MagneticButton from './ui/MagneticButton';
import SectionHeader from './ui/SectionHeader';

// URL qui reçoit les inscriptions en POST JSON { email, formule } (Formspree, Make, API maison…).
// Sans valeur, le formulaire affiche la confirmation sans rien envoyer.
const WAITLIST_ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT;

function WaitlistForm({ plan, onPlanChange }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      if (WAITLIST_ENDPOINT) {
        const res = await fetch(WAITLIST_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email, formule: plan }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-start gap-4" role="status">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne text-obsidian">
          <Check className="h-5 w-5" strokeWidth={2.5} />
        </span>
        <p className="text-2xl font-bold tracking-tight">
          C'est noté. <span className="font-drama font-normal italic text-champagne">Bienvenue.</span>
        </p>
        <p className="text-sm leading-relaxed text-ivory/60">
          Nous écrirons à <span className="text-ivory">{email}</span> dès l'ouverture de votre quartier.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <fieldset>
        <legend className="font-mono text-[11px] uppercase tracking-[0.2em] text-ivory/50">Formule envisagée</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={plan === p.id}
              onClick={() => onPlanChange(p.id)}
              className={`link-lift rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                plan === p.id ? 'bg-ivory text-obsidian' : 'text-ivory/70 ring-1 ring-ivory/20 hover:text-ivory'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ivory/50">Adresse e-mail</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@entreprise.sn"
          autoComplete="email"
          className="rounded-full bg-ivory/5 px-5 py-3.5 text-ivory ring-1 ring-ivory/15 transition placeholder:text-ivory/30 focus:outline-none focus:ring-champagne"
        />
      </label>

      <MagneticButton as="button" type="submit" size="lg" disabled={status === 'loading'} className="self-start disabled:opacity-60">
        {status === 'loading' ? 'Envoi…' : "Rejoindre la liste d'attente"}
        <ArrowRight className="h-4 w-4" strokeWidth={2} />
      </MagneticButton>

      {status === 'error' && (
        <p className="text-sm text-champagne" role="alert">
          L'inscription n'a pas pu être envoyée. Réessayez dans un instant.
        </p>
      )}
    </form>
  );
}

export default function Pricing() {
  const root = useRef(null);
  const [plan, setPlan] = useState('performance');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.section-reveal', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.section-reveal', start: 'top 85%' },
      });
      gsap.from('.plan-card', {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '.plan-grid', start: 'top 80%' },
      });
      gsap.from('.waitlist-card', {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.waitlist-card', start: 'top 85%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const choose = (id) => {
    setPlan(id);
    document.getElementById('liste-attente')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section id="formules" ref={root} className="relative z-10 bg-ivory px-6 py-24 md:px-16 md:py-32 lg:px-24">
      <SectionHeader index="04" eyebrow="Formules" title="Choisissez votre" drama="cadence.">
        Tarifs de lancement, réservés aux inscrits de la liste d'attente.
      </SectionHeader>

      <div className="plan-grid mt-14 grid items-center gap-6 md:mt-20 md:grid-cols-3">
        {PLANS.map((p) => (
          <article
            key={p.id}
            className={`plan-card flex flex-col rounded-[2rem] p-8 ${
              p.featured
                ? 'bg-obsidian text-ivory shadow-[0_40px_80px_-40px_rgba(13,13,18,0.8)] ring-1 ring-champagne/50 md:scale-[1.04] md:py-12'
                : 'border border-obsidian/10 bg-ivory text-obsidian shadow-[0_30px_60px_-40px_rgba(13,13,18,0.4)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className={`font-mono text-[11px] uppercase tracking-[0.25em] ${p.featured ? 'text-champagne' : 'text-ardoise/60'}`}>
                {p.name}
              </p>
              {p.featured && (
                <span className="rounded-full bg-champagne/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-champagne">
                  Recommandée
                </span>
              )}
            </div>
            <p className={`mt-2 text-sm ${p.featured ? 'text-ivory/60' : 'text-ardoise/70'}`}>{p.audience}</p>

            <p className="mt-8 text-4xl font-bold tracking-tight md:text-5xl">{p.price}</p>
            <p className={`mt-1 font-mono text-[11px] uppercase tracking-[0.15em] ${p.featured ? 'text-ivory/50' : 'text-ardoise/50'}`}>
              {p.unit}
            </p>

            <ul className={`mt-8 space-y-3 border-t pt-8 text-sm ${p.featured ? 'border-ivory/10' : 'border-obsidian/10'}`}>
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-champagne" strokeWidth={2.25} />
                  <span className={p.featured ? 'text-ivory/80' : 'text-ardoise/80'}>{f}</span>
                </li>
              ))}
            </ul>

            <MagneticButton
              as="button"
              type="button"
              variant={p.featured ? 'accent' : 'dark'}
              onClick={() => choose(p.id)}
              className="mt-10 w-full"
            >
              Choisir {p.name}
            </MagneticButton>
          </article>
        ))}
      </div>

      <div
        id="liste-attente"
        data-anchor
        className="waitlist-card relative mt-20 overflow-hidden rounded-[2.5rem] bg-ardoise text-ivory md:mt-28"
      >
        <img src={IMAGES.towers} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-[0.12]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ardoise via-ardoise/90 to-ardoise/60" />

        <div className="relative grid gap-12 p-8 md:grid-cols-2 md:p-14">
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-champagne">
              <span className="h-px w-8 bg-champagne" />
              Liste d'attente
            </p>
            <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
              Soyez livré <span className="font-drama font-normal italic text-champagne">en premier.</span>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-ivory/60">
              Nous ouvrons Dakar quartier par quartier. Les inscrits sont servis en priorité et conservent le tarif de
              lancement.
            </p>
          </div>
          <WaitlistForm plan={plan} onPlanChange={setPlan} />
        </div>
      </div>
    </section>
  );
}
