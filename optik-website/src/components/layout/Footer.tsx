import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-rose-600 bg-clip-text text-transparent mb-4">
              OPTIK
            </div>
            <p className="text-sm text-gray-400">Professional memecoin launchpad</p>
          </div>

          <nav aria-label="Resources">
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/docs/OPTIK_Whitepaper.md" className="text-gray-600 hover:text-gray-900" aria-label="Read OPTIK Whitepaper">Whitepaper</a></li>
            </ul>
          </nav>

          <nav aria-label="Platform">
            <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Launch</Link></li>
              <li><Link href="/DEX" className="text-gray-600 hover:text-gray-900">DEX</Link></li>
              <li><Link href="/games" className="text-gray-600 hover:text-gray-900">Arcade</Link></li>
            </ul>
          </nav>

          <nav aria-label="Social media">
            <h3 className="font-semibold text-gray-900 mb-4">Social</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://twitter.com/OptikEcosystem" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900" aria-label="Follow us on Twitter (opens in new window)">Twitter</a></li>
              <li><a href="https://t.me/OptikOfficial" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900" aria-label="Join us on Telegram (opens in new window)">Telegram</a></li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2025 OPTIK Ecosystem. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
