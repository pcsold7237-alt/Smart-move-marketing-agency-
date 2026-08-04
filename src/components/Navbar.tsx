import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onOpenAudit: (pkg?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, onOpenAdmin, isAdminLoggedIn, onOpenAudit }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['hero', 'about', 'services', 'portfolio', 'testimonials', 'team', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#hero', id: 'hero' },
    { name: 'ABOUT US', href: '#about', id: 'about' },
    { name: 'SERVICES', href: '#services', id: 'services' },
    { name: 'PORTFOLIO', href: '#portfolio', id: 'portfolio' },
    { name: 'SUCCESS', href: '#testimonials', id: 'testimonials' },
    { name: 'TEAM', href: '#team', id: 'team' },
    { name: 'CONTACT US', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'py-3.5 glass-nav shadow-lg shadow-black/80' : 'py-5 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Smart Move Marketing Agency Logo */}
          <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#B7FF00] p-0.5 shadow-[0_0_15px_rgba(183,255,0,0.4)] group-hover:scale-105 transition-transform flex items-center justify-center">
              <img loading="eager" decoding="async" src="/cf25f7b8-0d91-4ab0-b025-9920ebc651f3.jpg"
                alt="Smart Move Marketing Agency Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-white font-sans flex items-center gap-1.5">
              {settings.logoText ? (
                <>
                  {settings.logoText.split(' ')[0]} <span className="text-[#B7FF00]">{settings.logoText.split(' ').slice(1).join(' ') || 'Agency'}</span>
                </>
              ) : (
                <>Smart Move <span className="text-[#B7FF00]">Marketing Agency</span></>
              )}
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-xs font-bold tracking-wider transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#B7FF00] border-b-2 border-[#B7FF00] pb-1'
                      : 'text-gray-300 hover:text-[#B7FF00]'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => onOpenAudit()}
              className="px-5 py-2 rounded-full bg-[#B7FF00] text-black font-extrabold text-xs flex items-center gap-2 hover:bg-[#CFFF33] hover:scale-105 transition-all cursor-pointer shadow-[0_0_20px_rgba(183,255,0,0.3)]"
            >
              Get Started
              <div className="w-4 h-4 rounded-full bg-black text-[#B7FF00] flex items-center justify-center">
                <ArrowUpRight className="w-2.5 h-2.5" />
              </div>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-gray-900 border border-white/10 text-gray-200 hover:text-[#B7FF00]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#B7FF00]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-nav border-b border-[#B7FF00]/20 px-6 py-6 transition-all animate-fadeIn">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-bold text-gray-200 hover:text-[#B7FF00] py-2 border-b border-white/5 flex items-center justify-between"
              >
                {link.name}
                <ArrowUpRight className="w-4 h-4 text-[#B7FF00]" />
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAudit();
                }}
                className="w-full py-3 rounded-full bg-[#B7FF00] text-xs font-extrabold text-black flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(183,255,0,0.3)]"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

