import React, { useState } from 'react';
import { BarChart2, Sparkles, ArrowUpRight, CheckCircle2, Play, Video } from 'lucide-react';
import { SiteSettings, CaseStudy } from '../types';

interface PortfolioProps {
  caseStudies: CaseStudy[];
  onOpenVideoModal?: (videoUrl: string) => void;
  onOpenAudit: () => void;
  heading?: string;
  settings?: SiteSettings;
}

export const Portfolio: React.FC<PortfolioProps> = ({ caseStudies = [], onOpenVideoModal, onOpenAudit, heading, settings }) => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const brandName = settings?.logoText || "Smart Move Marketing Agency";

  return (
    <section id="portfolio" className="py-24 relative bg-[#05080c] overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#B7FF00]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider font-mono">
            <BarChart2 className="w-3.5 h-3.5 text-[#B7FF00]" />
            <span>Verified Case Study Breakdown</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            {heading || "Case Studies That Prove Predictable Revenue Scale"}
          </h2>
          <p className="text-[#BFC5D2] text-sm sm:text-base leading-relaxed">
            Watch how {brandName} engineers predictable 5x-8x ROAS and scaled multi-million dollar breakthroughs for eCommerce brands.
          </p>
        </div>

        {/* Featured Case Study Video Display */}
        <div className="relative rounded-3xl overflow-hidden bg-[#0f1520] border-2 border-[#B7FF00]/40 shadow-[0_0_60px_rgba(183,255,0,0.25)] group mb-16">
          {/* Top Status Bar */}
          <div className="bg-black/80 px-6 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#B7FF00] animate-pulse" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Featured Case Study Video Walkthrough
              </span>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#B7FF00]/20 text-[#B7FF00] font-mono font-bold border border-[#B7FF00]/40">
              {brandName} Proof
            </span>
          </div>

          {/* Video Container */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
            <video
              src="/fr.mp4"
              controls
              controlsList="nodownload"
              playsInline
              preload="metadata"
              className="w-full h-full object-contain rounded-b-3xl"
            >
              Your browser does not support HTML5 video playback.
            </video>
          </div>

          {/* Bottom Callout Bar */}
          <div className="p-6 sm:p-8 bg-black/90 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                <Sparkles className="w-4 h-4 text-[#B7FF00]" />
                Ready to replicate these scalable revenue results?
              </div>
              <p className="text-xs text-[#BFC5D2]">
                Get a personalized 15-point growth audit for your eCommerce brand today.
              </p>
            </div>

            <button
              onClick={onOpenAudit}
              className="px-6 py-3 rounded-full bg-[#B7FF00] text-black text-xs font-extrabold hover:bg-[#CFFF33] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(183,255,0,0.4)] shrink-0"
            >
              Claim Your Free Growth Audit
              <ArrowUpRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        {/* Dynamic Case Studies Grid */}
        {caseStudies.length > 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((study) => (
                <div
                  key={study.id}
                  className="rounded-2xl overflow-hidden bg-[#0f1520]/80 border border-white/10 hover:border-[#B7FF00]/40 transition-all group flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <img loading="lazy" decoding="async" src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-[#B7FF00]">
                      {study.category}
                    </div>
                    {study.videoUrl && onOpenVideoModal && (
                      <button
                        onClick={() => onOpenVideoModal(study.videoUrl!)}
                        className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#B7FF00] text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                        title="Watch case study video"
                      >
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </button>
                    )}
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-semibold text-gray-400">{study.client}</span>
                        <span className="text-xs font-mono font-bold text-[#B7FF00] bg-[#B7FF00]/10 px-2.5 py-0.5 rounded-full border border-[#B7FF00]/20">
                          {study.roas}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-white group-hover:text-[#B7FF00] transition-colors font-sans line-clamp-2">
                        {study.title}
                      </h4>
                      <p className="text-xs text-gray-300 line-clamp-3">{study.description}</p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-gray-400 block text-[10px] uppercase font-mono">Growth Outcome:</span>
                        <span className="font-extrabold text-white text-sm font-mono">{study.growthMetric}</span>
                      </div>
                      <button
                        onClick={() => setSelectedCase(study)}
                        className="text-xs font-bold text-[#B7FF00] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        Details
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Case Study Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-[#0f1520] border-2 border-[#B7FF00]/40 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <span className="px-3 py-1 rounded-full bg-[#B7FF00]/20 text-[#B7FF00] border border-[#B7FF00]/30 text-xs font-mono font-bold">
                {selectedCase.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-display tracking-tight">
                {selectedCase.title}
              </h3>
              <p className="text-sm text-gray-400 mt-1">Client: <strong>{selectedCase.client}</strong> • ROAS: <strong className="text-[#B7FF00]">{selectedCase.roas}</strong></p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="text-xs font-bold uppercase text-[#B7FF00] mb-1 font-mono">The Challenge</h4>
                  <p className="text-xs text-gray-200 leading-relaxed">{selectedCase.challenge}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="text-xs font-bold uppercase text-[#B7FF00] mb-1 font-mono">The Solution</h4>
                  <p className="text-xs text-gray-200 leading-relaxed">{selectedCase.solution}</p>
                </div>
              </div>

              <div className="space-y-3 p-5 rounded-2xl bg-[#B7FF00]/5 border border-[#B7FF00]/20">
                <h4 className="text-xs font-bold uppercase text-white tracking-wider font-mono">Verified Results achieved:</h4>
                <div className="space-y-2">
                  {selectedCase.results.map((res, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs text-gray-100">
                      <CheckCircle2 className="w-4 h-4 text-[#B7FF00] shrink-0 mt-0.5" />
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase font-mono">Growth Metric:</span>
                <span className="text-lg font-black text-[#B7FF00] font-mono">{selectedCase.growthMetric}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setSelectedCase(null); onOpenAudit(); }}
                  className="px-5 py-2.5 rounded-full bg-[#B7FF00] text-black text-xs font-extrabold hover:bg-[#CFFF33] cursor-pointer"
                >
                  Book Growth Audit
                </button>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-white hover:bg-white/10 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

