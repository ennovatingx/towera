import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Link } from 'react-router-dom';

export default function CTASection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.3 });

  return (
    <section ref={ref} className="py-20 md:py-28 px-4 md:px-6 bg-background-100">
      <div
        className={`max-w-3xl mx-auto text-center transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground-950 mb-4">
          Ready to build with Nigerian language data?
        </h2>
        <p className="text-foreground-600 text-base md:text-lg leading-relaxed mb-8">
          Whether you're training the next LLM, building speech recognition for Nigerian Pidgin, or preserving an endangered tongue — Towera has the datasets you need.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/chat"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary-500 text-background-50 font-semibold text-sm hover:bg-primary-600 active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer inline-block text-center"
          >
            Converse with Towera
          </Link>
          <a
            href="/products"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-background-50 text-foreground-900 font-semibold text-sm border border-background-300 hover:border-foreground-300 active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            Explore products
          </a>
        </div>
      </div>
    </section>
  );
}