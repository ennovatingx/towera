import { useScrollReveal } from '@/hooks/useScrollReveal';

const tribes = [
  'Yoruba',
  'Igbo',
  'Hausa',
  'Fulani',
  'Tiv',
  'Ijaw',
  'Kanuri',
  'Edo',
  'Ibibio',
  'Nupe',
  'Urhobo',
  'Igala',
  'Idoma',
  'Ebira',
  'Itsekiri',
  'Efik',
];

export default function Heritage() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=A%20rich%20artistic%20collage%20celebrating%20the%20cultural%20diversity%20of%20Nigerian%20ethnic%20groups%20featuring%20traditional%20Yoruba%20gele%20headwraps%20and%20agbada%20robes%20Igbo%20isiagu%20patterned%20textiles%20and%20coral%20beads%20Hausa-Fulani%20embroidered%20babban%20riga%20and%20caps%20Tiv%20angere%20stripes%20Ijaw%20traditional%20attire%20Edo%20coral%20regalia%20warm%20amber%20terracotta%20and%20gold%20tones%20editorial%20photography%20style%20with%20artistic%20double%20exposures%20and%20overlapping%20portrait%20silhouettes%20celebrating%20Nigerias%20linguistic%20and%20cultural%20heritage%20soft%20warm%20lighting%20museum%20quality%20composition&width=1800&height=900&seq=towera-heritage-collage&orientation=landscape"
          alt="Nigeria's rich linguistic and cultural heritage across Yoruba, Igbo, Hausa, Fulani, Tiv, Ijaw, Edo, and many more ethnic groups"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground-950/85 via-foreground-950/70 to-foreground-950/85"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div
          className={`text-center mb-12 transition-all duration-800 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary-400 mb-5">
            Nigeria's Linguistic Heritage
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4">
            Over 500 languages. One country.
          </h2>
          <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Nigeria is home to one of the world's highest concentrations of linguistic diversity. Towera exists to make sure every single one of these languages has a place in the AI-powered future.
          </p>
        </div>

        <div
          className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 transition-all duration-800 delay-200 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {tribes.map((tribe, i) => (
            <span
              key={tribe}
              className="px-4 py-1.5 rounded-full bg-white/8 text-white/75 text-sm font-medium border border-white/10 hover:bg-white/15 hover:text-white hover:border-white/20 transition-all duration-200 cursor-default"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {tribe}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}