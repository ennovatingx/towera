import { useScrollReveal } from '@/hooks/useScrollReveal';

const steps = [
  {
    icon: 'ri-edit-line',
    title: 'Translate',
    description: 'Pick a phrase and translate it into your language or dialect, from proverbs to everyday conversation.',
  },
  {
    icon: 'ri-mic-line',
    title: 'Record',
    description: 'Optionally record or upload pronunciation audio so learners and models hear it spoken naturally.',
  },
  {
    icon: 'ri-shield-check-line',
    title: 'Get reviewed',
    description: 'A reviewer checks your submission for accuracy before it joins a licensed dataset.',
  },
];

export default function HowItWorks() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-20 md:py-28 px-4 md:px-6 bg-background-50">
      <div
        className={`max-w-5xl mx-auto transition-all duration-800 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent-600 mb-4">
            How it works
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground-950">
            Three steps to contribute
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={step.title} className="relative bg-background-100 rounded-2xl p-6 text-center">
              <div className="absolute top-4 right-5 font-heading text-3xl font-semibold text-background-300">
                {i + 1}
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <i className={`${step.icon} text-xl text-primary-600`} />
              </div>
              <h3 className="font-heading text-lg text-foreground-900 mb-2">{step.title}</h3>
              <p className="text-sm text-foreground-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
