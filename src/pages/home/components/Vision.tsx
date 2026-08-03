import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Vision() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative py-20 md:py-28 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=Warm%20abstract%20geometric%20pattern%20composed%20of%20interconnected%20nodes%20and%20flowing%20lines%20in%20soft%20amber%20terracotta%20and%20cream%20tones%20suggesting%20language%20networks%20across%20Nigeria%20minimalist%20modern%20aesthetic%20subtle%20texture%20editorial%20quality%20dark%20background%20with%20warm%20accents%20no%20text&width=1800&height=800&seq=towera-vision-bg-v2&orientation=landscape"
          alt=""
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-foreground-950/90"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div
          className={`transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary-400 mb-6">
            Our Vision
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-6">
            A future where every Nigerian language is represented, understood, and usable by intelligent systems.
          </h2>
          <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-10">
            We don't compete with AI companies — we enable them. Towera is building the most durable business in AI: the data layer that every model needs and nobody else is building for Nigerian languages.
          </p>
        </div>

        <div
          className={`flex flex-wrap items-center justify-center gap-3 transition-all duration-700 delay-200 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {[
            'OpenAI',
            'Google DeepMind',
            'Microsoft Research',
            'Nigerian Universities',
            'Local Startups',
            'NITDA',
          ].map((partner) => (
            <span
              key={partner}
              className="px-5 py-2 rounded-full bg-white/8 text-white/70 text-sm font-medium border border-white/10 hover:bg-white/15 hover:text-white hover:border-white/25 transition-all duration-200 cursor-default"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}