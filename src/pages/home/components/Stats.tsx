import { useScrollReveal } from '@/hooks/useScrollReveal';

const stats = [
  { value: '500+', label: 'Nigerian languages mapped in Atlas', icon: 'ri-earth-line' },
  { value: '30,000+', label: 'Hours of native-speaker audio recorded', icon: 'ri-mic-line' },
  { value: '12', label: 'Languages with 1,000+ hours each', icon: 'ri-sound-module-line' },
  { value: '80+', label: 'Dataset packages available via API', icon: 'ri-database-2-line' },
];

export default function Stats() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-20 md:py-28 px-4 md:px-6 bg-background-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center group transition-all duration-600 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-accent-100 group-hover:bg-accent-200 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <i className={`${stat.icon} text-lg text-accent-600`}></i>
              </div>
              <div className="font-heading text-3xl md:text-4xl font-semibold text-foreground-950 mb-2 transition-transform duration-300 group-hover:scale-105">
                {stat.value}
              </div>
              <div className="text-sm text-foreground-500 leading-relaxed transition-colors duration-300 group-hover:text-foreground-700">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}