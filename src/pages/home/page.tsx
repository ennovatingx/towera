import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Hero from './components/Hero';
import Mission from './components/Mission';
import Heritage from './components/Heritage';
import ProductEcosystem from './components/ProductEcosystem';
import Stats from './components/Stats';
import Vision from './components/Vision';
import CTASection from './components/CTASection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Mission />
        <Heritage />
        <ProductEcosystem />
        <Stats />
        <Vision />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}