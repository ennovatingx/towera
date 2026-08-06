import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-xs sm:max-w-md">
      <div className="flex items-center justify-between gap-3 sm:gap-6 pl-5 pr-2 py-2 rounded-full bg-background-50/70 backdrop-blur-xl border border-background-200/60 shadow-lg shadow-foreground-950/5">
        <Link
          to="/"
          className="font-heading text-lg font-semibold text-foreground-950 tracking-tight whitespace-nowrap"
        >
          Towera
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            to="/studio"
            className="text-sm font-medium text-foreground-700 hover:text-foreground-950 transition-colors duration-200 whitespace-nowrap"
          >
            Studio
          </Link>
          <Link
            to="/api"
            className="text-sm font-medium text-foreground-700 hover:text-foreground-950 transition-colors duration-200 whitespace-nowrap"
          >
            API
          </Link>
        </div>

        <Link
          to="/studio/login"
          className="px-4 py-1.5 rounded-full bg-foreground-950 text-background-50 text-sm font-medium hover:bg-foreground-800 active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
