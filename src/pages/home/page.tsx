import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Hero from './components/Hero';
import Mission from './components/Mission';
import Heritage from './components/Heritage';
import DataCategories from './components/DataCategories';
import Stats from './components/Stats';
import Vision from './components/Vision';
import CTASection from './components/CTASection';

export default function Home() {
  useDocumentMeta(
    'Towera — Nigerian Language Data Infrastructure for AI',
    'Towera collects, verifies, structures, and licenses high-quality Nigerian language datasets for AI companies, universities, and startups. Speech, text, translation, and annotation data across 500+ Nigerian languages including Yoruba, Igbo, and Hausa.'
  );

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* <Mission />
        <Heritage /> */}
        {/* <DataCategories /> */}
        {/* <Stats /> */}
        {/* <Vision /> */}
        {/* <CTASection /> */}
        
      </main>
      {/* <Footer /> */}
    </>
  );
}