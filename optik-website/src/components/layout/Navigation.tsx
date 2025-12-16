'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Zap, Home, TrendingUp, Gamepad2, Search, Bell, Settings, ChevronDown } from 'lucide-react';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Overview', icon: Home },
    { href: '/DEX', label: 'Markets', icon: TrendingUp },
    { href: '/arcade', label: 'Arcade', icon: Gamepad2 },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[64px] bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] flex items-center px-6 shadow-sm" role="navigation" aria-label="Main navigation">
      {/* Skip Navigation Link for Accessibility */}
      <a href="#main-content" className="skip-nav">Skip to main content</a>
      
      <div className="flex-1 flex items-center gap-8">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-3" aria-label="OPTIK Terminal Home">
          <div className="relative w-8 h-8 flex items-center justify-center bg-blue-600 rounded" aria-hidden="true">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">OPTIK <span className="text-slate-500 font-normal">TERMINAL</span></span>
        </Link>

        {/* Global Search */}
        <div className="hidden md:flex items-center relative max-w-md w-full">
          <label htmlFor="global-search" className="sr-only">Search assets, markets, or commands</label>
          <Search className="absolute left-3 w-4 h-4 text-slate-500" aria-hidden="true" />
          <input
            id="global-search"
            type="search"
            placeholder="Search assets, markets, or commands..."
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-sm h-[36px] pl-9 pr-3 text-sm text-slate-200 placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors font-mono"
            aria-label="Search assets, markets, or commands"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 mr-4" aria-label="Primary navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${isActive
                    ? 'text-blue-500 bg-[rgba(37,99,235,0.1)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[var(--bg-elevated)]'
                  }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Notifications */}
        <button 
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative"
          aria-label="View notifications"
          type="button"
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border border-[var(--bg-secondary)]" aria-label="Unread notifications"></span>
        </button>

        {/* Wallet / Profile */}
        <div className="h-[36px] flex items-center">
          <WalletMultiButton className="!bg-[var(--blue-600)] hover:!bg-[var(--blue-500)] !h-[36px] !rounded-[4px] !text-sm !font-medium" />
        </div>
      </div>
    </nav>
  );
}
