import React from 'react';
import { ArrowRight, Megaphone, Palette, Globe, Layers } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroProps {
  settings: SiteSettings;
  onOpenAudit: () => void;
  onOpenVideoModal: (videoUrl: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onOpenAudit }) => {
  const tickerItems = [
    { text: "DIGITAL MARKETING", icon: "D" },
    { text: "GRAPHICS DESIGN", icon: "D" },
    { text: "WEB DESIGN & DEVELOPMENT", icon: "D" },
    { text: "360° MARKETING SOLUTIONS", icon: "D" },
    { text: "LOGO & BRANDING", icon: "D" },
    { text: "PERFORMANCE PAID ADS", icon: "D" },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-0 overflow-hidden bg-[#05080c]"
      style={{
        backgroundImage: `linear-gradient(rgba(11, 15, 23, 0.60), rgba(11, 15, 23, 0.70)), url('/hero.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
      }}
    >
      {/* Background Grid Pattern Overlay & Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#B7FF00]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#9BE000]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex items-center py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Tag Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#B7FF00] animate-ping inline-block" />
              <span>✦ Smart Move Marketing Agency ✦</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white font-display">
              {settings.heroHeadline ? (
                settings.heroHeadline.split(/(Social Media)/i).map((part, i) => 
                  part.toLowerCase() === 'social media' ? <span key={i} className="text-[#B7FF00]">{part}</span> : part
                )
              ) : (
                <>
                  Turning <span className="text-[#B7FF00]">Social Media</span> Into Your <br />
                  <span className="text-[#B7FF00] italic font-serif">Business Growth Engine</span>
                </>
              )}
            </h1>

            {/* Subheadline */}
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-wide">
              Not just traffic. Not just design. We build complete systems that convert.
            </h2>

            {/* Body Description */}
            <p className="text-xs sm:text-sm md:text-base text-[#BFC5D2] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
              At <strong className="text-white">Smart Move Marketing Agency</strong>, we help eCommerce & ambitious brands scale faster with data-driven advertising, high-converting creatives, and performance-focused technology. From paid ads to analytics, everything works together to grow your business profitably.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 sm:pt-4">
              <a
                href="#portfolio"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#B7FF00] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(183,255,0,0.4)] hover:bg-[#CFFF33] hover:scale-105 transition-all cursor-pointer"
              >
                View Our Work
                <div className="w-5 h-5 rounded-full bg-black text-[#B7FF00] flex items-center justify-center">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </a>

              <button
                onClick={onOpenAudit}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:border-[#B7FF00] hover:text-[#B7FF00] transition-colors cursor-pointer"
              >
                Book A Free Strategy Call
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Live Growth Command Center Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center w-full">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-full flex items-center justify-center py-2">
              {/* Organic Vibrant Backdrop Shape */}
              <div
                className="absolute w-[240px] sm:w-[320px] lg:w-[380px] h-[280px] sm:h-[360px] lg:h-[420px] bg-[#B7FF00]/80 shadow-[0_0_70px_rgba(183,255,0,0.3)] z-0"
                style={{
                  borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%',
                }}
              />

              {/* Command Center Card */}
              <div className="relative z-10 w-full max-w-[310px] sm:max-w-[360px] bg-[#0A0E17]/90 backdrop-blur-xl rounded-3xl border border-[#B7FF00]/40 p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-4">
                {/* Header Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#B7FF00] animate-pulse" />
                    <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">Live Revenue Engine</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B7FF00]/20 text-[#B7FF00] font-mono font-bold border border-[#B7FF00]/40">
                    ROAS: 6.4X
                  </span>
                </div>

                {/* Main Metric Box */}
                <div className="bg-white/5 rounded-2xl p-3.5 sm:p-4 border border-white/10 relative overflow-hidden">
                  <div className="text-[10px] sm:text-[11px] font-mono text-gray-400 uppercase tracking-widest">Monthly Generated Revenue</div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-white font-mono mt-1 flex items-baseline justify-between">
                    <span>PKR 2,849,500</span>
                    <span className="text-[10px] sm:text-xs font-bold text-[#B7FF00] bg-[#B7FF00]/10 px-2 py-0.5 rounded-lg border border-[#B7FF00]/30">
                      ↑ +340%
                    </span>
                  </div>
                  {/* Neon Sparkline SVG */}
                  <div className="mt-3 h-10 w-full">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 50" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="limeGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#B7FF00" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#B7FF00" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 40 Q 40 30, 80 35 T 160 18 T 240 22 T 300 5 L 300 50 L 0 50 Z"
                        fill="url(#limeGlow)"
                      />
                      <path
                        d="M 0 40 Q 40 30, 80 35 T 160 18 T 240 22 T 300 5"
                        fill="none"
                        stroke="#B7FF00"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Performance Metrics Row */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[9px] sm:text-[10px] text-gray-400 font-mono">Conversion Rate</div>
                    <div className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5">4.85% <span className="text-[9px] text-[#B7FF00]">(+1.2%)</span></div>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[9px] sm:text-[10px] text-gray-400 font-mono">Cost Per Acquisition</div>
                    <div className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5">PKR 1,240 <span className="text-[9px] text-[#B7FF00]">(-28%)</span></div>
                  </div>
                </div>

                {/* Channels Row */}
                <div className="pt-1 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-gray-300">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#B7FF00]" /> Meta Ads</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#B7FF00]" /> TikTok Shop</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#B7FF00]" /> Google Ads</span>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute -top-2 right-1 sm:-right-2 z-20 px-2.5 py-1 rounded-full bg-[#B7FF00] text-black font-extrabold text-[10px] sm:text-xs flex items-center gap-1 shadow-xl border border-black/20">
                <Layers className="w-3 h-3 text-black" />
                <span>360° Marketing</span>
              </div>

              <div className="absolute top-1/4 -left-1 sm:-left-4 z-20 px-2.5 py-1 rounded-full bg-[#B7FF00] text-black font-extrabold text-[10px] sm:text-xs flex items-center gap-1 shadow-xl border border-black/20">
                <Megaphone className="w-3 h-3 text-black" />
                <span>Paid Ads Engine</span>
              </div>

              <div className="absolute bottom-10 -left-1 sm:-left-3 z-20 px-2.5 py-1 rounded-full bg-[#B7FF00] text-black font-extrabold text-[10px] sm:text-xs flex items-center gap-1 shadow-xl border border-black/20">
                <Palette className="w-3 h-3 text-black" />
                <span>Graphics & Brand</span>
              </div>

              <div className="absolute -bottom-2 right-1 sm:-right-2 z-20 px-2.5 py-1 rounded-full bg-[#B7FF00] text-black font-extrabold text-[10px] sm:text-xs flex items-center gap-1 shadow-xl border border-black/20">
                <Globe className="w-3 h-3 text-black" />
                <span>Web & Funnels</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker Bar */}
      <div className="w-full bg-[#B7FF00] text-black py-3 overflow-hidden border-y border-black relative z-20 shadow-lg">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 font-extrabold text-xs sm:text-sm tracking-wider uppercase font-mono">
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 shrink-0">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-black inline-block" />
                {item.text}
              </span>
              <span className="text-black font-black text-base">●</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


