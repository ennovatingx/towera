import { Link } from 'react-router-dom';

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-100 px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/studio" className="flex items-center justify-center gap-2 mb-8 font-heading text-xl text-foreground-900">
          Towera Studio
        </Link>
        <div className="bg-background-50 border border-background-200 rounded-2xl shadow-sm p-8">
          <h1 className="font-heading text-2xl text-foreground-900 mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-foreground-500 mb-6">{subtitle}</p>}
          {children}
        </div>
        {footer && <div className="mt-6 text-center text-sm text-foreground-500">{footer}</div>}
      </div>
    </div>
  );
}
