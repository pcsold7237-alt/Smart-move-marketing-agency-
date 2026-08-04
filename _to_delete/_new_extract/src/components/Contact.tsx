import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Sparkles, Building2, Globe, Mail, User, DollarSign, Target, Loader2 } from 'lucide-react';

interface ContactProps {
  prefilledPackage?: string;
  onLeadSubmitted?: () => void;
  contactPhone?: string;
}

export const Contact: React.FC<ContactProps> = ({ prefilledPackage, onLeadSubmitted, contactPhone = "+92 320 2479323" }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business: '',
    website: '',
    budget: '$10k - $25k',
    selectedPackage: prefilledPackage || 'Growth Scale',
    goals: ['Scale Paid Ads (Meta/TikTok)', 'Landing Page & Web Overhaul']
  });

  useEffect(() => {
    if (prefilledPackage) {
      setFormData((prev) => ({ ...prev, selectedPackage: prefilledPackage }));
    }
  }, [prefilledPackage]);

  const budgetOptions = [
    '< $5k/mo',
    '$5k - $10k',
    '$10k - $25k',
    '$25k - $50k',
    '$50k+/mo'
  ];

  const packageOptions = [
    'Starter Velocity ($2,499/mo)',
    'Growth Scale ($4,999/mo)',
    'Enterprise Dominance ($8,999/mo)',
    'Custom Audit & Advisory'
  ];

  const goalOptions = [
    'Scale Paid Ads (Meta/TikTok)',
    'Landing Page & Web Overhaul',
    'Viral Short-Form Video',
    'Brand Identity & 3D Assets',
    'SEO & Organic Traffic',
    'CRO & Funnel Optimization'
  ];

  const toggleGoal = (goal: string) => {
    if (formData.goals.includes(goal)) {
      setFormData({ ...formData, goals: formData.goals.filter(g => g !== goal) });
    } else {
      setFormData({ ...formData, goals: [...formData.goals, goal] });
    }
  };

  const handleNextStep = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.business.trim()) {
        setErrorMsg('Please fill out your Name, Email, and Business Name.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit lead.');
      }

      setSuccessMsg(data.message || 'Audit booking successfully received!');
      
      // WhatsApp notification
      const cleanPhone = contactPhone.replace(/[^\d+]/g, '');
      let waMessage = `New Lead Submission!\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nBusiness: ${formData.business}\nBudget: ${formData.budget}\nSelected Service: ${formData.service}\n\nGoals: ${formData.goals.join(', ')}\nMessage: ${formData.message}`;
      const waUrl = `https://wa.me/${cleanPhone.startsWith('+') ? cleanPhone.substring(1) : cleanPhone}?text=${encodeURIComponent(waMessage)}`;
      
      window.open(waUrl, '_blank');

      if (onLeadSubmitted) onLeadSubmitted();
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-[#05080c] overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#B7FF00]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#B7FF00]" />
            <span>High-Priority Lead Portal</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Claim Your Free <br />
            <span className="text-[#B7FF00]">15-Point Growth Audit</span>
          </h2>
          <p className="text-[#BFC5D2] text-sm sm:text-base leading-relaxed">
            No obligation. We will tear down your ad funnels, landing page UX, and competitors within 24 hours.
          </p>
        </div>

        {/* Multi-step Form Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0f1520] border border-[#B7FF00]/30 shadow-2xl relative">
          {/* Step Progress Bar */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono ${step >= 1 ? 'bg-[#B7FF00] text-black shadow-[0_0_12px_#B7FF00]' : 'bg-white/10 text-gray-500'}`}>
                1
              </span>
              <span className={`text-xs font-medium hidden sm:inline ${step >= 1 ? 'text-white' : 'text-gray-500'}`}>
                Business Details
              </span>
            </div>

            <div className="w-12 h-0.5 bg-white/10" />

            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono ${step >= 2 ? 'bg-[#B7FF00] text-black shadow-[0_0_12px_#B7FF00]' : 'bg-white/10 text-gray-500'}`}>
                2
              </span>
              <span className={`text-xs font-medium hidden sm:inline ${step >= 2 ? 'text-white' : 'text-gray-500'}`}>
                Budget & Goals
              </span>
            </div>

            <div className="w-12 h-0.5 bg-white/10" />

            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono ${step >= 3 ? 'bg-[#B7FF00] text-black shadow-[0_0_12px_#B7FF00]' : 'bg-white/10 text-gray-500'}`}>
                3
              </span>
              <span className={`text-xs font-medium hidden sm:inline ${step >= 3 ? 'text-white' : 'text-gray-500'}`}>
                Review & Confirm
              </span>
            </div>
          </div>

          {/* Success State */}
          {successMsg ? (
            <div className="py-12 text-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-[#B7FF00]/20 border-2 border-[#B7FF00]/50 text-[#B7FF00] mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(183,255,0,0.3)]">
                <CheckCircle2 className="w-10 h-10 text-[#B7FF00]" />
              </div>
              <h3 className="text-2xl font-bold text-white">Audit Request Confirmed!</h3>
              <p className="text-sm text-[#BFC5D2] max-w-md mx-auto leading-relaxed">
                {successMsg}
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSuccessMsg(null);
                    setStep(1);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#B7FF00] border border-white/10 cursor-pointer"
                >
                  Submit Another Booking
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-lg font-bold text-white mb-4">Step 1: Tell Us About Your Business</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-2">
                        Your Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#B7FF00] absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Marcus Vance"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#B7FF00] focus:ring-1 focus:ring-[#B7FF00] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-2">
                        Business Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#B7FF00] absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="marcus@company.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#B7FF00] focus:ring-1 focus:ring-[#B7FF00] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-2">
                        Company / Brand Name *
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-[#B7FF00] absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={formData.business}
                          onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                          placeholder="e.g. Vance Tech Inc."
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#B7FF00] focus:ring-1 focus:ring-[#B7FF00] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-2">
                        Website or Store URL
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-[#B7FF00] absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="https://vancetech.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#B7FF00] focus:ring-1 focus:ring-[#B7FF00] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-lg font-bold text-white mb-4">Step 2: Budget & Primary Growth Goals</h3>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-3">
                      Estimated Monthly Marketing Budget:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {budgetOptions.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setFormData({ ...formData, budget: b })}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                            formData.budget === b
                              ? 'bg-[#B7FF00]/20 border-[#B7FF00] text-[#B7FF00] shadow-[0_0_15px_rgba(183,255,0,0.2)]'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-3">
                      Target Package Tier:
                    </label>
                    <select
                      value={formData.selectedPackage}
                      onChange={(e) => setFormData({ ...formData, selectedPackage: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-[#B7FF00] outline-none cursor-pointer"
                    >
                      {packageOptions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-3">
                      Main Growth Objectives (Select all that apply):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {goalOptions.map((g) => {
                        const isChecked = formData.goals.includes(g);
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => toggleGoal(g)}
                            className={`p-3 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer border flex items-center justify-between ${
                              isChecked
                                ? 'bg-[#B7FF00]/20 border-[#B7FF00] text-[#B7FF00] shadow-[0_0_15px_rgba(183,255,0,0.2)]'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                            }`}
                          >
                            <span>{g}</span>
                            {isChecked && <CheckCircle2 className="w-4 h-4 text-[#B7FF00]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-lg font-bold text-white mb-4">Step 3: Review & Confirm Audit Booking</h3>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-400 block">Name:</span>
                        <span className="font-bold text-white">{formData.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Email:</span>
                        <span className="font-bold text-white">{formData.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Company:</span>
                        <span className="font-bold text-white">{formData.business}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Website:</span>
                        <span className="font-bold text-white">{formData.website || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Monthly Budget:</span>
                        <span className="font-bold text-[#B7FF00] font-mono">{formData.budget}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Package:</span>
                        <span className="font-bold text-[#B7FF00] font-mono">{formData.selectedPackage}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 text-xs">
                      <span className="text-gray-400 block mb-1">Goals:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.goals.map((g, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-full bg-[#B7FF00]/20 text-[#B7FF00] border border-[#B7FF00]/30 text-[10px]">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 border border-white/10 cursor-pointer"
                  >
                    Previous Step
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B7FF00] to-[#9BE000] text-xs font-extrabold text-black shadow-[0_0_20px_rgba(183,255,0,0.4)] hover:opacity-90 cursor-pointer"
                  >
                    Continue to Step {step + 1}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#B7FF00] to-[#9BE000] text-sm font-extrabold text-black shadow-[0_0_25px_rgba(183,255,0,0.4)] hover:shadow-[0_0_40px_rgba(183,255,0,0.6)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        Submitting Audit Booking...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black" />
                        Submit Audit Booking Now
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
