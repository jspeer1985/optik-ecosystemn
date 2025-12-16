'use client';

import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { MEMECOIN_TIERS, type TierName } from '@/lib/memecoin-pricing';
import dynamic from 'next/dynamic';
import { CreditCard, Rocket, Shield, Globe, CheckCircle2 } from 'lucide-react';


function HomeContent() {
  const { connected, publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TierName>('STANDARD');
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    totalSupply: '1000000000',
    liquiditySOL: 1,
  });

  const [gptMessages, setGptMessages] = useState([
    {
      role: 'optik',
      content: 'I am OPTIK GPT. I will help you create a successful memecoin. What are you thinking of launching?',
      id: Date.now(),
    }
  ]);
  const [gptInput, setGptInput] = useState('');
  const [gptLoading, setGptLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_OPTIKCOIN_MINT || 'Coming Soon';
  const currentTier = MEMECOIN_TIERS[selectedTier];
  const platformFee = (currentTier.priceSOL * 2.5) / 100;
  const totalCost = currentTier.priceSOL + formData.liquiditySOL + platformFee;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gptMessages]);

  const sendToGPT = async () => {
    if (!gptInput.trim() || gptLoading) return;

    const userMsg = { role: 'user', content: gptInput, id: Date.now() };
    setGptMessages(prev => [...prev, userMsg]);
    setGptInput('');
    setGptLoading(true);

    try {
      const res = await fetch('/api/optik-gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: gptInput,
          conversationHistory: gptMessages,
          userWallet: publicKey?.toBase58() || 'demo',
          formData,
        }),
      });

      const data = await res.json();
      setGptMessages(prev => [...prev, {
        role: 'optik',
        content: data.response || 'Error. Try again.',
        id: Date.now() + 1,
      }]);
    } catch {
      setGptMessages(prev => [...prev, {
        role: 'optik',
        content: 'Connection error. Please try again.',
        id: Date.now() + 1,
      }]);
    } finally {
      setGptLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-sovereign-emerald/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Hero Section */}
      <div className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <h1 className="text-7xl md:text-8xl font-black mb-6 text-gradient-gold drop-shadow-2xl animate-in fade-in zoom-in duration-1000 tracking-tight">
              OPTIK ECOSYSTEM
            </h1>
            <p className="text-2xl text-sovereign-text-secondary mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              The <span className="font-semibold text-white">Institutional-Grade Launchpad</span> • AI-Powered • Vault-Secured
            </p>

            {/* Contract Address Banner */}
            <div className="inline-block bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-8 py-4 mb-10 transform hover:scale-105 transition-all cursor-pointer group hover:border-sovereign-gold/30">
              <div className="text-xs text-sovereign-gold mb-1 tracking-widest uppercase font-semibold">OPTIK Token Contract</div>
              <div className="font-mono text-sm text-gray-400 group-hover:text-white transition-colors break-all">{CONTRACT_ADDRESS}</div>
            </div>

            {/* Purchase CTA */}
            <div className="mb-4">
              <a href="/arcade" className="btn-sovereign inline-flex items-center gap-3 text-lg shadow-[0_0_30px_rgba(4,120,87,0.2)]">
                <CreditCard className="w-5 h-5" />
                ENTER VAULT & BUY
              </a>
            </div>
          </div>


          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-20">
            <div className="card-sovereign p-6 rounded-xl flex flex-col items-center">
              <div className="text-4xl font-bold text-sovereign-text-primary mb-1">2,847</div>
              <div className="text-xs text-sovereign-gold uppercase tracking-widest font-semibold flex items-center gap-1">
                <Rocket className="w-3 h-3" /> Tokens Launched
              </div>
            </div>
            <div className="card-sovereign p-6 rounded-xl flex flex-col items-center">
              <div className="text-4xl font-bold text-sovereign-emerald-bright mb-1">$2.5M</div>
              <div className="text-xs text-sovereign-text-secondary uppercase tracking-widest font-semibold">Total Volume</div>
            </div>
            <div className="card-sovereign p-6 rounded-xl flex flex-col items-center">
              <div className="text-4xl font-bold text-white mb-1">90 Days</div>
              <div className="text-xs text-sovereign-text-secondary uppercase tracking-widest font-semibold">Liquidity Lock</div>
            </div>
          </div>

          {/* Roadmap Section */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient-gold tracking-tighter">
              STRATEGIC ROADMAP
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
              {/* Phase 1 */}
              <div className="card-sovereign p-6 rounded-2xl relative overflow-hidden group hover:border-sovereign-emerald/50">
                <div className="absolute top-0 right-0 bg-sovereign-emerald/10 px-3 py-1 rounded-bl-xl text-sovereign-emerald-bright text-xs font-bold border-l border-b border-sovereign-emerald/20">Phase 1</div>
                <div className="w-10 h-10 bg-sovereign-emerald/20 rounded-lg flex items-center justify-center mb-4 text-sovereign-emerald-bright"><Rocket className="w-5 h-5" /></div>
                <h3 className="text-lg font-bold text-white mb-4">Launch</h3>
                <ul className="space-y-3 text-sm text-sovereign-text-secondary">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sovereign-emerald-bright" /> Platform Live</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sovereign-emerald-bright" /> Arcade Beta</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sovereign-emerald-bright" /> Token Audits</li>
                </ul>
              </div>

              {/* Phase 2 */}
              <div className="card-sovereign p-6 rounded-2xl relative overflow-hidden group hover:border-sovereign-gold/50">
                <div className="absolute top-0 right-0 bg-sovereign-gold/10 px-3 py-1 rounded-bl-xl text-sovereign-gold text-xs font-bold border-l border-b border-sovereign-gold/20">Phase 2</div>
                <div className="w-10 h-10 bg-sovereign-gold/20 rounded-lg flex items-center justify-center mb-4 text-sovereign-gold"><CreditCard className="w-5 h-5" /></div>
                <h3 className="text-lg font-bold text-white mb-4">Expansion</h3>
                <ul className="space-y-3 text-sm text-sovereign-text-secondary">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sovereign-gold" /> Stripe Payments</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sovereign-gold" /> DEX Integration</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-sovereign-gold rounded-full ml-1.5" /> Mobile App</li>
                </ul>
              </div>

              {/* Phase 3 */}
              <div className="card-sovereign p-6 rounded-2xl relative overflow-hidden group hover:border-white/30">
                <div className="absolute top-0 right-0 bg-white/10 px-3 py-1 rounded-bl-xl text-white text-xs font-bold border-l border-b border-white/20">Phase 3</div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-4 text-white"><Shield className="w-5 h-5" /></div>
                <h3 className="text-lg font-bold text-white mb-4">Governance</h3>
                <ul className="space-y-3 text-sm text-sovereign-text-secondary">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full ml-1.5" /> DAO Launch</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full ml-1.5" /> Staking V2</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full ml-1.5" /> Creator Tools</li>
                </ul>
              </div>

              {/* Phase 4 */}
              <div className="card-sovereign p-6 rounded-2xl relative overflow-hidden group hover:border-sovereign-emerald/30">
                <div className="absolute top-0 right-0 bg-sovereign-emerald/10 px-3 py-1 rounded-bl-xl text-sovereign-emerald-bright text-xs font-bold border-l border-b border-sovereign-emerald/20">Phase 4</div>
                <div className="w-10 h-10 bg-sovereign-emerald/20 rounded-lg flex items-center justify-center mb-4 text-sovereign-emerald-bright"><Globe className="w-5 h-5" /></div>
                <h3 className="text-lg font-bold text-white mb-4">Global</h3>
                <ul className="space-y-3 text-sm text-sovereign-text-secondary">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-sovereign-emerald-bright rounded-full ml-1.5" /> Cross-chain Bridge</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-sovereign-emerald-bright rounded-full ml-1.5" /> Global Events</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-sovereign-emerald-bright rounded-full ml-1.5" /> Metaverse</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-[1600px] mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Left: Token Creation */}
          <div className="w-[60%]">
            <div className="card-sovereign p-8">
              <h2 className="text-2xl font-bold mb-8 text-gradient-gold tracking-tight">Launch Your Token</h2>

              {!connected ? (
                <div className="text-center py-12 flex flex-col items-center justify-center bg-white/5 rounded-xl border border-white/5 border-dashed">
                  <div className="text-gray-400 mb-6 font-light">Connect your wallet to access the Vault</div>
                  <WalletMultiButton className="!bg-sovereign-emerald !h-12 !px-8" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Token Name</label>
                    <input
                      type="text"
                      className="w-full bg-black/20 border border-white/10 rounded px-4 py-3 text-white focus:border-sovereign-gold focus:bg-white/5 focus:outline-none transition-all placeholder-white/20"
                      placeholder="e.g., Moon Rocket"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
                    <input
                      type="text"
                      className="w-full bg-black/20 border border-white/10 rounded px-4 py-3 text-white focus:border-sovereign-gold focus:bg-white/5 focus:outline-none transition-all placeholder-white/20"
                      placeholder="e.g., MOON"
                      maxLength={10}
                      value={formData.symbol}
                      onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      className="w-full bg-black/20 border border-white/10 rounded px-4 py-3 text-white focus:border-sovereign-gold focus:bg-white/5 focus:outline-none transition-all placeholder-white/20"
                      rows={3}
                      placeholder="What makes your token special?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Supply</label>
                      <input
                        type="number"
                        className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        value={formData.totalSupply}
                        onChange={(e) => setFormData({ ...formData, totalSupply: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Liquidity (SOL)</label>
                      <input
                        type="number"
                        className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        value={formData.liquiditySOL}
                        onChange={(e) => setFormData({ ...formData, liquiditySOL: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mt-6">
                    <h3 className="font-semibold text-white mb-3">Cost Breakdown</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-300">
                        <span>Launch Fee:</span>
                        <span>{currentTier.priceSOL} SOL</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Liquidity (90-day lock):</span>
                        <span>{formData.liquiditySOL} SOL</span>
                      </div>
                      <div className="flex justify-between text-yellow-400">
                        <span>Platform Fee (2.5%):</span>
                        <span>{platformFee.toFixed(4)} SOL</span>
                      </div>
                      <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between text-white font-bold text-lg">
                        <span>Total:</span>
                        <span>{totalCost.toFixed(4)} SOL</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors"
                    disabled={!formData.name || !formData.symbol}
                  >
                    Launch Token
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: OPTIK GPT */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-lg flex flex-col" style={{ height: '700px' }}>
              <div className="border-b border-gray-700 p-4">
                <h3 className="font-bold text-lg text-white">OPTIK GPT</h3>
                <p className="text-xs text-gray-400">Your AI Launch Assistant</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {gptMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`rounded-lg p-3 ${msg.role === 'user'
                      ? 'bg-blue-900/30 border border-blue-700/50 ml-4'
                      : 'bg-gray-900 border border-gray-700 mr-4'
                      }`}
                  >
                    <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                ))}

                {gptLoading && (
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 mr-4">
                    <div className="flex gap-2">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-700 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Ask anything..."
                    value={gptInput}
                    onChange={(e) => setGptInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendToGPT()}
                    disabled={gptLoading}
                  />
                  <button
                    onClick={sendToGPT}
                    disabled={gptLoading || !gptInput.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(HomeContent), { ssr: false });
