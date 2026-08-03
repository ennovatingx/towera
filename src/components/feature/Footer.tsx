import { Link } from 'react-router-dom';

const footerLinks = {
  Products: [
    { label: 'Towera Atlas', href: '/products#atlas' },
    { label: 'Towera Voice', href: '/products#voice' },
    { label: 'Towera Corpus', href: '/products#corpus' },
    { label: 'Towera Translate', href: '/products#translate' },
    { label: 'Towera Studio', href: '/products#studio' },
    { label: 'Towera API', href: '/products#api' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Mission', href: '/about#mission' },
    { label: 'Careers', href: '/about#careers' },
    { label: 'Blog', href: '/about#blog' },
  ],
  Resources: [
    { label: 'Datasets', href: '/datasets' },
    { label: 'Documentation', href: '/api#docs' },
    { label: 'API Reference', href: '/api#reference' },
    { label: 'Pricing', href: '/api#pricing' },
  ],
};

const languages = ['Yoruba', 'Igbo', 'Hausa', 'Fulfulde', 'Tiv', 'Kanuri', 'Ijaw', 'Edo', 'Ibibio', 'Nupe', 'Urhobo', 'Igala', 'Idoma', 'Ebira', 'Efik', 'Esan', 'Gbagyi', 'Angas'];

export default function Footer() {
  return (
    <footer className="bg-background-900 pt-16 md:pt-20 pb-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <Link to="/" className="font-heading text-2xl font-semibold text-white tracking-tight">
              Towera
            </Link>
            <p className="text-foreground-400 text-sm mt-3 max-w-xs leading-relaxed">
              Collecting, verifying, and licensing high-quality Nigerian language datasets for the next generation of AI.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-400 mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-foreground-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-foreground-800 pt-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <span
                key={lang}
                className="px-3 py-1 rounded-full bg-foreground-800 text-foreground-400 text-xs font-medium"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-foreground-800">
          <p className="text-xs text-foreground-500">
            &copy; {new Date().getFullYear()} Towera. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-foreground-400 hover:text-white transition-colors text-sm cursor-pointer">Privacy</a>
            <a href="#" className="text-foreground-400 hover:text-white transition-colors text-sm cursor-pointer">Terms</a>
            <a href="#" className="text-foreground-400 hover:text-white transition-colors cursor-pointer">
              <i className="ri-twitter-x-line text-base"></i>
            </a>
            <a href="#" className="text-foreground-400 hover:text-white transition-colors cursor-pointer">
              <i className="ri-linkedin-line text-base"></i>
            </a>
            <a href="#" className="text-foreground-400 hover:text-white transition-colors cursor-pointer">
              <i className="ri-github-line text-base"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}