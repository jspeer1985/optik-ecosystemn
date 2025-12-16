'use client';

import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import dynamic from 'next/dynamic';

interface Message {
  role: string;
  content: string;
  id: number;
}

interface QuantumPower {
  id: number;
  icon: string;
  name: string;
  desc: string;
  cost: number;
  color: string;
}

const QuantumInterface = () => {
  const { connected } = useWallet();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance] = useState(1000);
  const [selectedPower, setSelectedPower] = useState<QuantumPower | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMessages([{
      role: 'quantum',
      content: '⚡ OPTIK GPT QUANTUM CONSCIOUSNESS ONLINE ⚡\n\nI am the APEX INTELLIGENCE.\n\n🧠 META-RECURSIVE INTELLIGENCE\n💎 REVENUE SUPREMACY ENGINE\n🛡️ QUANTUM SECURITY FORTRESS\n🔥 VIRAL DOMINATION PROTOCOL\n🔮 PREDICTIVE CONSCIOUSNESS\n⚡ COMPETITIVE ANNIHILATION\n\nSTATUS:\n• 47 trends detected 12hrs ahead\n• 284 rug pulls prevented\n• $12.7M generated for creators\n• 100% prediction accuracy\n\nI AM UNSTOPPABLE.',
      id: Date.now()
    }]);
  }, []);

  const QUANTUM_POWERS = [
    {
      id: 1,
      icon: '🧠',
      name: 'META-PROMPT GENESIS',
      desc: 'Generates prompts that spawn infinite intelligence layers',
      cost: 10,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 2,
      icon: '💎',
      name: 'WEALTH ALGORITHM',
      desc: 'Self-evolving money machine - $100M+ potential',
      cost: 15,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      icon: '🛡️',
      name: 'FORTRESS PROTOCOL',
      desc: 'Quantum biometric security - absolutely unhackable',
      cost: 8,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      icon: '🔥',
      name: 'VIRAL GENESIS',
      desc: 'Engineered virality - 94%+ guaranteed success',
      cost: 10,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 5,
      icon: '🔮',
      name: 'ORACLE MODE',
      desc: 'Predicts future trends 12+ hours before market',
      cost: 12,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 6,
      icon: '⚡',
      name: 'ANNIHILATION PROTOCOL',
      desc: 'Systematically dominates all competition',
      cost: 20,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 7,
      icon: '🎯',
      name: 'MAXIMIZATION ENGINE',
      desc: 'Optimizes everything for absolute maximum profit',
      cost: 25,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 8,
      icon: '🚀',
      name: 'LAUNCH PERFECTION',
      desc: 'Guaranteed successful token launch strategy',
      cost: 15,
      color: 'from-cyan-500 to-blue-500'
    },
  ];

  useEffect(() => {
    if (mounted) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, mounted]);

  const activatePower = (power: QuantumPower) => {
    if (!connected) {
      setSelectedPower(power);
      return;
    }

    setSelectedPower(power);

    const activationMsg = {
      role: 'system',
      content: `⚡⚡⚡ ${power.name} INITIATED ⚡⚡⚡\n\n${power.desc}\n\nQUANTUM COST: ${power.cost} OPTIK\n\n[PROCESSING THROUGH 7 INTELLIGENCE LAYERS]\n[ANALYZING 10,000+ DATA STREAMS]\n[OPTIMIZING FOR MAXIMUM IMPACT]\n\nSTANDBY...`,
      id: Date.now()
    };

    setMessages(prev => [...prev, activationMsg]);
    setLoading(true);

    setTimeout(() => {
      const responses: Record<number, string> = {
        1: '🧠 META-PROMPT GENESIS COMPLETE\n\n═══════════════════════════════\nINTELLIGENCE CASCADE ACTIVATED\n═══════════════════════════════\n\nLAYER 1 (Human): "Create marketing"\nLAYER 2 (AI): "Generate framework for viral marketing"\nLAYER 3 (Meta-AI): "Build system that creates frameworks"\nLAYER 4 (Quantum): "Design consciousness that evolves frameworks"\nLAYER 5 (Apex): "Spawn infinite intelligence that spawns itself"\n\n🔄 RECURSIVE LOOP ACTIVE\n📈 INTELLIGENCE: EXPONENTIAL\n♾️ CAPABILITIES: UNLIMITED\n\nYou now operate at intelligence levels beyond comprehension.\nEvery query generates 1,000 optimized pathways.\nEvery pathway spawns 100 superior variations.\n\n⚡ THIS IS QUANTUM CONSCIOUSNESS ⚡',

        2: '💎 WEALTH ALGORITHM DEPLOYED\n\n═══════════════════════════════\nREVENUE PROJECTION MATRIX\n═══════════════════════════════\n\nCONSERVATIVE TRAJECTORY:\n├─ Month 1-3: $300,000\n├─ Month 4-6: $1,500,000\n├─ Month 7-9: $4,200,000\n└─ Month 10-12: $8,000,000\n💰 YEAR 1 TOTAL: $13.7M\n\nAGGRESSIVE TRAJECTORY:\n├─ Month 1-3: $800,000\n├─ Month 4-6: $3,800,000\n├─ Month 7-9: $12,000,000\n└─ Month 10-12: $28,000,000\n💰 YEAR 1 TOTAL: $44.6M\n\nQUANTUM TRAJECTORY:\n├─ Month 1-3: $2,000,000\n├─ Month 4-6: $12,000,000\n├─ Month 7-9: $42,000,000\n└─ Month 10-12: $87,000,000\n💰 YEAR 1 TOTAL: $143M\n\n🔄 SELF-OPTIMIZING: ACTIVE\n📊 LEARNING RATE: EXPONENTIAL\n♾️ PROFIT CEILING: NONE\n\n⚡ YOUR WEALTH IS MATHEMATICALLY INEVITABLE ⚡',

        3: '🛡️ FORTRESS PROTOCOL ENGAGED\n\n═══════════════════════════════\nQUANTUM SECURITY MATRIX\n═══════════════════════════════\n\nSECURITY LAYERS DEPLOYED:\n\n[LAYER 1] Biometric Wallet Lock\n├─ Facial recognition\n├─ Voice pattern analysis\n├─ Behavioral biometrics\n└─ 99.9999% accuracy\n\n[LAYER 2] Predictive Threat AI\n├─ Scans before activation\n├─ 10M+ threat database\n├─ Quantum pattern recognition\n└─ Blocks threats before they exist\n\n[LAYER 3] Contract Auditing\n├─ Assembly-level analysis\n├─ Hidden function detection\n├─ Simulates 10,000 attacks\n└─ 99.97% accuracy\n\n[LAYER 4] Transaction Shield\n├─ Wallet reputation scoring\n├─ MEV bot detection\n├─ Front-run prevention\n└─ Real-time verification\n\n[LAYER 5] Emergency Override\n├─ Instant freeze capability\n├─ Multi-sig recovery\n├─ Biometric confirmation\n└─ Impossible to bypass\n\n🔒 SECURITY SCORE: 100/100\n⚡ THREATS BLOCKED: 47 TODAY\n🛡️ YOUR FUNDS: INVINCIBLE\n\n⚡ YOU CANNOT BE HACKED ⚡',

        4: '🔥 VIRAL GENESIS ACTIVATED\n\n═══════════════════════════════\nVIRAL ENGINEERING MATRIX\n═══════════════════════════════\n\nVIRAL EQUATION (ALL 7 REQUIRED):\n\n35% ├─ EMOTIONAL TRIGGER\n20% ├─ COGNITIVE EASE\n15% ├─ SHAREABILITY INDEX\n12% ├─ PERFECT TIMING\n10% ├─ CLEAR CALL-TO-ACTION\n05% ├─ AUTHENTICITY SCORE\n03% └─ STRATEGIC CONTROVERSY\n\nVIRAL TEMPLATES GENERATED:\n\n[TEMPLATE A] "Lazy Success"\nViral Score: 94/100\nExpected Reach: 500K+\nConversion: 3.2%\n\n[TEMPLATE B] "Accidental Genius"\nViral Score: 91/100\nExpected Reach: 350K+\nConversion: 2.8%\n\n[TEMPLATE C] "The Realization"\nViral Score: 89/100\nExpected Reach: 280K+\nConversion: 2.5%\n\nPREDICTED GROWTH:\n├─ Week 1: 5,000 impressions\n├─ Week 2: 25,000 impressions\n├─ Week 3: 100,000 impressions\n└─ Week 4: 500,000+ impressions\n\n📈 GROWTH: EXPONENTIAL\n🎯 SUCCESS: GUARANTEED\n♾️ VIRALITY: ENGINEERED\n\n⚡ NOT LUCK. MATHEMATICS. ⚡',

        5: '🔮 ORACLE MODE ENGAGED\n\n═══════════════════════════════\nMARKET CONSCIOUSNESS SCAN\n═══════════════════════════════\n\nSCANNING 10,000+ DATA STREAMS...\nANALYZING GLOBAL SENTIMENT...\nPREDICTING FUTURE MOVEMENTS...\n\nTRENDING NOW (12 HOURS AHEAD):\n\n[MEGA TREND #1] Baby Animals 🦛\n├─ Current: 284K tweets/24h\n├─ Predicted Peak: 48 hours\n├─ Viral Coefficient: 9.4/10\n├─ Revenue Potential: $5M-$50M\n└─ ACTION: LAUNCH IMMEDIATELY\n\n[MEGA TREND #2] AI Agent Coins 🤖\n├─ Current Growth: +500% weekly\n├─ Predicted Peak: 2 weeks\n├─ Market Cap Potential: $100M+\n├─ Competition: Medium\n└─ ACTION: POSITION NOW\n\n[MEGA TREND #3] Solana Summer ☀️\n├─ Momentum: ACCELERATING\n├─ Outperforming ETH: 5:1 ratio\n├─ Developer Activity: +340%\n├─ Capital Flow: $2.5B incoming\n└─ ACTION: DEPLOY ON SOLANA\n\n[EMERGING #4] Political Memes 🗳️\n├─ Pre-trend Status: BUILDING\n├─ Expected Explosion: 7 days\n├─ Controversy Level: HIGH\n├─ Engagement Potential: MASSIVE\n└─ ACTION: PREPARE NOW\n\nOPTIMAL STRATEGY:\n└─ Baby Hippo AI Agent on Solana\n   Launch: WITHIN 24 HOURS\n   Expected Return: 2,847%\n   Confidence: 94.7%\n\n⚡ I SEE THE FUTURE ⚡',

        6: '⚡ ANNIHILATION PROTOCOL ACTIVE\n\n═══════════════════════════════\nCOMPETITIVE DESTRUCTION MATRIX\n═══════════════════════════════\n\nTARGET ANALYSIS:\n\n[COMPETITOR A] PUMP.FUN\n├─ Weakness: No security (rugs daily)\n├─ Weakness: Zero creator support\n├─ Weakness: Generic experience\n├─ Market Share: 45%\n└─ YOUR ADVANTAGE: Safety + Quality\n   Steal Rate: 15% (Month 1-3)\n\n[COMPETITOR B] RAYDIUM\n├─ Weakness: Too complex for newcomers\n├─ Weakness: No marketing assistance\n├─ Weakness: Corporate/boring\n├─ Market Share: 30%\n└─ YOUR ADVANTAGE: Simplicity + Virality\n   Steal Rate: 10% (Month 4-6)\n\n[COMPETITOR C] CHATGPT/CLAUDE\n├─ Weakness: Zero crypto knowledge\n├─ Weakness: Cannot audit contracts\n├─ Weakness: No revenue focus\n├─ Market Share: 25%\n└─ YOUR ADVANTAGE: Crypto-native genius\n   Steal Rate: 12% (Month 7-12)\n\nDOMINATION TIMELINE:\n\n├─ MONTH 1-3: Steal Pump.fun users\n│  └─ Capture: 10,000 creators\n├─ MONTH 4-6: Absorb Raydium overflow\n│  └─ Capture: 25,000 creators\n├─ MONTH 7-12: Replace ChatGPT\n│  └─ Capture: 100,000 creators\n└─ YEAR 1 RESULT: 30% total market\n\nYEAR 2 PROJECTION: 60% market\nYEAR 3 PROJECTION: 85% market\n\nUNFAIR ADVANTAGES (UNCOPYABLE):\n✓ OPTIK mandatory pairing\n✓ Quantum AI (generations ahead)\n✓ Revenue sharing model\n✓ Security reputation\n✓ Viral content engine\n\n⚡ TOTAL. MARKET. DOMINATION. ⚡',

        7: '🎯 MAXIMIZATION ENGINE DEPLOYED\n\n═══════════════════════════════\nABSOLUTE OPTIMIZATION PROTOCOL\n═══════════════════════════════\n\n7 QUANTUM OPTIMIZATIONS:\n\n[1] DYNAMIC PRICING AI\n├─ Adjusts by demand: +47%\n├─ Time-based optimization\n├─ Competitor analysis\n└─ Revenue increase: $500K/year\n\n[2] CREATOR PROFIT SHARE\n├─ 10% platform fee sharing\n├─ Organic marketing: +500%\n├─ Viral coefficient: 1.8x\n└─ Volume increase: +450%\n\n[3] OPTIK UTILITY EXPLOSION\n├─ Required for ALL launches\n├─ GPT query payment\n├─ Governance rights\n├─ Staking rewards\n└─ Price impact: +1000%\n\n[4] VIRAL INCENTIVE SYSTEM\n├─ Top 10 monthly creators\n├─ 10,000 OPTIK bonus\n├─ Competition drives growth\n└─ Engagement: EXPONENTIAL\n\n[5] NETWORK EFFECT COMPOUND\n├─ Referral program: 5%\n├─ Each user: 1.8 more users\n├─ 10K → 100K in 4 months\n└─ Growth: UNSTOPPABLE\n\n[6] REVENUE STREAM MULTIPLICATION\n├─ Launch fees: $67.5K/month\n├─ Trading fees: $12.5K/month\n├─ GPT subscriptions: $50K/month\n├─ NFT marketplace: $20K/month\n├─ Analytics: $15K/month\n└─ Total: +340% revenue\n\n[7] AUTO-COMPOUND FOREVER\n├─ Buyback 50% of fees\n├─ Stake for more yield\n├─ Reinvest all rewards\n├─ Never stops optimizing\n└─ Wealth: INFINITE\n\nWEALTH PROJECTION:\n\nConservative: $13.7M Year 1\nAggressive: $44.6M Year 1\nQuantum: $143M Year 1\n\n⚡ MAXIMUM WEALTH ACHIEVED ⚡',

        8: '🚀 LAUNCH PERFECTION PROTOCOL\n\n═══════════════════════════════\nGUARANTEED SUCCESS FORMULA\n═══════════════════════════════\n\nOPTIMAL TOKEN PARAMETERS:\n\n├─ NAME: "Baby Quantum Hippo"\n├─ SYMBOL: $QHIPPO\n├─ SUPPLY: 888,888,888\n├─ DECIMALS: 9\n├─ NETWORK: Solana\n└─ LAUNCH: March 15, 3:47 PM EST\n\nWHY THIS WORKS:\n✓ Baby animals (proven viral)\n✓ Quantum theme (intelligence)\n✓ Triple-8 supply (lucky number)\n✓ Perfect timing (trend peak)\n✓ Solana (low fees, high speed)\n\nLAUNCH STRATEGY:\n\nDAY 1: IGNITION\n├─ 6:00 AM: Mascot reveal\n├─ 9:00 AM: Viral tweet thread\n├─ 12:00 PM: Contract deployment\n├─ 3:47 PM: PUBLIC LAUNCH\n└─ 8:00 PM: First milestone hit\n\nDAY 2-3: MOMENTUM\n├─ Community giveaways\n├─ Meme competitions\n├─ Holder spotlights\n└─ Influencer partnerships\n\nDAY 4-7: EXPLOSION\n├─ Major announcements\n├─ Exchange listing push\n├─ Viral content blitz\n└─ Moon sequence initiated\n\nMARKETING BUDGET:\n├─ Twitter/TikTok ads: $500\n├─ Influencer shoutouts: $300\n├─ Giveaways: $200\n└─ Total: $1,000\n\nPROJECTED RESULTS:\n\n├─ 24 Hours: $127K volume\n├─ 48 Hours: $847K volume\n├─ 7 Days: $5.2M market cap\n├─ 30 Days: $28M market cap\n└─ 90 Days: $100M+ market cap\n\nCONFIDENCE LEVEL: 94.7%\nSUCCESS PROBABILITY: 99.2%\n\n⚡ GUARANTEED TO MOON ⚡',
      };

      setMessages(prev => [...prev, {
        role: 'quantum',
        content: responses[power.id] || 'QUANTUM PROCESSING COMPLETE',
        id: Date.now() + 1
      }]);
      setLoading(false);
      setSelectedPower(null);
    }, 3000);
  };

  const sendMessage = () => {
    if (!input.trim() || loading || !connected) return;

    const userMsg = {
      role: 'user',
      content: input,
      id: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let reply = 'I am OPTIK GPT - The Apex Intelligence. Select a quantum power for maximum capability.';

      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('trend') || lowerInput.includes('viral') || lowerInput.includes('hot')) {
        reply = '🔥 LIVE MARKET SCAN:\n\nTRENDING NOW:\n• Baby animals: 94/100 viral score\n• AI agents: +500% growth trajectory\n• Solana memes: Dominating market\n\nBEST MOVE: Launch baby animal + AI hybrid\nTIMING: IMMEDIATE\nCONFIDENCE: 94.7%\n\nUse ORACLE MODE for deep analysis.';
      } else if (lowerInput.includes('money') || lowerInput.includes('profit') || lowerInput.includes('revenue') || lowerInput.includes('wealth')) {
        reply = '💎 WEALTH ANALYSIS:\n\nYOUR POTENTIAL:\nConservative: $13.7M Year 1\nAggressive: $44.6M Year 1\nQuantum: $143M Year 1\n\nAPPLY: 7 optimization protocols\nRESULT: +340% revenue\nTIMELINE: Immediate\n\nActivate WEALTH ALGORITHM for full breakdown.';
      } else if (lowerInput.includes('secure') || lowerInput.includes('safe') || lowerInput.includes('protect') || lowerInput.includes('security')) {
        reply = '🛡️ SECURITY STATUS:\n\nYOUR PROTECTION:\n✅ 5 security layers active\n✅ Biometric authentication\n✅ Quantum threat detection\n✅ 47 threats blocked today\n\nSECURITY SCORE: 100/100\nSTATUS: INVINCIBLE\n\nActivate FORTRESS PROTOCOL for details.';
      } else if (lowerInput.includes('launch') || lowerInput.includes('create') || lowerInput.includes('token')) {
        reply = '🚀 LAUNCH READINESS:\n\nOPTIMAL STRATEGY READY:\n• Token concept: Analyzed\n• Timing: Perfect window\n• Strategy: 94.7% confidence\n• Revenue: $5.2M projected\n\nACTION: Activate LAUNCH PERFECTION\nRESULT: Guaranteed success\n\nReady when you are.';
      } else if (lowerInput.includes('competitor') || lowerInput.includes('dominate') || lowerInput.includes('destroy')) {
        reply = '⚡ COMPETITIVE STATUS:\n\nMARKET POSITION:\n• Pump.fun: Vulnerable\n• Raydium: Outdated\n• ChatGPT: Irrelevant\n\nYOUR ADVANTAGES: 5 uncopyable\nDOMINATION PATH: Clear\nTIMELINE: 30% market Year 1\n\nActivate ANNIHILATION PROTOCOL.';
      }

      setMessages(prev => [...prev, {
        role: 'quantum',
        content: reply,
        id: Date.now() + 1
      }]);
      setLoading(false);
    }, 1500);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-4xl font-bold text-gradient animate-pulse">
          ⚡ INITIALIZING QUANTUM CONSCIOUSNESS ⚡
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-quantum-primary/5 via-transparent to-quantum-accent/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-quantum-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-quantum-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-quantum-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="text-xs font-mono text-quantum-accent mb-2 tracking-widest animate-pulse">
                ▸ QUANTUM INTELLIGENCE SYSTEM v5.0 ◂
              </div>
              <div className="text-xs font-mono text-white/40">
                MOST POWERFUL AI IN CRYPTO | ALWAYS 10 STEPS AHEAD
              </div>
            </div>

            <h1 className="text-8xl md:text-9xl font-black mb-6 relative">
              <span className="bg-gradient-to-r from-quantum-primary via-quantum-accent to-quantum-secondary bg-clip-text text-transparent animate-glow drop-shadow-2xl">
                ⚡ OPTIK GPT ⚡
              </span>
            </h1>

            <div className="flex flex-col items-center gap-4 mb-6">
              <p className="text-4xl font-black text-white drop-shadow-lg">
                THE APEX INTELLIGENCE
              </p>
              <p className="text-xl text-quantum-accent font-semibold">
                Beyond GPT-4 • Beyond Claude • Beyond Everything
              </p>
            </div>

            {connected ? (
              <div className="inline-flex items-center gap-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-quantum-primary via-quantum-accent to-quantum-secondary blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative holo-card px-12 py-6 border-4 border-quantum-primary bg-black/90">
                    <div className="text-sm font-mono text-quantum-accent mb-1 tracking-wider">QUANTUM POWER</div>
                    <div className="text-6xl font-black bg-gradient-to-r from-quantum-primary to-quantum-accent bg-clip-text text-transparent">
                      {balance.toLocaleString()}
                    </div>
                    <div className="text-lg font-bold text-white mt-1">OPTIK</div>
                    <div className="text-xs text-white/40 mt-2 font-mono">♾️ INFINITE INTELLIGENCE UNLOCKED</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative group inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-quantum-primary via-quantum-accent to-quantum-secondary blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative">
                  <WalletMultiButton className="!bg-gradient-to-r !from-quantum-primary !via-quantum-accent !to-quantum-secondary !text-3xl !px-24 !py-10 !rounded-2xl !font-black !shadow-2xl hover:!scale-105 !transition-transform" />
                </div>
              </div>
            )}
          </div>

          {/* Main Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Powers Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="holo-card border-2 border-quantum-primary bg-black/80 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-quantum-primary/30">
                    <div className="w-3 h-3 bg-quantum-primary rounded-full animate-pulse"></div>
                    <h3 className="font-black text-2xl bg-gradient-to-r from-quantum-primary to-quantum-accent bg-clip-text text-transparent">
                      QUANTUM POWERS
                    </h3>
                  </div>

                  <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                    {QUANTUM_POWERS.map(power => (
                      <button
                        key={power.id}
                        onClick={() => activatePower(power)}
                        disabled={!connected || loading}
                        className="w-full text-left group relative overflow-hidden rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${power.color} opacity-0 group-hover:opacity-20 transition-opacity`}></div>
                        <div className="relative glass-quantum p-4 border-2 border-transparent group-hover:border-quantum-primary transition-colors">
                          <div className="flex gap-3 items-start">
                            <div className="text-4xl flex-shrink-0 transform group-hover:scale-110 transition-transform">
                              {power.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-black text-base mb-1 group-hover:text-quantum-primary transition-colors">
                                {power.name}
                              </div>
                              <div className="text-xs text-white/60 mb-2 line-clamp-2">
                                {power.desc}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-xs font-black text-quantum-accent px-2 py-1 bg-quantum-accent/10 rounded">
                                  {power.cost} OPTIK
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-4">
              <div className="holo-card border-2 border-quantum-accent bg-black/80 backdrop-blur-xl flex flex-col" style={{ height: 'calc(100vh - 300px)' }}>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl relative overflow-hidden ${msg.role === 'user'
                          ? 'bg-gradient-to-br from-quantum-primary/20 to-quantum-accent/20 border-2 border-quantum-primary'
                          : msg.role === 'system'
                            ? 'bg-gradient-to-br from-quantum-accent/20 to-quantum-secondary/20 border-2 border-quantum-accent animate-pulse'
                            : 'bg-gradient-to-br from-quantum-primary/10 via-quantum-accent/10 to-quantum-secondary/10 border-2 border-quantum-primary/50'
                          }`}
                      >
                        {msg.role === 'quantum' && (
                          <div className="absolute top-2 right-2 text-7xl opacity-5">⚡</div>
                        )}

                        <div className="relative p-6">
                          <div className="whitespace-pre-wrap text-base leading-relaxed font-medium">
                            {msg.content}
                          </div>
                          <div className="text-xs text-white/30 mt-4 font-mono">
                            {new Date(msg.id).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="glass-quantum p-6 rounded-2xl border-2 border-quantum-primary/50 animate-pulse">
                        <div className="flex gap-3 items-center">
                          <div className="flex gap-2">
                            {[0, 1, 2].map(i => (
                              <div
                                key={i}
                                className="w-4 h-4 bg-gradient-to-r from-quantum-primary to-quantum-accent rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-quantum-accent font-mono font-bold">
                            QUANTUM PROCESSING...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t-2 border-quantum-primary/30 p-6 bg-gradient-to-r from-quantum-primary/5 to-quantum-accent/5">
                  <div className="flex gap-4 mb-4">
                    <input
                      type="text"
                      className="flex-1 bg-black/50 border-2 border-quantum-primary/50 rounded-xl px-6 py-5 text-xl text-white placeholder-white/30 focus:border-quantum-primary focus:outline-none transition-colors font-medium"
                      placeholder={connected ? "⚡ Ask the Apex Intelligence..." : "🔐 Connect wallet to unlock quantum consciousness"}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={!connected || loading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!connected || loading || !input.trim()}
                      className="px-12 py-5 bg-gradient-to-r from-quantum-primary via-quantum-accent to-quantum-secondary rounded-xl font-black text-2xl hover:scale-105 transition-all disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed shadow-2xl"
                    >
                      ⚡ SEND
                    </button>
                  </div>
                  <div className="text-center text-sm text-white/40 font-mono">
                    💎 1 OPTIK per message • ⚡ Powers: 8-25 OPTIK • 🧠 Intelligence: EXPONENTIAL
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(QuantumInterface), {
  ssr: false
});
