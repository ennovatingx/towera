import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import RolesShowcase from './components/RolesShowcase';
import ImpactStats from './components/ImpactStats';
import JoinCta from './components/JoinCta';

export default function StudioLanding() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        {/* <RolesShowcase /> */}
        <ImpactStats />
        <JoinCta />
      </main>
      <Footer />
    </>
  );
}
