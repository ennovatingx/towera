import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Data Licenses', to: '/licenses' },
];

function LegalDropdown() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-0.5 text-sm font-medium text-foreground-700 hover:text-foreground-950 transition-colors duration-200 whitespace-nowrap cursor-pointer"
      >
        Legal
        <i
          className={`ri-arrow-down-s-line text-base transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 mt-3 w-44 rounded-2xl border border-background-200/60 bg-background-50/95 backdrop-blur-xl shadow-lg shadow-foreground-950/10 py-1.5 overflow-hidden"
        >
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-foreground-700 hover:bg-background-100 hover:text-foreground-950 transition-colors duration-150 whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[300] w-[calc(100%-1.5rem)] max-w-xs sm:max-w-md">
      <div className="flex items-center justify-between gap-3 sm:gap-6 pl-5 pr-2 py-2 rounded-full bg-background-50/70 backdrop-blur-xl border border-background-200/60 shadow-lg shadow-foreground-950/5">
        <Link to="/" className="flex items-center gap-2 whitespace-nowrap">
          {/* <img src="/towera_icon.svg" alt="" className="h-7 w-auto" /> */}
          <span className="font-heading text-xl font-bold uppercase tracking-wide text-foreground-950 inline-flex items-center">
            <span>Tow</span>
            <span
              aria-hidden="true"
              className="inline-flex flex-col justify-center gap-[3px] w-[0.55em] h-[0.66em] mx-[2px] translate-y-[1px]"
            >
              <span className="block h-[3px] -mt-1 w-full rounded-full bg-current"></span>
              <span className="block h-[3px] w-full rounded-full bg-current"></span>
              <span className="block h-[3px] w-full rounded-full bg-current"></span>
            </span>
            <span className="sr-only">e</span>
            <span>r</span>
            <span className="text-primary-600">a</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <LegalDropdown />

          <Link
            to="/studio"
            className="px-4 py-1.5 rounded-full bg-foreground-950 text-background-50 text-sm font-medium hover:bg-foreground-800 active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            Studio
          </Link>
        </div>
      </div>
    </nav>
  );
}
