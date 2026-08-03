import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const products = [
  { name: 'Atlas', desc: 'Language map', href: '/products#atlas' },
  { name: 'Voice', desc: 'Speech datasets', href: '/products#voice' },
  { name: 'Corpus', desc: 'Text datasets', href: '/products#corpus' },
  { name: 'Translate', desc: 'Parallel datasets', href: '/products#translate' },
  { name: 'Studio', desc: 'Contributor platform', href: '/products#studio' },
  { name: 'API', desc: 'Dataset access', href: '/products#api' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background-50/95 backdrop-blur-md border-b border-background-200/70'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link
            to="/"
            className={`font-heading text-2xl font-semibold tracking-tight whitespace-nowrap transition-colors ${
              scrolled ? 'text-foreground-950' : 'text-white'
            }`}
          >
            Towera
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-95 ${
                  scrolled
                    ? 'text-foreground-700 hover:text-foreground-950 hover:bg-background-200'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                Products
                <i className={`ri-arrow-down-s-line text-base transition-transform duration-250 ${productsOpen ? 'rotate-180' : ''}`}></i>
              </button>
              {productsOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-background-50 rounded-xl border border-background-200 shadow-lg py-2 z-50">
                  {products.map((p) => (
                    <a
                      key={p.name}
                      href={p.href}
                      className="flex flex-col px-4 py-2.5 hover:bg-background-100 transition-colors cursor-pointer"
                    >
                      <span className="text-sm font-semibold text-foreground-900">{p.name}</span>
                      <span className="text-xs text-foreground-500">{p.desc}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a
              href="/about"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-95 ${
                scrolled
                  ? 'text-foreground-700 hover:text-foreground-950 hover:bg-background-200'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              About
            </a>
            <a
              href="/datasets"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-95 ${
                scrolled
                  ? 'text-foreground-700 hover:text-foreground-950 hover:bg-background-200'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Datasets
            </a>
            <a
              href="/studio"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-95 ${
                scrolled
                  ? 'text-foreground-700 hover:text-foreground-950 hover:bg-background-200'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Studio
            </a>
            <a
              href="/api"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-95 ${
                scrolled
                  ? 'text-foreground-700 hover:text-foreground-950 hover:bg-background-200'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              API
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="/contact"
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
                scrolled
                  ? 'bg-primary-500 text-background-50 hover:bg-primary-600'
                  : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm'
              }`}
            >
              Partner with us
            </a>
          </div>

          <button
            className={`md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              scrolled
                ? 'text-foreground-900 hover:bg-background-200'
                : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <i className={`text-xl ${mobileOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background-50 border-t border-background-200 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <div className="text-xs font-semibold text-foreground-400 uppercase tracking-wider px-3 py-1">Products</div>
            {products.map((p) => (
              <a
                key={p.name}
                href={p.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-background-100 transition-colors cursor-pointer"
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-sm font-medium text-foreground-900">{p.name}</span>
                <span className="text-xs text-foreground-500">{p.desc}</span>
              </a>
            ))}
            <div className="border-t border-background-200 my-2"></div>
            <a href="/about" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground-900 hover:bg-background-100 cursor-pointer" onClick={() => setMobileOpen(false)}>About</a>
            <a href="/datasets" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground-900 hover:bg-background-100 cursor-pointer" onClick={() => setMobileOpen(false)}>Datasets</a>
            <a href="/studio" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground-900 hover:bg-background-100 cursor-pointer" onClick={() => setMobileOpen(false)}>Studio</a>
            <a href="/api" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground-900 hover:bg-background-100 cursor-pointer" onClick={() => setMobileOpen(false)}>API</a>
            <a href="/contact" className="block px-3 py-2.5 mt-2 rounded-full text-center text-sm font-semibold bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors cursor-pointer" onClick={() => setMobileOpen(false)}>Partner with us</a>
          </div>
        </div>
      )}
    </nav>
  );
}