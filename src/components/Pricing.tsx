import React, { useState } from 'react';
import { Check, Zap, Calculator, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { PricingPackage } from '../types';

interface PricingProps {
  packages: PricingPackage[];
  onSelectPackage: (packageName: string) => void;
  heading?: string;
}

export const Pricing: React.FC<PricingProps> = ({ packages, onSelectPackage, heading }) => {
  // Calculator Interactive State
  const [adSpend, setAdSpend] = useState<number>(10000); // $10,000/mo default
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['Meta (IG & FB)', 'TikTok Ads']);
  const [targetRoas, setTargetRoas] = useState<number>(4.5);

  const channelsList = ['Meta (IG & FB)', 'TikTok Ads', 'Google & YouTube Ads', 'Organic Short Video'];

  const toggleChannel = (ch: string) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter(c => c !== ch));
      }
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  // Projected Monthly Revenue = Ad Spend * Target ROAS
  const projectedRev = Math.round(adSpend * targetRoas);
  const projectedNetProfit = Math.round(projectedRev - adSpend);

  const recommendedPackage = adSpend >= 10000
    ? 'Enterprise Dominance'
    : adSpend >= 3000
    ? 'Growth Scale'
    : 'Starter Velocity';

  return (
    <section id="pricing" className="py-24 relative bg-[#05080c] overflow-hidden">
      {/* Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#B7FF00]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider font-mono">
            <Zap className="w-3.5 h-3.5 text-[#B7FF00]" />
            <span>Transparent Investment Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display">
            {heading || "Predictable Pricing Designed For Maximum Scalable Profit"}
          </h2>
          <p className="text-[#BFC5D2] text-sm sm:text-base leading-relaxed">
            No hidden fees or bloated retainers. Choose your acceleration tier below or simulate your ROI.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`group p-8 rounded-3xl bg-[#0f1520]/80 flex flex-col justify-between relative transition-all duration-300 ${
                pkg.popular
                  ? 'border-2 border-[#B7FF00] shadow-[0_0_40px_rgba(183,255,0,0.2)] lg:-translate-y-3'
                  : 'border border-white/10 hover:border-[#B7FF00]/40'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#B7FF00] text-[11px] font-extrabold uppercase tracking-wider text-black shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  Most Popular Scale Tier
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white font-sans">{pkg.name}</h3>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#BFC5D2] font-mono">
                    {pkg.recommendedSpend}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">${pkg.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 font-medium">{pkg.period}</span>
                </div>

                <p className="text-xs text-[#BFC5D2] leading-relaxed mb-6">
                  {pkg.description}
                </p>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="text-[11px] uppercase tracking-wider text-[#B7FF00] font-bold mb-2">Included Deliverables:</div>
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-200">
                      <Check className="w-4 h-4 text-[#B7FF00] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-6">
                <button
                  onClick={() => onSelectPackage(pkg.name)}
                  className={`w-full py-3.5 rounded-full text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    pkg.popular
                      ? 'bg-[#B7FF00] text-black shadow-[0_0_20px_rgba(183,255,0,0.3)] hover:bg-[#CFFF33]'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:border-[#B7FF00]/30'
                  }`}
                >
                  Select {pkg.name}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Pricing & ROI Calculator Container */}
        <div className="p-8 sm:p-12 rounded-3xl glass-card border border-[#B7FF00]/30 shadow-2xl relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-[#B7FF00]/20 text-[#B7FF00] border border-[#B7FF00]/40">
              <Calculator className="w-6 h-6 text-[#B7FF00]" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-white">Interactive Growth ROI Simulator</h3>
              <p className="text-xs text-[#BFC5D2]">Estimate your revenue trajectory and recommended agency tier</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Calculator Controls */}
            <div className="lg:col-span-7 space-y-8">
              {/* Ad Spend Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Target Monthly Ad Spend ($)
                  </label>
                  <span className="text-lg font-black text-[#B7FF00] font-mono">
                    ${adSpend.toLocaleString()}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={adSpend}
                  onChange={(e) => setAdSpend(Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#B7FF00]"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
                  <span>$1,000</span>
                  <span>$25,000</span>
                  <span>$50,000+</span>
                </div>
              </div>

              {/* Target ROAS Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Target ROAS Benchmark
                  </label>
                  <span className="text-lg font-black text-[#B7FF00] font-mono">
                    {targetRoas}x ROAS
                  </span>
                </div>
                <input
                  type="range"
                  min="2.5"
                  max="8.0"
                  step="0.1"
                  value={targetRoas}
                  onChange={(e) => setTargetRoas(Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#B7FF00]"
                />
              </div>

              {/* Channels Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block mb-3">
                  Select Acquisition Channels:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {channelsList.map((ch) => {
                    const isSelected = selectedChannels.includes(ch);
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => toggleChannel(ch)}
                        className={`p-3 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer border flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#B7FF00]/20 border-[#B7FF00] text-[#B7FF00] shadow-[0_0_15px_rgba(183,255,0,0.2)]'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        <span>{ch}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#B7FF00]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Simulated ROI Results Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-[#B7FF00]/10 via-gray-950 to-[#9BE000]/10 border border-[#B7FF00]/30">
              <div className="space-y-6">
                <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#B7FF00]">
                  ESTIMATED REVENUE PROJECTION
                </div>

                <div>
                  <div className="text-xs text-gray-400">Projected Monthly Gross Revenue</div>
                  <div className="text-3xl font-black text-[#B7FF00] font-mono">
                    ${projectedRev.toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-[11px] text-gray-400">Estimated Net Ad Profit</div>
                    <div className="text-lg font-bold text-[#B7FF00] font-mono">
                      +${projectedNetProfit.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-400">Recommended Tier</div>
                    <div className="text-sm font-bold text-[#B7FF00] font-mono">
                      {recommendedPackage}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onSelectPackage(recommendedPackage)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B7FF00] to-[#9BE000] text-xs font-extrabold text-black shadow-[0_0_20px_rgba(183,255,0,0.4)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-black" />
                  Lock In Calculated Audit Strategy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
