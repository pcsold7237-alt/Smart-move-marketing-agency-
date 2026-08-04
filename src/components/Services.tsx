import React, { useState, useEffect } from 'react';
import { Target, Code2, Palette, Layers, Globe, Search, ArrowRight, X, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesProps {
  services: ServiceItem[];
  onSelectServiceForAudit: (serviceName: string) => void;
  heading?: string;
}

export const Services: React.FC<ServicesProps> = ({ services, onSelectServiceForAudit, heading }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Target': return Target;
      case 'Code2': return Code2;
      case 'Palette': return Palette;
      case 'Search': return Search;
      default: return Layers;
    }
  };

  const totalServices = services.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalServices);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalServices) % totalServices);
  };

  // Auto-play slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalServices);
    }, 6000);
    return () => clearInterval(timer);
  }, [totalServices]);

  return (
    <section id="services" className="py-24 relative bg-[#05080c] overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#B7FF00]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider font-mono">
            <span>Our Services</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            {heading || "What we do Best Together"}
          </h2>
          <p className="text-[#BFC5D2] text-sm sm:text-base leading-relaxed">
            Discover how enterprise brands and eCommerce leaders leverage Digiloom IT's cutting-edge platform to drive unprecedented growth and digital transformation.
          </p>
        </div>

        {/* Featured Big Green Performance Marketing Card */}
        <div className="p-8 lg:p-12 rounded-3xl bg-[#B7FF00] text-black shadow-[0_0_50px_rgba(183,255,0,0.3)] mb-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-black font-display tracking-tight leading-tight">
                Performance <br /> Marketing
              </h3>
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wider font-mono text-black/80">
                Paid Ads That Scale Profitably
              </p>
              <p className="text-sm leading-relaxed font-sans text-black/90 pt-2 font-medium">
                We manage high-ROI campaigns across Meta, Facebook, Instagram, TikTok, and Google Ads — focused on conversions, not vanity metrics. Every campaign is optimized using real data and performance insights.
              </p>
              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => onSelectServiceForAudit("Performance Marketing")}
                  className="px-6 py-3 rounded-full bg-black text-[#B7FF00] font-extrabold text-xs tracking-wider uppercase hover:bg-gray-900 transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  Book Performance Audit
                  <ArrowRight className="w-4 h-4 text-[#B7FF00]" />
                </button>
              </div>
            </div>

            {/* Right Side Mockup Displays */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
                {/* Mockup Card 1 */}
                <div className="p-3.5 rounded-2xl bg-black text-white shadow-xl flex flex-col justify-between h-44 border border-white/10">
                  <div className="flex items-center justify-between text-[10px] text-[#B7FF00] font-mono">
                    <span>Meta Ads</span>
                    <span className="w-2 h-2 rounded-full bg-[#B7FF00]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Scale Campaign</div>
                    <div className="text-lg font-black text-[#B7FF00] font-mono">+480% ROAS</div>
                    <div className="text-[9px] text-gray-400 mt-1">Conversions: $14.2k</div>
                  </div>
                </div>

                {/* Mockup Card 2 */}
                <div className="p-3.5 rounded-2xl bg-black text-white shadow-xl flex flex-col justify-between h-44 border border-white/10">
                  <div className="flex items-center justify-between text-[10px] text-[#B7FF00] font-mono">
                    <span>TikTok Viral</span>
                    <span className="w-2 h-2 rounded-full bg-[#B7FF00]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Creative Hooks</div>
                    <div className="text-lg font-black text-[#B7FF00] font-mono">2.4M Views</div>
                    <div className="text-[9px] text-gray-400 mt-1">Click Rate: 6.8%</div>
                  </div>
                </div>

                {/* Mockup Card 3 */}
                <div className="p-3.5 rounded-2xl bg-black text-white shadow-xl flex flex-col justify-between h-44 border border-white/10 hidden sm:flex">
                  <div className="flex items-center justify-between text-[10px] text-[#B7FF00] font-mono">
                    <span>Google Ads</span>
                    <span className="w-2 h-2 rounded-full bg-[#B7FF00]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">High-Intent Lead</div>
                    <div className="text-lg font-black text-[#B7FF00] font-mono">$18.5 CAC</div>
                    <div className="text-[9px] text-gray-400 mt-1">Quality Score: 10/10</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Services Slides Carousel Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white font-display">Specialized Service Offerings</h3>
            <p className="text-xs text-[#BFC5D2]">Slide to explore our full suite of digital capabilities</p>
          </div>

          {/* Slider Arrow Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-[#0f1520] border border-white/10 text-white hover:border-[#B7FF00] hover:text-[#B7FF00] transition-all cursor-pointer shadow-lg"
              aria-label="Previous Service Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-[#0f1520] border border-white/10 text-white hover:border-[#B7FF00] hover:text-[#B7FF00] transition-all cursor-pointer shadow-lg"
              aria-label="Next Service Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Slider Display */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {services.map((item) => {
              const Icon = getIcon(item.iconName);
              return (
                <div
                  key={item.id}
                  className="w-full shrink-0 px-2 sm:w-1/2 lg:w-1/3"
                >
                  <div className="h-full p-8 rounded-3xl bg-[#0f1520]/90 border border-white/10 hover:border-[#B7FF00]/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-xl hover:-translate-y-1">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-full bg-[#B7FF00] text-black flex items-center justify-center font-bold shadow-[0_0_15px_rgba(183,255,0,0.4)]">
                          <Icon className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-xs font-mono font-bold text-[#B7FF00] px-3 py-1 rounded-full bg-[#B7FF00]/10 border border-[#B7FF00]/20">
                          {item.startingPrice}
                        </span>
                      </div>

                      <span className="text-[10px] uppercase tracking-widest text-[#B7FF00] font-bold block mb-1">
                        {item.tagline}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-2 font-sans">
                        {item.title}
                      </h3>
                      <p className="text-[#BFC5D2] text-xs leading-relaxed mb-6">
                        {item.shortDesc}
                      </p>

                      <div className="space-y-2 border-t border-white/5 pt-4">
                        {item.features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#B7FF00] shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedService(item)}
                        className="text-xs font-bold text-[#BFC5D2] hover:text-[#B7FF00] flex items-center gap-1 cursor-pointer"
                      >
                        Details
                        <ArrowRight className="w-3.5 h-3.5 text-[#B7FF00]" />
                      </button>

                      <button
                        onClick={() => onSelectServiceForAudit(item.title)}
                        className="px-4 py-2 rounded-full bg-[#B7FF00] text-black text-xs font-extrabold hover:bg-[#CFFF33] transition-colors cursor-pointer"
                      >
                        Select Service
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Slide Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {services.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-8 bg-[#B7FF00]' : 'w-2.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-[#0f1520] border border-[#B7FF00]/30 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#B7FF00] text-black flex items-center justify-center shrink-0">
                {React.createElement(getIcon(selectedService.iconName), { className: "w-7 h-7 text-black" })}
              </div>
              <div>
                <span className="text-xs font-mono text-[#B7FF00] font-bold uppercase">{selectedService.tagline}</span>
                <h3 className="text-2xl font-bold text-white">{selectedService.title}</h3>
                <span className="text-xs text-[#BFC5D2]">Starting at {selectedService.startingPrice}</span>
              </div>
            </div>

            <p className="text-[#BFC5D2] text-sm leading-relaxed mb-6">
              {selectedService.fullDesc}
            </p>

            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B7FF00]" />
              Key Deliverables & Specs
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {selectedService.features.map((feat, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2 text-xs text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-[#B7FF00] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedService(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const serviceName = selectedService.title;
                  setSelectedService(null);
                  onSelectServiceForAudit(serviceName);
                }}
                className="px-6 py-2.5 rounded-full bg-[#B7FF00] text-xs font-extrabold text-black hover:bg-[#CFFF33] cursor-pointer"
              >
                Book This Service
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

