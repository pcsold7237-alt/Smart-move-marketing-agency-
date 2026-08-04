import React, { useState } from 'react';
import { Sparkles, Send, ShieldCheck, Mail, Phone, MapPin, Twitter, Linkedin, Instagram, Youtube, X } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
  onOpenAudit: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin, onOpenAudit }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<string | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newsletterEmail.trim(),
          selectedPackage: 'Newsletter Subscription',
          business: 'Newsletter Subscriber',
          budget: 'N/A',
          goals: ['Stay Updated with Growth Intel']
        })
      });
      if (res.ok) {
        setSubscribed(true);
        setNewsletterEmail('');
        setTimeout(() => setSubscribed(false), 5000);
      }
    } catch (err) {
      console.error('Newsletter subscription error:', err);
    }
  };

  return (
    <footer className="bg-[#030508] border-t border-white/10 relative overflow-hidden text-gray-400 text-xs">
      {/* Glow Ambient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#B7FF00]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#B7FF00] p-0.5 shadow-[0_0_15px_rgba(183,255,0,0.4)] flex items-center justify-center">
                <img loading="lazy" decoding="async" src="/cf25f7b8-0d91-4ab0-b025-9920ebc651f3.jpg"
                  alt="Smart Move Marketing Agency Logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight font-sans">
                {settings.logoText ? (
                  <>
                    {settings.logoText.split(' ')[0]} <span className="text-[#B7FF00]">{settings.logoText.split(' ').slice(1).join(' ') || 'Agency'}</span>
                  </>
                ) : (
                  <>Smart Move <span className="text-[#B7FF00]">Marketing Agency</span></>
                )}
              </span>
            </div>

            <p className="text-[#BFC5D2] text-xs sm:text-sm leading-relaxed max-w-sm">
              Smart Move Marketing Agency is a performance-driven 360° digital marketing agency helping eCommerce & SaaS brands scale through paid ads, creative design, analytics, and high-converting web solutions.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-[#B7FF00]" />
                <span>{settings.contactEmail || 'contact@digiloomit.com'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-[#B7FF00]" />
                <span>{settings.contactPhone || '+1 (800) 555-DIGI'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-[#B7FF00]" />
                <span>{settings.officeAddress || 'Digital Tower, Tech District, USA'}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#about" className="hover:text-[#B7FF00] transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-[#B7FF00] transition-colors">Services</a></li>
              <li><a href="#portfolio" className="hover:text-[#B7FF00] transition-colors">Case Studies</a></li>
              <li><a href="#process" className="hover:text-[#B7FF00] transition-colors">4-Step Process</a></li>
              <li><a href="#team" className="hover:text-[#B7FF00] transition-colors">Growth Team</a></li>
              <li><a href="#pricing" className="hover:text-[#B7FF00] transition-colors">Pricing & ROI</a></li>
              <li><a href="#blog" className="hover:text-[#B7FF00] transition-colors">Growth Blog</a></li>
            </ul>
          </div>

          {/* Column 3: Legal & Admin */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Legal & Platform
            </h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => setActiveLegalModal('privacy')} className="hover:text-[#B7FF00] transition-colors cursor-pointer">Privacy Policy</button></li>
              <li><button onClick={() => setActiveLegalModal('terms')} className="hover:text-[#B7FF00] transition-colors cursor-pointer">Terms of Service</button></li>
              <li><button onClick={() => setActiveLegalModal('cookie')} className="hover:text-[#B7FF00] transition-colors cursor-pointer">Cookie Preferences</button></li>
              <li><button onClick={onOpenAdmin} className="hover:text-[#B7FF00] transition-colors cursor-pointer">Admin Portal</button></li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Growth Newsletter
            </h4>
            <p className="text-[11px] text-[#BFC5D2] mb-3 leading-relaxed">
              Get our weekly 2-minute breakdowns of winning Meta ad creative hooks & scale tactics.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="enter email..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[#B7FF00] outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 rounded-lg bg-gradient-to-r from-[#B7FF00] to-[#9BE000] text-black text-xs font-extrabold flex items-center justify-center cursor-pointer hover:opacity-90"
                >
                  <Send className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
              {subscribed && (
                <div className="text-[10px] text-[#B7FF00] font-bold animate-fadeIn">
                  ✓ Subscribed to Growth Intel!
                </div>
              )}
            </form>

            <div className="flex items-center gap-3 mt-6">
              <a href={settings.socialLinks?.twitter || '#'} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#B7FF00]">
                <Twitter className="w-4 h-4" />
              </a>
              <a href={settings.socialLinks?.linkedin || '#'} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#B7FF00]">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href={settings.socialLinks?.instagram || '#'} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#B7FF00]">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={settings.socialLinks?.youtube || '#'} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#B7FF00]">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#BFC5D2]">
          <div>
            © {new Date().getFullYear()} Smart Move Marketing Agency. All Rights Reserved. Built with React 18, Express & Google Gemini.
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenAudit} className="text-[#B7FF00] hover:underline cursor-pointer font-bold">
              Book Free Audit
            </button>
          </div>
        </div>
      </div>

      {/* Legal Modal */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl glass-card border border-[#B7FF00]/30 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4 uppercase font-mono text-[#B7FF00]">
              {activeLegalModal === 'privacy' && 'Privacy Policy'}
              {activeLegalModal === 'terms' && 'Terms of Service'}
              {activeLegalModal === 'cookie' && 'Cookie Preferences & Telemetry'}
            </h3>

            <div className="text-xs text-gray-300 space-y-3 leading-relaxed">
              <p>
                Smart Move Marketing Agency is committed to protecting your business data, ad account credentials, and lead information.
              </p>
              <p>
                <strong>1. Data Collection:</strong> We process lead submission data solely to generate 15-point ad tear-downs and conduct strategy discovery calls. We never sell or distribute your contact details to third-party data brokers.
              </p>
              <p>
                <strong>2. Security Standards:</strong> All backend API communications use encrypted SSL pipelines. Admin sessions are secured with Bearer token authentication.
              </p>
              <p>
                <strong>3. Service Warranties:</strong> Performance ROAS guarantees are subject to agreed minimum ad spend thresholds and creative execution guidelines defined in custom client service agreements.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-5 py-2 rounded-xl bg-[#B7FF00] text-black font-extrabold text-xs cursor-pointer"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
