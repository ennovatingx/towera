import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon?: string;
}

export default function ComingSoonPage({ title, description, icon = 'ri-tools-line' }: ComingSoonPageProps) {
  useDocumentMeta(`${title} — Towera`, description);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20 bg-background-50">
        <div className="text-center max-w-lg">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
            <i className={`${icon} text-2xl text-primary-600`} />
          </div>
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent-600 mb-4">
            Coming soon
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground-950 mb-4">{title}</h1>
          <p className="text-foreground-600 text-base leading-relaxed mb-8">{description}</p>
          <Link
            to="/"
            className="inline-block px-8 py-3.5 rounded-full bg-primary-500 text-background-50 font-semibold text-sm hover:bg-primary-600 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
