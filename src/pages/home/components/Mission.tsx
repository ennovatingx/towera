import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Mission() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative py-20 md:py-28 px-4 md:px-6 bg-background-50">
      <div
        className={`max-w-4xl mx-auto text-center transition-all duration-800 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent-600 mb-6">
          Our Mission
        </span>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground-950 leading-tight mb-6">
          To preserve, digitize, and power every Nigerian language through trusted AI datasets and language intelligence.
        </h2>
        <p className="text-foreground-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
          Almost everyone is trying to build the next AI model. Very few are building the data infrastructure those models need. Towera is that infrastructure for Nigerian languages — the company that OpenAI, Google, Microsoft, universities, and Nigerian startups turn to for verified, native-speaker-created language datasets from Nigeria's 500+ living languages.
        </p>
      </div>
    </section>
  );
}