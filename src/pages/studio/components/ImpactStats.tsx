import { useEffect, useState } from 'react';
import { hasStoredToken, listLanguages, listPhrases, listTranslations } from '@/api';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function ImpactStats() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });
  const [counts, setCounts] = useState<{ languages: number; phrases: number; approved: number } | null>(null);

  useEffect(() => {
    // Every endpoint on the API requires a signed-in session, so there's no
    // way to show live counts to an anonymous visitor — only try when a
    // session already exists (e.g. a logged-in user browsing back to /studio).
    if (!hasStoredToken()) return;
    (async () => {
      try {
        const [languages, phrases, translations] = await Promise.all([
          listLanguages(),
          listPhrases(),
          listTranslations({ status: 'approved' }),
        ]);
        setCounts({ languages: languages.length, phrases: phrases.length, approved: translations.length });
      } catch {
        setCounts(null);
      }
    })();
  }, []);

  if (!counts) return null;

  const stats = [
    { value: counts.languages, label: 'Languages tracked' },
    { value: counts.phrases, label: 'Source phrases' },
    { value: counts.approved, label: 'Approved translations' },
  ];

  return (
    <section ref={ref} className="py-16 md:py-20 px-4 md:px-6 bg-background-50">
      <div
        className={`max-w-4xl mx-auto grid grid-cols-3 gap-6 transition-all duration-800 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-heading text-3xl md:text-4xl font-semibold text-foreground-950">{stat.value}</div>
            <div className="text-xs md:text-sm text-foreground-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
