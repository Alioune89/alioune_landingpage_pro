import { useEffect } from 'react';
import { ScrollTrigger } from './lib/gsap';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Philosophy from './components/Philosophy';
import Protocol from './components/Protocol';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
    // Les polices modifient la hauteur des sections : on recalcule les déclencheurs une fois chargées.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Philosophy />
        <Protocol />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
