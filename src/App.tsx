/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ScrollProgressBar, CustomCursorGlow, CookieBanner } from './components/GlobalEnhancements';
import { SiteSettings, ServiceItem, CaseStudy, Testimonial, TeamMember, PricingPackage, BlogPost, TrustedCompany, FAQItem } from './types';
import { initialSiteSettings, initialServices, initialCaseStudies, initialTestimonials, initialTeam, initialPricing, initialBlogPosts, initialTrustedCompanies, initialFaqs } from './data/initialData';
import { X } from 'lucide-react';

const Services = lazy(() => import('./components/Services').then(module => ({ default: module.Services })));
const Portfolio = lazy(() => import('./components/Portfolio').then(module => ({ default: module.Portfolio })));
const ProcessTimeline = lazy(() => import('./components/ProcessTimeline').then(module => ({ default: module.ProcessTimeline })));
const Testimonials = lazy(() => import('./components/Testimonials').then(module => ({ default: module.Testimonials })));
const Team = lazy(() => import('./components/Team').then(module => ({ default: module.Team })));
const Pricing = lazy(() => import('./components/Pricing').then(module => ({ default: module.Pricing })));
const Blog = lazy(() => import('./components/Blog').then(module => ({ default: module.Blog })));
const Contact = lazy(() => import('./components/Contact').then(module => ({ default: module.Contact })));
const AiStrategistChat = lazy(() => import('./components/AiStrategistChat').then(module => ({ default: module.AiStrategistChat })));
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(module => ({ default: module.AdminDashboard })));

export default function App() {
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(initialCaseStudies);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [pricing, setPricing] = useState<PricingPackage[]>(initialPricing);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [trustedCompanies, setTrustedCompanies] = useState<TrustedCompany[]>(initialTrustedCompanies);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [prefilledPackage, setPrefilledPackage] = useState<string | undefined>(undefined);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const isAdminLoggedIn = !!localStorage.getItem('smartmove_admin_token');

  // Log page visitor for analytics & fetch fresh site settings
  useEffect(() => {
    fetchSiteData();
    logVisitor();

    // Check URL route or search query for /admin access
    const urlParams = new URLSearchParams(window.location.search);
    if (window.location.hash === '#admin' || window.location.pathname === '/admin' || urlParams.get('admin') === 'true') {
      setIsAdminOpen(true);
    }
  }, []);

  const fetchSiteData = async () => {
    try {
      const res = await fetch('/api/site-settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
        if (data.services) setServices(data.services);
        if (data.caseStudies) setCaseStudies(data.caseStudies);
        if (data.testimonials) setTestimonials(data.testimonials);
        if (data.team) setTeam(data.team);
        if (data.pricing) setPricing(data.pricing);
        if (data.trustedCompanies) setTrustedCompanies(data.trustedCompanies);
        if (data.faqs) setFaqs(data.faqs);
      }

      const blogRes = await fetch('/api/blog');
      if (blogRes.ok) {
        const blogData = await blogRes.json();
        if (blogData.blogPosts) setBlogPosts(blogData.blogPosts);
      }
    } catch (e) {
      console.warn('Using client fallback data:', e);
    }
  };

  const logVisitor = async () => {
    try {
      await fetch('/api/analytics/log-visitor', { method: 'POST' });
    } catch (e) {
      // Ignore transient logging error
    }
  };

  const scrollToContact = useCallback((pkg?: string) => {
    if (pkg) setPrefilledPackage(pkg);
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 selection:bg-cyan-400 selection:text-black">
      {/* Global Utilities */}
      <ScrollProgressBar />
      <CustomCursorGlow />
      <CookieBanner />

      {/* Floating Header Navbar */}
      <Navbar
        settings={settings}
        onOpenAdmin={useCallback(() => setIsAdminOpen(true), [])}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAudit={scrollToContact}
      />

      {/* Main Sections */}
      <main>
        {/* 1. Hero */}
        <Hero
          settings={settings}
          onOpenAudit={scrollToContact}
          onOpenVideoModal={useCallback((url: string) => setActiveVideoUrl(url), [])}
        />

        {/* 3. Services */}
        <Suspense fallback={<div className="h-32" />}>
          <Services
            services={services}
            onSelectServiceForAudit={useCallback((serviceTitle: string) => scrollToContact(`Service: ${serviceTitle}`), [scrollToContact])}
            heading={settings.servicesHeading}
          />
        </Suspense>

        {/* 4. Portfolio */}
        <Suspense fallback={<div className="h-32" />}>
          <Portfolio
            caseStudies={caseStudies}
            onOpenVideoModal={useCallback((url: string) => setActiveVideoUrl(url), [])}
            onOpenAudit={scrollToContact}
            heading={settings.portfolioHeading}
            settings={settings}
          />
        </Suspense>

        {/* Process Timeline */}
        <Suspense fallback={<div className="h-32" />}>
          <ProcessTimeline onOpenAudit={scrollToContact} />
        </Suspense>

        {/* 5. Testimonials */}
        <Suspense fallback={<div className="h-32" />}>
          <Testimonials
            testimonials={testimonials}
            onOpenVideoModal={useCallback((url: string) => setActiveVideoUrl(url), [])}
            heading={settings.testimonialsHeading}
          />
        </Suspense>

        {/* 6. Team */}
        <Suspense fallback={<div className="h-32" />}>
          <Team
            team={team}
            heading={settings.teamHeading}
            settings={settings}
          />
        </Suspense>

        {/* 7. Pricing */}
        <Suspense fallback={<div className="h-32" />}>
          <Pricing
            packages={pricing}
            onSelectPackage={scrollToContact}
            heading={settings.pricingHeading}
          />
        </Suspense>

        {/* Blog */}
        <Suspense fallback={<div className="h-32" />}>
          <Blog posts={blogPosts} heading={settings.blogHeading} />
        </Suspense>

        {/* 8. Contact Audit Booking Portal */}
        <Suspense fallback={<div className="h-32" />}>
          <Contact
            prefilledPackage={prefilledPackage}
            onLeadSubmitted={useCallback(() => {}, [])}
          />
        </Suspense>
      </main>

      {/* Floating AI Marketing Strategist Chatbot */}
      <Suspense fallback={null}>
        <AiStrategistChat onOpenAudit={scrollToContact} />
      </Suspense>

      {/* Footer */}
      <Suspense fallback={<div className="h-32" />}>
        <Footer
          settings={settings}
          onOpenAdmin={useCallback(() => setIsAdminOpen(true), [])}
          onOpenAudit={scrollToContact}
        />
      </Suspense>

      {/* Admin CMS Modal */}
      {isAdminOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">Loading...</div>}>
          <AdminDashboard
            onClose={useCallback(() => setIsAdminOpen(false), [])}
            onRefreshSiteData={fetchSiteData}
          />
        </Suspense>
      )}

      {/* Global Video Modal */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden glass-card border border-cyan-500/40 shadow-2xl">
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/60 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={activeVideoUrl}
              title="Smart Move Case Study Video"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
