import { useScrollReveal } from '@/hooks/useScrollReveal';

const roles = [
  {
    icon: 'ri-quill-pen-line',
    name: 'Contributor',
    color: 'primary',
    description: 'Submit text translations for source phrases and optionally record or upload pronunciation audio.',
  },
  {
    icon: 'ri-shield-check-line',
    name: 'Reviewer',
    color: 'accent',
    description: 'Check submitted translations and audio for accuracy, approving or rejecting with feedback.',
  },
  {
    icon: 'ri-settings-4-line',
    name: 'Admin',
    color: 'secondary',
    description: 'Manage languages and dialects, author phrases, approve submissions, and export approved datasets.',
  },
];

function getColorClasses(color: string) {
  switch (color) {
    case 'accent':
      return { bg: 'bg-accent-100', text: 'text-accent-600' };
    case 'secondary':
      return { bg: 'bg-secondary-100', text: 'text-secondary-600' };
    default:
      return { bg: 'bg-primary-100', text: 'text-primary-600' };
  }
}

export default function RolesShowcase() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-20 md:py-28 px-4 md:px-6 bg-background-100">
      <div
        className={`max-w-5xl mx-auto transition-all duration-800 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent-600 mb-4">
            Roles
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground-950">
            Built for a collaborative pipeline
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const classes = getColorClasses(role.color);
            return (
              <div key={role.name} className="bg-background-50 border border-background-200 rounded-2xl p-6">
                <div className={`w-12 h-12 rounded-full ${classes.bg} flex items-center justify-center mb-4`}>
                  <i className={`${role.icon} text-xl ${classes.text}`} />
                </div>
                <h3 className="font-heading text-lg text-foreground-900 mb-2">{role.name}</h3>
                <p className="text-sm text-foreground-600 leading-relaxed">{role.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
