import { Link, NavLink } from 'react-router-dom';
import { getDisplayName, type User } from '@/types/studio';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}

const NAV_BY_ROLE: Record<User['role'], NavItem[]> = {
  admin: [
    { to: '/studio/admin', label: 'Overview', icon: 'ri-dashboard-line', end: true },
    { to: '/studio/admin/languages', label: 'Languages', icon: 'ri-translate-2' },
    { to: '/studio/admin/phrases', label: 'Phrases', icon: 'ri-chat-quote-line' },
    { to: '/studio/admin/translations', label: 'Translations', icon: 'ri-file-list-3-line' },
    { to: '/studio/review', label: 'Review Queue', icon: 'ri-shield-check-line', end: true },
    { to: '/studio/admin/users', label: 'Users', icon: 'ri-team-line' },
    { to: '/studio/admin/export', label: 'Export', icon: 'ri-download-2-line' },
    { to: '/studio/admin/payouts', label: 'Payouts', icon: 'ri-wallet-3-line' },
  ],
  contributor: [
    { to: '/studio/contribute', label: 'Phrases', icon: 'ri-chat-quote-line', end: true },
    { to: '/studio/contribute/my-submissions', label: 'My Submissions', icon: 'ri-file-list-3-line' },
    { to: '/studio/contribute/earnings', label: 'Earnings', icon: 'ri-wallet-3-line' },
  ],
  reviewer: [{ to: '/studio/review', label: 'Review Queue', icon: 'ri-shield-check-line', end: true }],
};

interface StudioSidebarProps {
  user: User;
  onLogout: () => Promise<void>;
}

export default function StudioSidebar({ user, onLogout }: StudioSidebarProps) {
  const navItems = NAV_BY_ROLE[user.role];

  // No explicit navigate here: StudioAppLayout already redirects to
  // /studio/login once the session clears in context state.
  const handleLogout = onLogout;

  return (
    <aside className="flex flex-col md:w-64 md:shrink-0 bg-background-50 border-b md:border-b-0 md:border-r border-background-200 p-4 md:p-5">
      <div className="flex items-center justify-between mb-3 md:mb-8">
        <Link to="/studio" className="font-heading text-lg md:text-xl text-foreground-900">
          Towera Studio
        </Link>
        <div className="md:hidden flex items-center gap-1">
          <Link
            to="/studio/account/password"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background-200 transition-colors duration-200 cursor-pointer"
            aria-label="Change password"
          >
            <i className="ri-key-2-line text-foreground-600" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background-200 transition-colors duration-200 cursor-pointer"
            aria-label="Log out"
          >
            <i className="ri-logout-box-line text-foreground-600" />
          </button>
        </div>
      </div>

      <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0 flex-1 -mx-1 px-1 md:mx-0 md:px-0">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                isActive ? 'bg-primary-100 text-primary-800' : 'text-foreground-600 hover:bg-background-200'
              }`
            }
          >
            <i className={`${item.icon} text-base`} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="hidden md:block pt-4 mt-4 border-t border-background-200">
        <div className="flex items-center gap-2.5 px-1 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-xs font-semibold text-primary-800 shrink-0">
            {getDisplayName(user).slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground-900 truncate">{getDisplayName(user)}</p>
            <p className="text-xs text-foreground-500 capitalize">{user.role}</p>
          </div>
        </div>
        <Link
          to="/studio/account/password"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-foreground-600 hover:bg-background-200 transition-colors duration-200 cursor-pointer"
        >
          <i className="ri-key-2-line" />
          Change password
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-foreground-600 hover:bg-background-200 transition-colors duration-200 cursor-pointer"
        >
          <i className="ri-logout-box-line" />
          Log out
        </button>
      </div>
    </aside>
  );
}
