import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
  onOpenVideoModal: (videoUrl: string) => void;
  heading?: string;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials, heading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const nextSlide = () => {
    if (!testimonials || testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setProgress(0);
  };

  const prevSlide = () => {
    if (!testimonials || testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setProgress(0);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 1.67; // approx 6 seconds total
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, testimonials]);

  const handlePauseToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const activeTestimonial = testimonials && testimonials.length > 0
    ? (testimonials[currentIndex] || testimonials[0])
    : null;

  // Map each testimonial ID to its corresponding uploaded image
  const getImagePath = (id: string): string => {
    switch (id) {
      case 'test-future-tour':
        return '/1.jpeg';
      case 'test-haga-bagel':
        return '/2.jpeg';
      case 'test-ecomascendx':
        return '/3.jpeg';
      case 'test-easygo':
        return '/4.jpeg';
      case 'test-sikis-salon':
        return '/5.jpeg';
      case 'test-dr-aniqa':
        return '/6.jpeg';
      case 'test-nexus-ai':
        return '/7.jpeg';
      default:
        return '/1.jpeg';
    }
  };

  // Map each testimonial ID to a punchy one-line hook shown on the left
  const getOneLineHook = (id: string): string => {
    switch (id) {
      case 'test-future-tour':
        return "Consistent social media management & page optimization generating a massive volume of qualified travel leads.";
      case 'test-haga-bagel':
        return "Complete transformation of social media presence with high-quality content and high-converting Facebook campaigns.";
      case 'test-ecomascendx':
        return "Audience targeting strategy and ad optimization that brought quality inquiries and expanded our client base.";
      case 'test-easygo':
        return "High-quality travel lead generation & optimized ad targeting that consistently converts high-intent buyers.";
      case 'test-sikis-salon':
        return "Transformed Instagram presence with creative, professional posts and a noticeable surge in client inquiries.";
      case 'test-dr-aniqa':
        return "Highly professional Instagram management with consistent posting and an extremely attractive visual style.";
      case 'test-nexus-ai':
        return "Outstanding collaboration designing high-impact campaigns that scaled our brand authority and improved user acquisition.";
      default:
        return "Unlocking digital growth with exceptional marketing execution and high-converting media assets.";
    }
  };

  // Map each testimonial ID to a category/topic tag
  const getCategoryTag = (id: string): string => {
    switch (id) {
      case 'test-future-tour':
        return "Lead Gen & Social Management";
      case 'test-haga-bagel':
        return "Content & Paid Social";
      case 'test-ecomascendx':
        return "Meta Ads & Audience Growth";
      case 'test-easygo':
        return "Meta Ads & Quality Leads";
      case 'test-sikis-salon':
        return "Aesthetics & Instagram Brand";
      case 'test-dr-aniqa':
        return "Medical Brand Aesthetics";
      case 'test-nexus-ai':
        return "Conversion Optimization";
      default:
        return "Growth Marketing Case";
    }
  };

  return (
    <section id="testimonials" className="py-24 relative bg-[#05080c] overflow-hidden border-t border-b border-white/5">
      {/* Visual Ambient Glow Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B7FF00]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-[350px] h-[350px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B7FF00]/5 border border-[#B7FF00]/10 text-[#B7FF00] text-[11px] font-black uppercase tracking-widest font-mono">
            <Quote className="w-3.5 h-3.5 text-[#B7FF00] fill-[#B7FF00]/10" />
            <span>Client Proof & Performance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display leading-tight">
            {heading || "Clients Reviews"}
          </h2>
          <p className="text-[#BFC5D2] text-sm sm:text-base leading-relaxed">
            Real proof of performance-driven scaling directly from brand founders who partner with Smart Move.
          </p>
        </div>

        {/* Dynamic Dual Column Slider */}
        {activeTestimonial ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-6xl mx-auto mb-16">
            
            {/* Left Column - Meta Details & Brand Quote */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-center">
              
              {/* Category tag */}
              <div className="flex">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-[#B7FF00]/15 text-[10px] font-black text-[#B7FF00] tracking-widest uppercase shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#B7FF00] fill-[#B7FF00]/20" />
                  <span>{getCategoryTag(activeTestimonial.id)}</span>
                </div>
              </div>

              {/* Testimonial Title */}
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {activeTestimonial.name}
              </h3>

              {/* Star rating and verification badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(activeTestimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider">
                  <Check className="w-2.5 h-2.5 stroke-[3px]" />
                  <span>Verified Client</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[9px] font-black uppercase tracking-wider">
                  <span>Featured Partner</span>
                </div>
              </div>

              {/* Punchy Custom Summary Quote */}
              <div className="pl-6 border-l-2 border-[#B7FF00]/30 py-1">
                <p className="text-white/90 text-lg sm:text-xl font-bold leading-relaxed italic">
                  "{getOneLineHook(activeTestimonial.id)}"
                </p>
              </div>

              {/* Integration label */}
              <div className="text-[9px] font-mono tracking-widest text-white/30 uppercase pt-4 border-t border-white/10">
                Platform Integration &bull; Direct Case Artifact
              </div>

              {/* Controls and Progress row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                {/* Progress bar */}
                <div className="flex items-center gap-3 text-[9px] font-mono tracking-widest text-white/40 font-extrabold">
                  <span>AUTOPLAY STATUS</span>
                  <div className="h-[2px] w-20 bg-white/10 relative overflow-hidden rounded-full">
                    <div 
                      className="absolute top-0 left-0 h-full bg-[#B7FF00] transition-all duration-100 ease-linear"
                      style={{ width: `${isPlaying ? progress : 0}%` }}
                    />
                  </div>
                  <span>{isPlaying ? 'ACTIVE' : 'PAUSED'}</span>
                </div>

                {/* Arrow navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2.5px]" />
                  </button>
                  <button
                    onClick={handlePauseToggle}
                    className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm text-[10px] font-mono font-bold"
                    title={isPlaying ? "Pause autoplay" : "Play autoplay"}
                  >
                    {isPlaying ? "||" : "▶"}
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[2.5px]" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column - Premium Browser Viewport showing exact client image screenshot */}
            <div className="lg:col-span-7 flex items-center justify-center">
              <div className="bg-[#0b0e14]/60 border border-white/5 rounded-[24px] p-4 sm:p-8 flex flex-col shadow-2xl relative w-full max-w-xl overflow-hidden group">
                {/* Decorative background glow behind the image frame */}
                <div className="absolute inset-0 bg-[#B7FF00]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl rounded-full pointer-events-none" />
                
                {/* Browser Mockup Toolbar */}
                <div className="flex items-center justify-between pb-4 border-b border-white/5 text-xs text-white/40 mb-4 select-none">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-md px-3 py-1 text-[10px] font-mono tracking-wide text-white/50 w-44 sm:w-60 truncate text-center">
                    smartmove.marketing/reviews/{activeTestimonial.id}
                  </div>
                  <div className="w-8" />
                </div>

                {/* Exact Image Display frame */}
                <div className="relative overflow-hidden flex items-center justify-center bg-[#05080c]/80 rounded-xl p-2 sm:p-4 border border-white/5 shadow-inner">
                  <img loading="lazy" decoding="async" src={getImagePath(activeTestimonial.id)}
                    alt={activeTestimonial.name}
                    referrerPolicy="no-referrer"
                    className="max-h-[380px] w-auto h-auto object-contain rounded-lg shadow-md transition-all duration-500 group-hover:scale-[1.01]"
                  />
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-12 text-white/40 text-xs">
            No testimonials available.
          </div>
        )}

        {/* Left empty as the company logo section has been removed */}
      </div>
    </section>
  );
};
