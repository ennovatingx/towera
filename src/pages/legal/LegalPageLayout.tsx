import type { ReactNode } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import type { MarkdownSection } from '@/lib/markdownLite';
import { LEGAL_PROSE_CLASSES } from './legalProseClasses';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  intro: ReactNode[];
  sections: MarkdownSection[];
}

export default function LegalPageLayout({ title, lastUpdated, intro, sections }: LegalPageLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-50 pt-28 sm:pt-32 pb-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-6 md:gap-16 items-start pb-10 md:pb-14 border-b border-background-200">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-foreground-950 leading-[0.95] tracking-tight">
              {title}
            </h1>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground-400 mb-4">
                Last updated {lastUpdated}
              </p>
              <div className="text-foreground-600 text-base md:text-lg leading-relaxed [&_p]:mb-4 [&_a]:text-primary-600 [&_a]:underline [&_a]:underline-offset-2">
                {intro}
              </div>
              <div className="mt-6 pt-5 border-t border-background-200">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent-600 mb-2">Draft notice</p>
                <p className="text-sm text-foreground-500 leading-relaxed">
                  Prepared as a working template based on the Nigeria Data Protection Act 2023 and the Nigeria
                  Copyright Act 2022 — not a substitute for advice from a licensed Nigerian lawyer. Have it reviewed
                  before relying on it as binding, final policy.
                </p>
              </div>
            </div>
          </div>

          <div>
            {sections.map((section, i) => (
              <details key={i} className="group border-b border-background-200 py-5 md:py-6">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-heading text-lg md:text-xl font-semibold text-foreground-950">
                    {section.title}
                  </span>
                  <span className="shrink-0 w-6 h-6 flex items-center justify-center text-foreground-400 transition-transform duration-200 group-open:rotate-45">
                    <i className="ri-add-line text-xl" />
                  </span>
                </summary>
                <div className={`pt-4 ${LEGAL_PROSE_CLASSES}`}>{section.body}</div>
              </details>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
