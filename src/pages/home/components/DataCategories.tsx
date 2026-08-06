import { useScrollReveal } from '@/hooks/useScrollReveal';

const categories = [
  {
    id: 'speech',
    name: 'Speech data',
    description: 'Recordings, transcriptions, pronunciation, accents, dialects, and speaker metadata across Nigeria\'s languages.',
    icon: 'ri-mic-line',
    color: 'primary',
    image: 'https://readdy.ai/api/search-image?query=Nigerian%20person%20speaking%20into%20a%20microphone%20in%20a%20recording%20studio%2C%20warm%20golden%20lighting%2C%20documentary%20photography%20style%2C%20audio%20waveform%20on%20screen%2C%20African%20voice%20recording%20session&width=800&height=600&seq=towera-data-speech&orientation=landscape',
  },
  {
    id: 'vision',
    name: 'Vision data',
    description: 'Images and video of African environments, products, documents, signs, agriculture, and transportation.',
    icon: 'ri-camera-line',
    color: 'accent',
    image: 'https://readdy.ai/api/search-image?query=busy%20Nigerian%20street%20market%20scene%20with%20vendors%2C%20buildings%20and%20vehicles%2C%20vibrant%20African%20urban%20environment%2C%20documentary%20photography%2C%20natural%20daylight&width=800&height=600&seq=towera-data-vision&orientation=landscape',
  },
  {
    id: 'document',
    name: 'Document data',
    description: 'Nigerian and African forms, receipts, handwritten documents, government records, and OCR-ready datasets where legally usable.',
    icon: 'ri-file-text-line',
    color: 'secondary',
    image: 'https://readdy.ai/api/search-image?query=stack%20of%20African%20government%20forms%2C%20receipts%20and%20handwritten%20documents%20on%20a%20wooden%20desk%2C%20close%20up%20paperwork%20photography%2C%20warm%20natural%20light&width=800&height=600&seq=towera-data-document&orientation=landscape',
  },
  {
    id: 'cultural',
    name: 'Cultural/context data',
    description: 'Local customs, terminology, names, places, foods, occupations, and culturally specific concepts.',
    icon: 'ri-hand-heart-line',
    color: 'primary',
    image: 'https://readdy.ai/api/search-image?query=Nigerian%20cultural%20festival%20with%20people%20in%20traditional%20colorful%20attire%2C%20community%20celebration%2C%20vibrant%20documentary%20photography%2C%20African%20heritage&width=800&height=600&seq=towera-data-cultural&orientation=landscape',
  },
  {
    id: 'geospatial',
    name: 'Geospatial data',
    description: 'Places, roads, buildings, businesses, landmarks, and local geographic names.',
    icon: 'ri-map-pin-line',
    color: 'accent',
    image: 'https://readdy.ai/api/search-image?query=aerial%20drone%20view%20of%20Nigerian%20city%20streets%2C%20roads%20and%20buildings%2C%20African%20urban%20landscape%20from%20above%2C%20documentary%20photography&width=800&height=600&seq=towera-data-geospatial&orientation=landscape',
  },
  {
    id: 'agricultural',
    name: 'Agricultural data',
    description: 'Crops, diseases, soil conditions, farming practices, weather observations, and field imagery.',
    icon: 'ri-plant-line',
    color: 'secondary',
    image: 'https://readdy.ai/api/search-image?query=Nigerian%20farmer%20working%20in%20a%20crop%20field%2C%20African%20agriculture%2C%20warm%20golden%20hour%20light%2C%20documentary%20photography%2C%20green%20farmland&width=800&height=600&seq=towera-data-agricultural&orientation=landscape',
  },
  {
    id: 'healthcare',
    name: 'Healthcare data',
    description: 'Anonymized clinical and medical information, medical terminology, and healthcare workflows — collected under strong privacy and ethical safeguards.',
    icon: 'ri-heart-pulse-line',
    color: 'primary',
    image: 'https://readdy.ai/api/search-image?query=African%20healthcare%20worker%20in%20a%20clinic%20reviewing%20medical%20records%2C%20Nigerian%20hospital%20setting%2C%20soft%20natural%20light%2C%20documentary%20photography&width=800&height=600&seq=towera-data-healthcare&orientation=landscape',
  },
  {
    id: 'education',
    name: 'Education data',
    description: 'Curriculum, licensed textbooks, examination-style questions, explanations, and educational content.',
    icon: 'ri-book-open-line',
    color: 'accent',
    image: 'https://readdy.ai/api/search-image?query=Nigerian%20classroom%20with%20students%20studying%20textbooks%2C%20African%20school%20setting%2C%20warm%20natural%20light%2C%20documentary%20photography&width=800&height=600&seq=towera-data-education&orientation=landscape',
  },
  {
    id: 'business',
    name: 'Business/economic data',
    description: 'Local business information, product catalogs, prices, legally obtained transactions, and market terminology.',
    icon: 'ri-store-2-line',
    color: 'secondary',
    image: 'https://readdy.ai/api/search-image?query=Nigerian%20market%20vendor%20arranging%20product%20displays%20at%20a%20stall%2C%20African%20marketplace%20commerce%2C%20documentary%20photography%2C%20vibrant%20colors&width=800&height=600&seq=towera-data-business&orientation=landscape',
  },
  {
    id: 'evaluation',
    name: 'AI evaluation data',
    description: 'Human-created tests that measure whether AI actually understands African languages, culture, geography, and context.',
    icon: 'ri-checkbox-circle-line',
    color: 'primary',
    image: 'https://readdy.ai/api/search-image?query=diverse%20group%20of%20Nigerian%20people%20collaborating%20around%20laptops%20reviewing%20content%2C%20African%20tech%20team%20evaluating%20software%2C%20documentary%20photography%2C%20modern%20office&width=800&height=600&seq=towera-data-evaluation&orientation=landscape',
  },
];

function getColorClasses(color: string) {
  switch (color) {
    case 'accent':
      return { iconBg: 'bg-accent-100', iconText: 'text-accent-700' };
    case 'secondary':
      return { iconBg: 'bg-secondary-100', iconText: 'text-secondary-700' };
    default:
      return { iconBg: 'bg-primary-100', iconText: 'text-primary-700' };
  }
}

export default function DataCategories() {
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
            Data We Collect
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground-950 mb-4">
            Ten data categories. One mission.
          </h2>
          <p className="text-foreground-600 text-base max-w-2xl mx-auto">
            From spoken language to satellite-mapped geography, Towera structures the raw material every trustworthy African AI system needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category, i) => {
            const colors = getColorClasses(category.color);
            return (
              <div
                key={category.id}
                className={`group bg-background-50 rounded-2xl overflow-hidden border border-background-200/80 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-lg ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent" />
                  <div
                    className={`absolute top-3 left-3 w-9 h-9 rounded-lg ${colors.iconBg} backdrop-blur-sm flex items-center justify-center`}
                  >
                    <i className={`${category.icon} text-base ${colors.iconText}`}></i>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-foreground-600 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
