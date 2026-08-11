import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import RolesShowcase from './components/RolesShowcase';
import ImpactStats from './components/ImpactStats';
import JoinCta from './components/JoinCta';

export default function StudioLanding() {
  useDocumentMeta(
    'Towera Studio — Contribute Nigerian Language Data',
    'Translate phrases, record pronunciation, and validate submissions in your mother tongue. Join Towera Studio and help build licensed, native-speaker-verified Nigerian language datasets.'
  );

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* <HowItWorks />
        <RolesShowcase />
        <ImpactStats />
        <JoinCta /> */}
      </main>
      {/* <Footer /> */}
    </>
  );
}
