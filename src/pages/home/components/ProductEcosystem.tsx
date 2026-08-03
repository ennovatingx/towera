import { useScrollReveal } from '@/hooks/useScrollReveal';

const products = [
  {
    id: 'atlas',
    name: 'Towera Atlas',
    tagline: 'Map every Nigerian language',
    description: 'An interactive map of every Nigerian language — speakers, dialects, states, writing systems, available datasets, and gaps waiting to be filled across all six geopolitical zones.',
    icon: 'ri-global-line',
    color: 'accent',
  },
  {
    id: 'voice',
    name: 'Towera Voice',
    tagline: 'Speech datasets',
    description: 'Thousands of hours of Yoruba, Igbo, Hausa, Tiv, Kanuri, Fulfulde, Ijaw, Edo, Ibibio, Nupe, and more — recorded by native speakers in homes, markets, and communities across Nigeria.',
    icon: 'ri-mic-line',
    color: 'primary',
  },
  {
    id: 'corpus',
    name: 'Towera Corpus',
    tagline: 'Text datasets',
    description: 'Large-scale text collections spanning Nigerian novels, proverbs, conversations, Nollywood scripts, news articles, government documents, and oral histories across dozens of languages.',
    icon: 'ri-file-text-line',
    color: 'secondary',
  },
  {
    id: 'translate',
    name: 'Towera Translate',
    tagline: 'Parallel datasets',
    description: 'Sentence-aligned parallel corpora — English↔Yoruba, English↔Igbo, English↔Hausa, Yoruba↔Igbo, Hausa↔Kanuri — built for training world-class Nigerian machine translation systems.',
    icon: 'ri-swap-line',
    color: 'accent',
  },
  {
    id: 'studio',
    name: 'Towera Studio',
    tagline: 'Contributor platform',
    description: 'A web platform where Nigerians contribute — record audio in their mother tongue, translate sentences, validate recordings, upload folk stories, and annotate data. Think GitHub meets Duolingo for Nigerian language data.',
    icon: 'ri-group-line',
    color: 'primary',
  },
  {
    id: 'api',
    name: 'Towera API',
    tagline: 'Dataset access',
    description: 'Companies building Nigerian AI can purchase licensed access to speech, translation, OCR, handwriting, and pronunciation datasets through a simple, well-documented REST API.',
    icon: 'ri-code-s-slash-line',
    color: 'secondary',
  },
];

function getColorClasses(color: string) {
  switch (color) {
    case 'accent':
      return {
        iconBg: 'bg-accent-100',
        iconText: 'text-accent-600',
        badge: 'bg-accent-100 text-accent-700',
        border: 'hover:border-accent-200',
        hoverIconBg: 'group-hover:bg-accent-200',
      };
    case 'secondary':
      return {
        iconBg: 'bg-secondary-100',
        iconText: 'text-secondary-700',
        badge: 'bg-secondary-100 text-secondary-700',
        border: 'hover:border-secondary-200',
        hoverIconBg: 'group-hover:bg-secondary-200',
      };
    default:
      return {
        iconBg: 'bg-primary-100',
        iconText: 'text-primary-600',
        badge: 'bg-primary-100 text-primary-700',
        border: 'hover:border-primary-200',
        hoverIconBg: 'group-hover:bg-primary-200',
      };
  }
}

export default function ProductEcosystem() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 md:py-28 px-4 md:px-6 bg-background-100">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-14 md:mb-18 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent-600 mb-4">
            Product Ecosystem
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground-950 mb-4">
            Six products. One mission.
          </h2>
          <p className="text-foreground-600 text-base max-w-2xl mx-auto">
            From mapping languages to delivering datasets via API, Towera covers the entire Nigerian language data pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product, i) => {
            const colors = getColorClasses(product.color);
            return (
              <a
                key={product.id}
                href={`/products#${product.id}`}
                className={`group bg-background-50 rounded-xl p-6 border border-background-200/80 ${colors.border} transition-all duration-400 hover:-translate-y-1.5 hover:bg-background-50/90 cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div
                  className={`w-11 h-11 rounded-lg ${colors.iconBg} ${colors.hoverIconBg} flex items-center justify-center mb-4 transition-colors duration-300`}
                >
                  <i className={`${product.icon} text-lg ${colors.iconText} transition-transform duration-300 group-hover:scale-110`}></i>
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-1 group-hover:text-primary-600 transition-colors duration-200">
                  {product.name}
                </h3>
                <span
                  className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${colors.badge} mb-3 transition-colors duration-300`}
                >
                  {product.tagline}
                </span>
                <p className="text-sm text-foreground-600 leading-relaxed">
                  {product.description}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}