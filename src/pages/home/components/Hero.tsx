import { lazy, Suspense, useEffect, useState } from 'react';

const HeroUniverse = lazy(() => import('./hero-universe/HeroUniverse'));

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden bg-foreground-950">
      <div className="absolute inset-0 bg-gradient-to-b from-foreground-950 via-foreground-950/95 to-foreground-950" />

      <Suspense fallback={null}>
        <HeroUniverse />
      </Suspense>

      <div className="absolute z-[200] top-24 md:top-28 left-4 sm:left-8 md:left-12 max-w-[240px] sm:max-w-xs text-left pointer-events-none">
        {/* <div
          className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-2 sm:mb-3 transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-accent-400 animate-pulse shrink-0"></span>
          <span className="text-[10px] sm:text-[11px] font-medium text-white/80 tracking-wide leading-snug">
            Building the data layer for Nigerian AI
          </span>
        </div> */}

        {/* <h1
          className={`font-heading text-lg sm:text-xl font-semibold text-white leading-tight mb-2 transition-all duration-700 delay-100 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          We collect, verify, structure, and license high-quality Nigerian language datasets
        </h1> */}

        <p
          className={`text-xs text-white/60 mb-4 leading-relaxed transition-all duration-700 delay-200 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Drag to explore the data universe — Use cases of Towera Datasets — Towera is the data infrastructure behind Nigeria's AI economy.
        </p>

        <div
          className={`pointer-events-auto transition-all duration-700 delay-300 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* <a
            href="#"
            className="inline-block px-5 py-2 rounded-full bg-white/10 text-white font-semibold text-xs hover:bg-white/20 active:scale-95 backdrop-blur-sm border border-white/15 transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            Converse with Towera (soon)
          </a> */}
        </div>
      </div>

      {/* <button
        type="button"
        onClick={handleScrollNext}
        aria-label="Scroll to next section"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-bounce cursor-pointer"
      >
        <i className="ri-arrow-down-line text-white/40 text-2xl"></i>
      </button> */}
    </section>
  );
}
