import { Link } from 'react-router-dom';

export default function JoinCta() {
  return (
    <section className="py-20 md:py-28 px-4 md:px-6 bg-gradient-to-br from-primary-600 to-accent-600">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-semibold text-white mb-4">
          Your language belongs in the dataset
        </h2>
        <p className="text-white/80 text-base md:text-lg mb-8 leading-relaxed">
          Join Towera Studio and help build a trusted, native-speaker-verified record of Nigeria's languages.
        </p>
        <Link
          to="/studio/register"
          className="inline-block px-8 py-3.5 rounded-full bg-white text-primary-700 font-semibold text-sm hover:bg-white/90 active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer"
        >
          Create your account
        </Link>
      </div>
    </section>
  );
}
