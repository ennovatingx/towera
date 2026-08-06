import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-foreground-950 via-primary-950 to-accent-950">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 md:px-6 text-center pt-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-8">
          <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
          <span className="text-xs md:text-sm font-medium text-white/80 tracking-wide">
            A data collection platform, not a model
          </span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6">
          Towera Studio
        </h1>

        <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          Translate phrases, record pronunciation, and validate submissions in your mother tongue. Every
          contribution is reviewed by native speakers before it becomes part of a licensed Nigerian language
          dataset.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/studio/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary-500 text-background-50 font-semibold text-sm hover:bg-primary-600 active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            Start contributing
          </Link>
          <Link
            to="/studio/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 text-white font-semibold text-sm hover:bg-white/20 active:scale-95 backdrop-blur-sm border border-white/15 transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
}
