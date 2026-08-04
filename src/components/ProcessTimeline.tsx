import React, { useState } from 'react';
import { Search, Compass, Rocket, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

interface ProcessTimelineProps {
  onOpenAudit: () => void;
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ onOpenAudit }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Audit & Reconnaissance",
      phase: "Week 1",
      desc: "We perform a 360-degree tear-down of your existing Meta/Google ad accounts, landing page conversion funnels, and organic social hooks.",
      deliverables: [
        "15-Point Ad Account Leak Analysis",
        "Competitor Creative Scraping & Benchmarking",
        "Attribution Pixel & CVR Audit"
      ]
    },
    {
      number: "02",
      icon: Compass,
      title: "Growth Roadmap & Creative Matrix",
      phase: "Week 2",
      desc: "We architect your bespoke 90-day scale blueprint, defining audience segments, angle hypotheses, and 24 custom creative assets.",
      deliverables: [
        "3x3 Hook Creative Matrix Blueprint",
        "High-Converting Landing Page Wireframes",
        "Offer Optimization & AOV Bump Strategy"
      ]
    },
    {
      number: "03",
      icon: Rocket,
      title: "High-Velocity Execution",
      phase: "Week 3-4",
      desc: "We launch cinema-grade video ads, deploy sub-second glass landing pages, and initiate full Advantage+ campaign consolidation.",
      deliverables: [
        "24+ Native Video & Static Assets Launched",
        "CBO & ABO Campaign Infrastructure Live",
        "Daily Slack Progress Updates & ROAS Alerts"
      ]
    },
    {
      number: "04",
      icon: TrendingUp,
      title: "Scale & LTV Optimization",
      phase: "Ongoing",
      desc: "We double down on winning creative hooks, scale ad spend aggressively while preserving target CAC, and build automated retention SMS/Email flows.",
      deliverables: [
        "Aggressive Spend Scaling (Up to $100k+/mo)",
        "Post-Purchase Upsell & SMS Cart Recovery",
        "Weekly Strategy Board Room Meetings"
      ]
    }
  ];

  return (
    <section id="process" className="py-24 relative bg-[#0B0F17] overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#B7FF00]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-[#B7FF00]/30 text-[#B7FF00] text-xs font-semibold uppercase tracking-wider">
            <span>The 4-Step Velocity Method</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            How We Take Brands From <br />
            <span className="text-[#B7FF00]">Stagnant to Market Dominance</span>
          </h2>
          <p className="text-[#BFC5D2] text-base sm:text-lg">
            A battle-tested, data-backed operational system designed for predictable growth.
          </p>
        </div>

        {/* Desktop Step Nav Bar */}
        <div className="hidden lg:grid grid-cols-4 gap-4 mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-5 rounded-2xl text-left transition-all cursor-pointer border relative ${
                  isActive
                    ? 'glass-card border-[#B7FF00] shadow-[0_0_25px_rgba(183,255,0,0.25)]'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-mono font-bold ${isActive ? 'text-[#B7FF00]' : 'text-gray-500'}`}>
                    STEP {step.number}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#BFC5D2] border border-white/10">
                    {step.phase}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-[#B7FF00]/20 text-[#B7FF00]' : 'bg-white/5 text-gray-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white truncate">{step.title}</h4>
                </div>

                {isActive && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#B7FF00] rotate-45 rounded-xs pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Step Highlight Showcase Card */}
        <div className="p-8 sm:p-10 rounded-3xl glass-card border border-[#B7FF00]/30 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#B7FF00]/20 text-[#B7FF00] border border-[#B7FF00]/40 text-xs font-mono font-bold">
                  PHASE {steps[activeStep].number} • {steps[activeStep].phase}
                </span>
                <span className="text-xs text-[#BFC5D2] font-mono">Precision Operational Cycle</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {steps[activeStep].title}
              </h3>

              <p className="text-[#BFC5D2] text-sm sm:text-base leading-relaxed">
                {steps[activeStep].desc}
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#B7FF00]">Core Phase Deliverables:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {steps[activeStep].deliverables.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                      <CheckCircle className="w-4 h-4 text-[#B7FF00] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={onOpenAudit}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#B7FF00] to-[#9BE000] text-xs font-extrabold text-black shadow-[0_0_20px_rgba(183,255,0,0.4)] flex items-center gap-2 cursor-pointer"
                >
                  Start Step 1 Audit Free
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>

            {/* Step Visual Counter */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 rounded-full bg-gradient-to-tr from-[#B7FF00]/20 via-[#9BE000]/10 to-transparent p-1 border border-[#B7FF00]/30 flex items-center justify-center shadow-[0_0_50px_rgba(183,255,0,0.15)]">
                <div className="w-full h-full rounded-full bg-[#0B0F17] flex flex-col items-center justify-center text-center p-6 border border-white/5">
                  {React.createElement(steps[activeStep].icon, { className: "w-12 h-12 text-[#B7FF00] mb-2 animate-bounce-subtle" })}
                  <div className="text-4xl font-black text-white font-mono">{steps[activeStep].number}</div>
                  <div className="text-xs font-bold text-[#B7FF00] uppercase mt-1">{steps[activeStep].title}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
