import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Lock, Users, FileText, Settings, BarChart3, Search, Download,
  Plus, Edit, Trash2, Check, X, RefreshCw, LogOut, ArrowUpRight, Filter, Eye, MessageSquare, TrendingUp, Upload, Image, HelpCircle, Briefcase, DollarSign, Award, Building, Phone, Mail, MapPin, Loader2
} from 'lucide-react';
import { Lead, BlogPost, SiteSettings, AnalyticsData, PricingPackage, TeamMember, Testimonial, ServiceItem, CaseStudy, TrustedCompany, FAQItem, MediaItem } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
  onRefreshSiteData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onRefreshSiteData }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('smartmove_admin_token'));
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'settings' | 'services' | 'portfolio' | 'team' | 'testimonials' | 'pricing' | 'blog' | 'companies' | 'faqs' | 'media' | 'leads'>('analytics');

  // Notification Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'loading' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'loading' = 'success', duration = 3000) => {
    setToast({ message, type });
    if (type !== 'loading') {
      setTimeout(() => setToast(null), duration);
    }
  };

  // Data States
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsFilter, setLeadsFilter] = useState('All');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [portfolio, setPortfolio] = useState<CaseStudy[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pricing, setPricing] = useState<PricingPackage[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [trustedCompanies, setTrustedCompanies] = useState<TrustedCompany[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);

  // Lead Detail / Edit States
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [resendingId, setResendingId] = useState<string | null>(null);

  // Modal & Editing States
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [modalType, setModalType] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<{ type: string; id: string; name: string } | null>(null);

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    showToast('Authenticating...', 'loading');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');

      setToken(data.token);
      localStorage.setItem('smartmove_admin_token', data.token);
      showToast('Login successful!', 'success');
    } catch (err: any) {
      setLoginError(err.message || 'Invalid password.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('smartmove_admin_token');
    showToast('Logged out successfully', 'success');
  };

  const fetchAllData = async () => {
    if (!token) return;
    try {
      const [leadsRes, analyticsRes, settingsRes, blogRes, mediaRes, trustedRes, faqsRes, servicesRes, portfolioRes, teamRes, testimonialsRes, pricingRes] = await Promise.all([
        fetch('/api/leads', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/analytics', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/site-settings'),
        fetch('/api/blog?all=true'),
        fetch('/api/admin/media', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/trusted-companies'),
        fetch('/api/faqs'),
        fetch('/api/services'),
        fetch('/api/portfolio'),
        fetch('/api/team'),
        fetch('/api/testimonials'),
        fetch('/api/pricing')
      ]);

      if (leadsRes.ok) setLeads((await leadsRes.json()).leads || []);
      if (analyticsRes.ok) setAnalytics((await analyticsRes.json()).analytics);
      if (blogRes.ok) setBlogPosts((await blogRes.json()).blogPosts || []);
      if (mediaRes.ok) setMediaLibrary((await mediaRes.json()).media || []);
      if (trustedRes.ok) setTrustedCompanies((await trustedRes.json()).trustedCompanies || []);
      if (faqsRes.ok) setFaqs((await faqsRes.json()).faqs || []);
      if (servicesRes.ok) setServices((await servicesRes.json()).services || []);
      if (portfolioRes.ok) setPortfolio((await portfolioRes.json()).caseStudies || []);
      if (teamRes.ok) setTeam((await teamRes.json()).team || []);
      if (testimonialsRes.ok) setTestimonials((await testimonialsRes.json()).testimonials || []);
      if (pricingRes.ok) setPricing((await pricingRes.json()).pricing || []);

      if (settingsRes.ok) {
        const sData = await settingsRes.json();
        if (sData.settings) setSiteSettings(sData.settings);
      }
    } catch (e) {
      console.error('Error fetching CMS data:', e);
    }
  };

  // --- GENERAL SAVE SETTINGS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings || !token) return;
    showToast('Saving site settings...', 'loading');
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(siteSettings)
      });
      if (!res.ok) throw new Error('Failed to save settings');
      showToast('Site settings updated successfully!', 'success');
      onRefreshSiteData();
    } catch (err: any) {
      showToast(err.message || 'Error saving settings', 'error');
    }
  };

  // --- FILE UPLOAD HANDLER ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, onUrlResult: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast('File size must be under 15MB', 'error');
      return;
    }

    showToast('Uploading asset to server...', 'loading');
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Url = reader.result as string;
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name: file.name, url: base64Url })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        showToast('File uploaded and saved permanently!', 'success');
        fetchAllData();
        onUrlResult(data.item.url);
      } catch (err: any) {
        showToast(err.message || 'Upload failed', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  // --- CRUD SUBMIT HANDLER ---
  const handleSaveModalItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalType || !currentItem || !token) return;
    showToast('Saving to database...', 'loading');

    let endpoint = '';
    let method = modalMode === 'add' ? 'POST' : 'PUT';
    let urlId = modalMode === 'edit' && currentItem.id ? `/${currentItem.id}` : '';

    switch (modalType) {
      case 'services': endpoint = `/api/admin/services${urlId}`; break;
      case 'portfolio': endpoint = `/api/admin/portfolio${urlId}`; break;
      case 'team': endpoint = `/api/admin/team${urlId}`; break;
      case 'testimonials': endpoint = `/api/admin/testimonials${urlId}`; break;
      case 'pricing': endpoint = `/api/admin/pricing${urlId}`; break;
      case 'blog': endpoint = `/api/admin/blog${urlId}`; break;
      case 'companies': endpoint = `/api/admin/trusted-companies${urlId}`; break;
      case 'faqs': endpoint = `/api/admin/faqs${urlId}`; break;
      default: return;
    }

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(currentItem)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Operation failed');

      showToast('Successfully saved item!', 'success');
      setModalMode(null);
      setCurrentItem(null);
      fetchAllData();
      onRefreshSiteData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save', 'error');
    }
  };

  // --- DELETE HANDLER ---
  const confirmDelete = async () => {
    if (!deleteConfirmId || !token) return;
    showToast('Deleting item...', 'loading');
    let endpoint = '';

    switch (deleteConfirmId.type) {
      case 'services': endpoint = `/api/admin/services/${deleteConfirmId.id}`; break;
      case 'portfolio': endpoint = `/api/admin/portfolio/${deleteConfirmId.id}`; break;
      case 'team': endpoint = `/api/admin/team/${deleteConfirmId.id}`; break;
      case 'testimonials': endpoint = `/api/admin/testimonials/${deleteConfirmId.id}`; break;
      case 'pricing': endpoint = `/api/admin/pricing/${deleteConfirmId.id}`; break;
      case 'blog': endpoint = `/api/admin/blog/${deleteConfirmId.id}`; break;
      case 'companies': endpoint = `/api/admin/trusted-companies/${deleteConfirmId.id}`; break;
      case 'faqs': endpoint = `/api/admin/faqs/${deleteConfirmId.id}`; break;
      case 'media': endpoint = `/api/admin/media/${deleteConfirmId.id}`; break;
      case 'leads': endpoint = `/api/admin/leads/${deleteConfirmId.id}`; break;
      default: return;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete item');

      showToast('Permanently deleted from database!', 'success');
      setDeleteConfirmId(null);
      fetchAllData();
      onRefreshSiteData();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleUpdateLead = async (leadId: string, updates: Partial<Lead>) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update lead');
      
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...updates } : l));
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, ...updates } : null);
      }
      showToast('Lead updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const handleResendEmail = async (leadId: string) => {
    setResendingId(leadId);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/resend-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend email');
      
      if (data.lead) {
        setLeads(prev => prev.map(l => l.id === leadId ? data.lead : l));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(data.lead);
        }
      }
      showToast('Lead notification email sent successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Resend failed', 'error');
    } finally {
      setResendingId(null);
    }
  };

  if (!token) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <div className="relative w-full max-w-md p-8 glass-card border border-cyan-500/30 rounded-3xl shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-3 border border-cyan-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Admin CMS Portal</h2>
            <p className="text-sm text-gray-400 mt-1">Enter master password to access professional CMS</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Admin Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm"
                  required
                />
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-sm tracking-wide shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              {loggingIn ? 'Authenticating...' : 'Access Admin CMS'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-[#0B0F17] text-gray-100 overflow-hidden animate-fadeIn">
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md animate-bounce ${
          toast.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' :
          toast.type === 'error' ? 'bg-red-500/20 border-red-500/40 text-red-300' :
          'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
        }`}>
          {toast.type === 'loading' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-72 bg-gray-950/80 border-r border-gray-800/80 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-gray-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-black font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-white text-sm tracking-wider">SMART MOVE CMS</h1>
                <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Professional Edition</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
            {[
              { id: 'analytics', label: 'Dashboard & Leads', icon: BarChart3 },
              { id: 'settings', label: 'Site Settings & Hero', icon: Settings },
              { id: 'services', label: 'Services CRUD', icon: Briefcase },
              { id: 'portfolio', label: 'Portfolio / Case Studies', icon: Award },
              { id: 'team', label: 'Team Members', icon: Users },
              { id: 'testimonials', label: 'Testimonials & Reviews', icon: MessageSquare },
              { id: 'pricing', label: 'Pricing Packages', icon: DollarSign },
              { id: 'blog', label: 'Blog & Articles', icon: FileText },
              { id: 'companies', label: 'Trusted Companies', icon: Building },
              { id: 'faqs', label: 'FAQs Management', icon: HelpCircle },
              { id: 'media', label: 'Media Library & Upload', icon: Image },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg' : 'text-gray-400 hover:bg-gray-900/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-gray-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800/80 flex items-center justify-between bg-gray-900/40">
          <button onClick={fetchAllData} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white">
            <RefreshCw className="w-3.5 h-3.5" /> Sync Data
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#070A0F]">
        {/* Top Header */}
        <header className="h-16 px-8 border-b border-gray-800/80 bg-gray-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Active Module: {activeTab.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-lg cursor-pointer"
            >
              Exit to Live Website ↗
            </button>
          </div>
        </header>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* 1. ANALYTICS & LEADS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Visitors', value: analytics?.visitors || 0, icon: TrendingUp, color: 'text-cyan-400' },
                  { label: 'Growth Leads', value: analytics?.leads || 0, icon: Users, color: 'text-emerald-400' },
                  { label: 'Conversion Rate', value: `${analytics?.conversionRate || 0}%`, icon: BarChart3, color: 'text-purple-400' },
                  { label: 'AI Strategist Usage', value: analytics?.aiChatUsage || 0, icon: MessageSquare, color: 'text-blue-400' },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="p-6 rounded-2xl glass-card border border-gray-800/80">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-gray-400 font-medium">{stat.label}</span>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div className="text-3xl font-black text-white">{stat.value}</div>
                    </div>
                  );
                })}
              </div>

              {/* Leads Table */}
              <div className="glass-card border border-gray-800/80 rounded-3xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Submitted Audit Requests & Leads</h3>
                    <p className="text-xs text-gray-400">Live submissions from your website forms and chat</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search Field */}
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search leads..."
                        value={leadsSearch}
                        onChange={(e) => setLeadsSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-300 focus:outline-none focus:border-[#B7FF00] w-48 transition-colors"
                      />
                    </div>

                    {/* Filter Dropdown */}
                    <select
                      value={leadsFilter}
                      onChange={(e) => setLeadsFilter(e.target.value)}
                      className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-300 focus:outline-none focus:border-[#B7FF00] transition-colors"
                    >
                      <option value="All">All Statuses</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Converted">Converted</option>
                      <option value="Archived">Archived</option>
                    </select>

                    {/* Export Actions */}
                    <button
                      onClick={() => {
                        if (leads.length === 0) {
                          showToast('No leads available to export', 'error');
                          return;
                        }
                        const headers = ['ID', 'Name', 'Email', 'Phone', 'WhatsApp', 'Business', 'Website', 'Package', 'Budget', 'Service', 'Status', 'Date', 'Referring Page', 'Message', 'Notes'];
                        const rows = leads.map(l => [
                          l.id,
                          l.name,
                          l.email,
                          l.phone || '',
                          l.whatsapp || '',
                          l.business,
                          l.website,
                          l.selectedPackage,
                          l.budget,
                          l.service || '',
                          l.status,
                          l.createdAt,
                          l.referringPage || '',
                          (l.message || '').replace(/\n/g, ' '),
                          (l.notes || '').replace(/\n/g, ' ')
                        ]);
                        const csvContent = "data:text/csv;charset=utf-8," 
                          + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `smartmove_leads_${new Date().toISOString().slice(0,10)}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        showToast('Leads exported as CSV!', 'success');
                      }}
                      className="px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs font-bold text-[#B7FF00] hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                      title="Export CSV"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>CSV</span>
                    </button>
                    <button
                      onClick={() => {
                        if (leads.length === 0) {
                          showToast('No leads available to export', 'error');
                          return;
                        }
                        let excelTemplate = `
                          <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                          <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Leads</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
                          <body>
                            <table border="1">
                              <tr style="background-color: #B7FF00; font-weight: bold;">
                                <td>ID</td>
                                <td>Name</td>
                                <td>Email</td>
                                <td>Phone</td>
                                <td>WhatsApp</td>
                                <td>Business</td>
                                <td>Website</td>
                                <td>Package</td>
                                <td>Budget</td>
                                <td>Service</td>
                                <td>Status</td>
                                <td>Date</td>
                                <td>Referring Page</td>
                                <td>Message</td>
                                <td>Notes</td>
                              </tr>
                        `;
                        leads.forEach(l => {
                          excelTemplate += `
                            <tr>
                              <td>${l.id}</td>
                              <td>${l.name}</td>
                              <td>${l.email}</td>
                              <td>${l.phone || ''}</td>
                              <td>${l.whatsapp || ''}</td>
                              <td>${l.business}</td>
                              <td>${l.website}</td>
                              <td>${l.selectedPackage}</td>
                              <td>${l.budget}</td>
                              <td>${l.service || ''}</td>
                              <td>${l.status}</td>
                              <td>${l.createdAt}</td>
                              <td>${l.referringPage || ''}</td>
                              <td>${l.message || ''}</td>
                              <td>${l.notes || ''}</td>
                            </tr>
                          `;
                        });
                        excelTemplate += `</table></body></html>`;
                        const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `smartmove_leads_${new Date().toISOString().slice(0,10)}.xls`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        showToast('Leads exported as Excel!', 'success');
                      }}
                      className="px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs font-bold text-[#B7FF00] hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                      title="Export Excel"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Excel</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-[11px] font-mono text-gray-400 uppercase">
                        <th className="py-3 px-4">Client & Business</th>
                        <th className="py-3 px-4">Selected Package</th>
                        <th className="py-3 px-4">Budget</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60 text-xs">
                      {leads
                        .filter(lead => {
                          const matchesFilter = leadsFilter === 'All' || lead.status === leadsFilter;
                          const searchLower = leadsSearch.toLowerCase();
                          const matchesSearch = !leadsSearch ||
                            (lead.name || '').toLowerCase().includes(searchLower) ||
                            (lead.email || '').toLowerCase().includes(searchLower) ||
                            (lead.business || '').toLowerCase().includes(searchLower) ||
                            (lead.selectedPackage || '').toLowerCase().includes(searchLower) ||
                            (lead.phone || '').toLowerCase().includes(searchLower) ||
                            (lead.message || '').toLowerCase().includes(searchLower);
                          return matchesFilter && matchesSearch;
                        })
                        .length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-gray-500">
                            No matching leads found.
                          </td>
                        </tr>
                      ) : (
                        leads
                          .filter(lead => {
                            const matchesFilter = leadsFilter === 'All' || lead.status === leadsFilter;
                            const searchLower = leadsSearch.toLowerCase();
                            const matchesSearch = !leadsSearch ||
                              (lead.name || '').toLowerCase().includes(searchLower) ||
                              (lead.email || '').toLowerCase().includes(searchLower) ||
                              (lead.business || '').toLowerCase().includes(searchLower) ||
                              (lead.selectedPackage || '').toLowerCase().includes(searchLower) ||
                              (lead.phone || '').toLowerCase().includes(searchLower) ||
                              (lead.message || '').toLowerCase().includes(searchLower);
                            return matchesFilter && matchesSearch;
                          })
                          .map((lead) => (
                            <tr key={lead.id} className="hover:bg-gray-900/40 transition-colors">
                              <td className="py-4 px-4">
                                <div className="font-bold text-white">{lead.name}</div>
                                <div className="text-gray-400">{lead.business} ({lead.email})</div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  {lead.emailSent ? (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/10">
                                      Email Sent
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-rose-500/15 text-rose-400 border border-rose-500/10 cursor-help" title={lead.emailError || "SMTP configuration or sending issue"}>
                                      Email Failed
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4 font-medium text-cyan-400">{lead.selectedPackage}</td>
                              <td className="py-4 px-4 text-gray-300">{lead.budget}</td>
                              <td className="py-4 px-4">
                                <select
                                  value={lead.status}
                                  onChange={(e) => handleUpdateLead(lead.id, { status: e.target.value as any })}
                                  className={`px-2 py-1 rounded-lg bg-gray-900 border border-gray-800 text-[10px] font-bold focus:outline-none cursor-pointer ${
                                    lead.status === 'New' ? 'text-cyan-400' :
                                    lead.status === 'Converted' ? 'text-emerald-400' :
                                    lead.status === 'Contacted' ? 'text-purple-400' :
                                    'text-gray-400'
                                  }`}
                                >
                                  <option value="New">New</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Converted">Converted</option>
                                  <option value="Archived">Archived</option>
                                </select>
                              </td>
                              <td className="py-4 px-4 text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
                              <td className="py-4 px-4 text-right space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setEditedNotes(lead.notes || '');
                                    setIsEditingNotes(false);
                                  }}
                                  className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                                  title="View Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId({ type: 'leads', id: lead.id, name: lead.name })}
                                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                  title="Delete Lead"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. SITE SETTINGS & HERO TAB */}
          {activeTab === 'settings' && siteSettings && (
            <div className="max-w-3xl space-y-8 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold text-white">Global Site Settings & Hero CMS</h3>
                <p className="text-xs text-gray-400">Update headings, contact information, and brand copy instantly across the website</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 glass-card p-8 rounded-3xl border border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Logo Text / Agency Name</label>
                    <input
                      type="text"
                      value={siteSettings.logoText}
                      onChange={(e) => setSiteSettings({ ...siteSettings, logoText: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={siteSettings.contactEmail}
                      onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Hero Headline</label>
                  <textarea
                    rows={2}
                    value={siteSettings.heroHeadline}
                    onChange={(e) => setSiteSettings({ ...siteSettings, heroHeadline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Hero Subheadline</label>
                  <textarea
                    rows={3}
                    value={siteSettings.heroSubheadline}
                    onChange={(e) => setSiteSettings({ ...siteSettings, heroSubheadline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={siteSettings.contactPhone}
                      onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Office Address</label>
                    <input
                      type="text"
                      value={siteSettings.officeAddress}
                      onChange={(e) => setSiteSettings({ ...siteSettings, officeAddress: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-6 space-y-4">
                  <h4 className="text-sm font-bold text-[#B7FF00] uppercase tracking-wider font-mono">Website Section Headings</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Trusted Companies Heading</label>
                      <input
                        type="text"
                        value={siteSettings.trustedCompaniesHeading || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, trustedCompaniesHeading: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Services Heading</label>
                      <input
                        type="text"
                        value={siteSettings.servicesHeading || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, servicesHeading: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Portfolio Heading</label>
                      <input
                        type="text"
                        value={siteSettings.portfolioHeading || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, portfolioHeading: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Team Heading</label>
                      <input
                        type="text"
                        value={siteSettings.teamHeading || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, teamHeading: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Pricing Heading</label>
                      <input
                        type="text"
                        value={siteSettings.pricingHeading || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, pricingHeading: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Testimonials Heading</label>
                      <input
                        type="text"
                        value={siteSettings.testimonialsHeading || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, testimonialsHeading: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">FAQ Heading</label>
                      <input
                        type="text"
                        value={siteSettings.faqHeading || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, faqHeading: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Blog Heading</label>
                      <input
                        type="text"
                        value={siteSettings.blogHeading || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, blogHeading: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-sm shadow-lg hover:brightness-110 transition-all cursor-pointer"
                  >
                    Save All Settings & Sync Live Site
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. SERVICES CRUD TAB */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Services Management</h3>
                  <p className="text-xs text-gray-400">Add, edit, or delete core agency capabilities</p>
                </div>
                <button
                  onClick={() => {
                    setModalMode('add');
                    setModalType('services');
                    setCurrentItem({ title: '', iconName: 'Zap', shortDesc: '', fullDesc: '', tagline: '', startingPrice: '', features: [''] });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Service
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="p-6 rounded-3xl glass-card border border-gray-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          {service.tagline}
                        </span>
                        <span className="text-xs font-bold text-emerald-400">{service.startingPrice}</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">{service.title}</h4>
                      <p className="text-xs text-gray-400 mb-4">{service.shortDesc}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-800 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setModalMode('edit');
                          setModalType('services');
                          setCurrentItem(service);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId({ type: 'services', id: service.id, name: service.title })}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. PORTFOLIO / CASE STUDIES CRUD TAB */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Portfolio Case Studies</h3>
                  <p className="text-xs text-gray-400">Showcase high-converting client success stories</p>
                </div>
                <button
                  onClick={() => {
                    setModalMode('add');
                    setModalType('portfolio');
                    setCurrentItem({ title: '', client: '', category: 'Paid Ads', image: '', roas: '5x', growthMetric: '+300%', description: '', challenge: '', solution: '', results: [''] });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Case Study
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolio.map((item) => (
                  <div key={item.id} className="p-6 rounded-3xl glass-card border border-gray-800 flex flex-col justify-between">
                    <div>
                      <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-gray-900 border border-gray-800 relative">
                        <img loading="lazy" decoding="async" src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-xs text-cyan-400 font-medium mb-2">Client: {item.client}</p>
                      <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-800 flex items-center justify-between">
                      <span className="text-xs font-mono text-emerald-400 font-bold">ROAS: {item.roas}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setModalMode('edit');
                            setModalType('portfolio');
                            setCurrentItem(item);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId({ type: 'portfolio', id: item.id, name: item.title })}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. TEAM CRUD TAB */}
          {activeTab === 'team' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Team Members</h3>
                  <p className="text-xs text-gray-400">Manage agency leadership and expert growth team</p>
                </div>
                <button
                  onClick={() => {
                    setModalMode('add');
                    setModalType('team');
                    setCurrentItem({ name: '', role: '', image: '', bio: '', specialization: '' });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Team Member
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {team.map((member) => (
                  <div key={member.id} className="p-6 rounded-3xl glass-card border border-gray-800 flex flex-col items-center text-center">
                    <img loading="lazy" decoding="async" src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover border-2 border-cyan-500/40 mb-4 shadow-lg" />
                    <h4 className="text-base font-bold text-white">{member.name}</h4>
                    <p className="text-xs text-cyan-400 font-medium mb-2">{member.role}</p>
                    <p className="text-xs text-gray-400 mb-6 line-clamp-3">{member.bio}</p>

                    <div className="w-full pt-4 border-t border-gray-800 flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setModalMode('edit');
                          setModalType('team');
                          setCurrentItem(member);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId({ type: 'team', id: member.id, name: member.name })}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. TESTIMONIALS CRUD TAB */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Testimonials & Reviews</h3>
                  <p className="text-xs text-gray-400">Manage founder reviews and success metrics</p>
                </div>
                <button
                  onClick={() => {
                    setModalMode('add');
                    setModalType('testimonials');
                    setCurrentItem({ name: '', role: '', company: '', logo: '', avatar: '', content: '', rating: 5, metric: '' });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Testimonial
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((test) => (
                  <div key={test.id} className="p-6 rounded-3xl glass-card border border-gray-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <img loading="lazy" decoding="async" src={test?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} alt={test?.name || ''} className="w-12 h-12 rounded-full object-cover border border-cyan-500/30" />
                        <div>
                          <h4 className="text-sm font-bold text-white">{test.name}</h4>
                          <p className="text-xs text-gray-400">{test.role}, <span className="text-cyan-400">{test.company}</span></p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 italic mb-4">"{test.content}"</p>
                    </div>

                    <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">{test.metric}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setModalMode('edit');
                            setModalType('testimonials');
                            setCurrentItem(test);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId({ type: 'testimonials', id: test.id, name: test.name })}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. PRICING CRUD TAB */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Pricing Packages</h3>
                  <p className="text-xs text-gray-400">Manage growth retainers and pricing tiers</p>
                </div>
                <button
                  onClick={() => {
                    setModalMode('add');
                    setModalType('pricing');
                    setCurrentItem({ name: '', price: 1500, period: '/mo', description: '', popular: false, recommendedSpend: '', features: [''] });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Package
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricing.map((pkg) => (
                  <div key={pkg.id} className="p-6 rounded-3xl glass-card border border-gray-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-bold text-white">{pkg.name}</h4>
                        {pkg.popular && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">Popular</span>
                        )}
                      </div>
                      <div className="text-2xl font-black text-cyan-400 mb-2">${pkg.price}<span className="text-xs text-gray-400 font-normal">{pkg.period}</span></div>
                      <p className="text-xs text-gray-400 mb-4">{pkg.description}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-800 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setModalMode('edit');
                          setModalType('pricing');
                          setCurrentItem(pkg);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId({ type: 'pricing', id: pkg.id, name: pkg.name })}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. BLOG CRUD TAB */}
          {activeTab === 'blog' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Blog & Articles</h3>
                  <p className="text-xs text-gray-400">Publish thought leadership articles and guides</p>
                </div>
                <button
                  onClick={() => {
                    setModalMode('add');
                    setModalType('blog');
                    setCurrentItem({ title: '', slug: '', category: 'Growth', excerpt: '', content: '', readTime: '5 min read', image: '', published: true, featured: false });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Article
                </button>
              </div>

              <div className="space-y-4">
                {blogPosts.map((post) => (
                  <div key={post.id} className="p-6 rounded-3xl glass-card border border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img loading="lazy" decoding="async" src={post.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80"}
                        alt={post.title}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-800"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80";
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">{post.category}</span>
                          <span className={`text-[10px] font-bold ${post.published ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{post.title}</h4>
                        <p className="text-xs text-gray-400">{post.date} • {post.readTime}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setModalMode('edit');
                          setModalType('blog');
                          setCurrentItem(post);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId({ type: 'blog', id: post.id, name: post.title })}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. TRUSTED COMPANIES CRUD TAB */}
          {activeTab === 'companies' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Trusted Companies & Partner Logos</h3>
                  <p className="text-xs text-gray-400">Manage marquee client logos displayed on the homepage</p>
                </div>
                <button
                  onClick={() => {
                    setModalMode('add');
                    setModalType('companies');
                    setCurrentItem({ name: '', logo: '' });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Company Logo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {trustedCompanies.map((comp) => (
                  <div key={comp.id} className="p-6 rounded-3xl glass-card border border-gray-800 flex flex-col items-center text-center">
                    <img loading="lazy" decoding="async" src={comp.logo} alt={comp.name} className="w-16 h-16 rounded-xl object-cover mb-3 border border-gray-800" />
                    <h4 className="text-sm font-bold text-white mb-4">{comp.name}</h4>
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => {
                          setModalMode('edit');
                          setModalType('companies');
                          setCurrentItem(comp);
                        }}
                        className="flex-1 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId({ type: 'companies', id: comp.id, name: comp.name })}
                        className="flex-1 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. FAQS CRUD TAB */}
          {activeTab === 'faqs' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">FAQs Management</h3>
                  <p className="text-xs text-gray-400">Manage frequently asked questions</p>
                </div>
                <button
                  onClick={() => {
                    setModalMode('add');
                    setModalType('faqs');
                    setCurrentItem({ question: '', answer: '' });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add FAQ
                </button>
              </div>

              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="p-6 rounded-3xl glass-card border border-gray-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">{faq.question}</h4>
                      <p className="text-xs text-gray-400">{faq.answer}</p>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-4">
                      <button
                        onClick={() => {
                          setModalMode('edit');
                          setModalType('faqs');
                          setCurrentItem(faq);
                        }}
                        className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                        title="Edit FAQ"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId({ type: 'faqs', id: faq.id, name: faq.question })}
                        className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. MEDIA LIBRARY & UPLOAD TAB */}
          {activeTab === 'media' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Professional Media Library & Uploads</h3>
                  <p className="text-xs text-gray-400">Upload images, videos, and PDFs directly from your PC with permanent server persistence</p>
                </div>
                <label className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer">
                  <Upload className="w-4 h-4" /> Upload File From PC
                  <input type="file" onChange={(e) => handleFileUpload(e, () => {})} className="hidden" accept="image/*,video/*,application/pdf" />
                </label>
              </div>

              {/* Drag and Drop Zone */}
              <div className="p-12 rounded-3xl border-2 border-dashed border-gray-700 hover:border-cyan-500 bg-gray-900/40 text-center transition-all relative">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, () => {})}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*,video/*,application/pdf"
                />
                <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-3 border border-cyan-500/20">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Drag and drop any image, video, or PDF here</h4>
                <p className="text-xs text-gray-400">Supports PNG, JPG, WEBP, MP4, PDF up to 15MB with unique filename generation</p>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {mediaLibrary.map((item) => (
                  <div key={item.id} className="p-4 rounded-3xl glass-card border border-gray-800 flex flex-col justify-between group">
                    <div>
                      <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-900 border border-gray-800 relative">
                        {item.type?.includes('video') ? (
                          <div className="w-full h-full flex items-center justify-center bg-black text-cyan-400 font-bold text-xs">VIDEO</div>
                        ) : (
                          <img loading="lazy" decoding="async" src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        )}
                      </div>
                      <h5 className="text-xs font-bold text-white truncate mb-1">{item.name}</h5>
                      <p className="text-[10px] text-gray-400 font-mono">URL: {item.url}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-gray-800 flex items-center justify-between">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.origin + item.url);
                          showToast('URL copied to clipboard!', 'success');
                        }}
                        className="text-[10px] text-cyan-400 hover:underline font-semibold"
                      >
                        Copy URL
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId({ type: 'media', id: item.id, name: item.name })}
                        className="p-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- CRUD MODAL (ADD / EDIT) --- */}
      {modalMode && modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl p-8 glass-card border border-gray-800 rounded-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setModalMode(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4">
              {modalMode === 'add' ? `Add New ${modalType.slice(0, -1)}` : `Edit ${modalType.slice(0, -1)}`}
            </h3>

            <form onSubmit={handleSaveModalItem} className="space-y-4">
              {/* Dynamic form inputs based on modalType */}
              {modalType === 'services' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Service Title</label>
                    <input
                      type="text"
                      value={currentItem?.title || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={currentItem?.tagline || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, tagline: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Starting Price</label>
                    <input
                      type="text"
                      value={currentItem?.startingPrice || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, startingPrice: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={currentItem?.shortDesc || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, shortDesc: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                    />
                  </div>
                </>
              )}

              {modalType === 'portfolio' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Project Title</label>
                    <input
                      type="text"
                      value={currentItem?.title || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Client Name</label>
                    <input
                      type="text"
                      value={currentItem?.client || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, client: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Image URL (or upload from PC)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentItem?.image || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, image: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                        required
                      />
                      <label className="px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                        <Upload className="w-4 h-4" /> Upload
                        <input type="file" onChange={(e) => handleFileUpload(e, (url) => setCurrentItem({ ...currentItem, image: url }))} className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">ROAS / Metric</label>
                    <input
                      type="text"
                      value={currentItem?.roas || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, roas: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={currentItem?.description || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                    />
                  </div>
                </>
              )}

              {modalType === 'team' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={currentItem?.name || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Role</label>
                    <input
                      type="text"
                      value={currentItem?.role || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, role: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Avatar Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentItem?.image || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, image: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                        required
                      />
                      <label className="px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                        <Upload className="w-4 h-4" /> Upload
                        <input type="file" onChange={(e) => handleFileUpload(e, (url) => setCurrentItem({ ...currentItem, image: url }))} className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Bio</label>
                    <textarea
                      rows={2}
                      value={currentItem?.bio || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, bio: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                    />
                  </div>
                </>
              )}

              {modalType === 'testimonials' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Client Name</label>
                    <input
                      type="text"
                      value={currentItem?.name || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Role & Company</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Role"
                        value={currentItem?.role || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, role: e.target.value })}
                        className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={currentItem?.company || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, company: e.target.value })}
                        className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Avatar Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentItem?.avatar || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, avatar: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                        required
                      />
                      <label className="px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                        <Upload className="w-4 h-4" /> Upload
                        <input type="file" onChange={(e) => handleFileUpload(e, (url) => setCurrentItem({ ...currentItem, avatar: url }))} className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Review Content</label>
                    <textarea
                      rows={3}
                      value={currentItem?.content || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, content: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Metric Highlight</label>
                    <input
                      type="text"
                      value={currentItem?.metric || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, metric: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                    />
                  </div>
                </>
              )}

              {modalType === 'pricing' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Package Name</label>
                    <input
                      type="text"
                      value={currentItem?.name || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Price ($)</label>
                      <input
                        type="number"
                        value={currentItem?.price || 0}
                        onChange={(e) => setCurrentItem({ ...currentItem, price: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Period</label>
                      <input
                        type="text"
                        value={currentItem?.period || '/mo'}
                        onChange={(e) => setCurrentItem({ ...currentItem, period: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={currentItem?.description || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                    />
                  </div>
                </>
              )}

              {modalType === 'blog' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Article Title</label>
                    <input
                      type="text"
                      value={currentItem?.title || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Category</label>
                    <input
                      type="text"
                      value={currentItem?.category || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Featured Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentItem?.image || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, image: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                        required
                      />
                      <label className="px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                        <Upload className="w-4 h-4" /> Upload
                        <input type="file" onChange={(e) => handleFileUpload(e, (url) => setCurrentItem({ ...currentItem, image: url }))} className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Excerpt</label>
                    <textarea
                      rows={2}
                      value={currentItem?.excerpt || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, excerpt: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                    />
                  </div>
                </>
              )}

              {modalType === 'companies' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={currentItem?.name || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Logo URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentItem?.logo || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, logo: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                        required
                      />
                      <label className="px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                        <Upload className="w-4 h-4" /> Upload
                        <input type="file" onChange={(e) => handleFileUpload(e, (url) => setCurrentItem({ ...currentItem, logo: url }))} className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                </>
              )}

              {modalType === 'faqs' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Question</label>
                    <input
                      type="text"
                      value={currentItem?.question || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, question: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Answer</label>
                    <textarea
                      rows={3}
                      value={currentItem?.answer || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, answer: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-lg"
                >
                  Save Item Permanently
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md p-6 glass-card border border-red-500/40 rounded-3xl text-center">
            <div className="inline-flex p-3 rounded-2xl bg-red-500/10 text-red-400 mb-3 border border-red-500/20">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Confirm Permanent Deletion</h3>
            <p className="text-xs text-gray-400 mb-6">
              Are you sure you want to delete <span className="text-white font-semibold">"{deleteConfirmId.name}"</span>? This action cannot be undone and will update the live website immediately.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-lg"
              >
                Yes, Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- LEAD DETAIL & NOTES MODAL --- */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl p-8 bg-[#090e15] border border-cyan-500/20 rounded-3xl shadow-2xl my-8">
            <button 
              onClick={() => setSelectedLead(null)} 
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white rounded-lg bg-gray-900 border border-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">Lead ID: {selectedLead.id}</span>
              <h3 className="text-2xl font-black text-white">{selectedLead.name}</h3>
              <p className="text-xs text-gray-400">{selectedLead.business} &bull; {selectedLead.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs text-gray-300">
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800/80">
                <span className="text-gray-500 block font-semibold mb-1">Selected Package</span>
                <span className="text-cyan-400 font-bold text-sm">{selectedLead.selectedPackage}</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800/80">
                <span className="text-gray-500 block font-semibold mb-1">Monthly Budget</span>
                <span className="text-emerald-400 font-bold text-sm">{selectedLead.budget}</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800/80">
                <span className="text-gray-500 block font-semibold mb-1">Phone Number</span>
                <span>{selectedLead.phone || 'N/A'}</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800/80">
                <span className="text-gray-500 block font-semibold mb-1">WhatsApp Number</span>
                <span>{selectedLead.whatsapp || 'N/A'}</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800/80">
                <span className="text-gray-500 block font-semibold mb-1">Referring Page / URL</span>
                <span className="break-all font-mono text-[10px]">{selectedLead.referringPage || 'N/A'}</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800/80">
                <span className="text-gray-500 block font-semibold mb-1">Location / IP Address</span>
                <span>{selectedLead.country || 'Pakistan'} &bull; <span className="font-mono text-[10px]">{selectedLead.ip || 'Unknown'}</span></span>
              </div>
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800/80">
                <span className="text-gray-500 block font-semibold mb-1">Device & Browser</span>
                <span>{selectedLead.device || 'N/A'} &bull; {selectedLead.browser || 'N/A'}</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800/80">
                <span className="text-gray-500 block font-semibold mb-1">Submission Date</span>
                <span>{new Date(selectedLead.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Email Notification Status */}
            <div className="p-4 rounded-xl bg-gray-900 border border-gray-800/80 mb-6 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-gray-400 block font-bold mb-1">Email Notification Status</span>
                <div className="flex flex-wrap items-center gap-2">
                  {selectedLead.emailSent ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/10">
                      Sent to muslimstudent1991@gmail.com
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/10">
                      Failed / Pending Delivery
                    </span>
                  )}
                  {selectedLead.emailError && (
                    <span className="text-rose-400/80 text-[10px] font-mono">
                      (Error: {selectedLead.emailError})
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleResendEmail(selectedLead.id)}
                disabled={resendingId === selectedLead.id}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/20 font-bold transition-colors disabled:opacity-50 text-[10px] flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {resendingId === selectedLead.id ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Resending...
                  </>
                ) : (
                  <>
                    <Mail className="w-3 h-3" />
                    Resend Notification
                  </>
                )}
              </button>
            </div>

            {selectedLead.goals && selectedLead.goals.length > 0 && (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 mb-6 text-xs">
                <span className="text-emerald-400 block font-bold mb-1.5">Objectives / Goals</span>
                <ul className="list-disc pl-4 space-y-1 text-gray-300">
                  {selectedLead.goals.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </div>
            )}

            {selectedLead.message && (
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800/80 mb-6 text-xs">
                <span className="text-gray-400 block font-bold mb-1.5">User Message</span>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedLead.message}</p>
              </div>
            )}

            {/* Admin Notes Section */}
            <div className="p-4 rounded-xl bg-[#0e1622] border border-[#B7FF00]/10 mb-6 text-xs">
              <span className="text-[#B7FF00] block font-bold mb-1.5">Internal Admin Notes</span>
              {isEditingNotes ? (
                <div>
                  <textarea
                    rows={4}
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    placeholder="Enter confidential follow-up notes, conversation logs, or status changes here..."
                    className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs mb-2 focus:outline-none focus:border-[#B7FF00]"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateLead(selectedLead.id, { notes: editedNotes })}
                      className="px-3 py-1.5 rounded-lg bg-[#B7FF00] text-black font-bold text-[10px]"
                    >
                      Save Notes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingNotes(false);
                        setEditedNotes(selectedLead.notes || '');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-[10px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <p className="text-gray-300 italic leading-relaxed">
                    {selectedLead.notes || 'No notes added yet. Add notes to keep track of calls, audits, and email outcomes.'}
                  </p>
                  <button
                    onClick={() => {
                      setIsEditingNotes(true);
                      setEditedNotes(selectedLead.notes || '');
                    }}
                    className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-[#B7FF00] font-bold text-[10px] shrink-0"
                  >
                    Edit Notes
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Lead Status:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleUpdateLead(selectedLead.id, { status: e.target.value as any })}
                  className="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs text-[#B7FF00] font-bold focus:outline-none cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Converted">Converted</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
