import React from 'react';
import { Target, Palette, Layers, Globe } from 'lucide-react';
import { SiteSettings } from '../types';

interface AboutProps {
  settings?: SiteSettings;
  onOpenAudit: () => void;
}

export const About: React.FC<AboutProps> = ({ settings, onOpenAudit }) => {
  const brandName = settings?.logoText || "Smart Move Marketing Agency";
  const services = [
    {
      icon: Target,
      title: "Digital Marketing",
      desc: "Results-driven digital marketing services that boost online visibility, traffic, and sales through proven strategies.",
    },
    {
      icon: Palette,
      title: "Graphics Design",
      desc: "Professional graphic design services that create visually compelling branding for digital and print platforms.",
    },
    {
      icon: Layers,
      title: "360° Marketing Solutions",
      desc: "Comprehensive 360° marketing solutions designed to drive measurable business growth across all channels.",
    },
    {
      icon: Globe,
      title: "Web Design & Development",
      desc: "Custom web design and development services focused on performance, user experience, and higher conversions.",
    }
  ];

  return (
    <section id="about" className="py-24 relative bg-[#05080c] overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B7FF00]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            What is <span className="text-[#B7FF00]">{brandName}</span>?
          </h2>
          <p className="text-[#B7FF00] text-sm font-bold tracking-wider uppercase font-mono">
            Your 360° eCommerce Growth & Marketing Partner
          </p>
          <p className="text-[#BFC5D2] text-sm sm:text-base leading-relaxed pt-2">
            {brandName} is a performance-driven 360° digital marketing agency helping eCommerce brands grow through paid ads, creative design, analytics, and high-converting web solutions — locally and globally.
          </p>
        </div>

        {/* 4 Card Grid (Dark rounded cards with lime circular badges) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group p-8 rounded-3xl bg-[#0f1520]/80 border border-white/10 hover:border-[#B7FF00]/50 transition-all duration-300 flex flex-col items-center text-center shadow-xl hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(183,255,0,0.15)]"
              >
                {/* Circular Lime Icon Badge */}
                <div className="w-16 h-16 rounded-full bg-[#B7FF00] text-black flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(183,255,0,0.4)] group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-black stroke-[2.5]" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#B7FF00] transition-colors font-sans">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[#BFC5D2] text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 text-center">
          <button
            onClick={onOpenAudit}
            className="px-8 py-3.5 rounded-full bg-[#B7FF00] text-black font-extrabold text-xs tracking-wider uppercase hover:bg-[#CFFF33] hover:scale-105 transition-all shadow-[0_0_25px_rgba(183,255,0,0.3)] cursor-pointer"
          >
            Schedule A Free Growth Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

