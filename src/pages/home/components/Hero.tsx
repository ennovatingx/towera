import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=Warm%20golden%20amber%20and%20terracotta%20abstract%20landscape%20inspired%20by%20Nigerian%20geography%20with%20flowing%20organic%20data%20streams%20and%20geometric%20Adinkra-inspired%20patterns%20suggesting%20language%20networks%2C%20minimalist%20modern%20tech%20aesthetic%2C%20soft%20gradients%2C%20editorial%20quality%2C%20warm%20earthy%20tones%2C%20no%20text%2C%20abstract%20composition%20with%20depth%20and%20texture%20representing%20linguistic%20connectivity%20across%20Nigeria&width=1800&height=1200&seq=towera-hero-bg-v2&orientation=landscape"
          alt="Towera - Nigerian language data infrastructure"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/55"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-6 text-center pt-20">
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-8 transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></span>
          <span className="text-xs md:text-sm font-medium text-white/80 tracking-wide">
            Building the data layer for Nigerian AI
          </span>
        </div>

        <h1
          className={`font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6 transition-all duration-700 delay-100 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          We collect, verify, structure, and license high-quality Nigerian language datasets
        </h1>

        <p
          className={`text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          that power the next generation of AI. From Yoruba to Igbo, Hausa to Tiv — Towera is the data infrastructure behind every Nigerian language model.
        </p>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-700 delay-300 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <a
            href="/products"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary-500 text-background-50 font-semibold text-sm hover:bg-primary-600 active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            Explore our datasets
          </a>
          <a
            href="/contact"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 text-white font-semibold text-sm hover:bg-white/20 active:scale-95 backdrop-blur-sm border border-white/15 transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            Partner with us
          </a>
        </div>

        <div
          className={`mt-16 flex items-center justify-center gap-8 md:gap-12 transition-all duration-700 delay-400 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {[
            { value: '500+', label: 'Nigerian languages mapped' },
            { value: '30,000+', label: 'Hours of native speech' },
            { value: '80+', label: 'Dataset packages' },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center group cursor-default">
              <div
                className="font-heading text-2xl md:text-3xl font-semibold text-white transition-transform duration-300 group-hover:scale-110"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-white/50 mt-1 transition-colors duration-300 group-hover:text-white/70">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <i className="ri-arrow-down-line text-white/40 text-2xl"></i>
      </div>
    </section>
  );
}