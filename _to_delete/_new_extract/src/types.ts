export interface Lead {
  id: string;
  name: string;
  email: string;
  business: string;
  website: string;
  budget: string;
  selectedPackage: string;
  goals: string[];
  status: 'New' | 'Contacted' | 'Converted' | 'Archived';
  createdAt: string;
  notes?: string;
  phone?: string;
  whatsapp?: string;
  message?: string;
  service?: string;
  referringPage?: string;
  ip?: string;
  browser?: string;
  device?: string;
  country?: string;
  uploadedFiles?: string[];
  emailSent?: boolean;
  emailError?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
  published: boolean;
  featured?: boolean;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: 'Paid Ads' | 'Social Growth' | 'Web & Funnels' | 'Branding';
  image: string;
  videoUrl?: string;
  roas: string;
  growthMetric: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  iconName: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  tagline: string;
  startingPrice: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  specialization: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  logo: string;
  avatar: string;
  content: string;
  rating: number;
  videoThumbnail?: string;
  videoUrl?: string;
  metric: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  popular?: boolean;
  features: string[];
  recommendedSpend: string;
}

export interface AnalyticsData {
  visitors: number;
  leads: number;
  conversionRate: number;
  aiChatUsage: number;
  dailyViews: { date: string; views: number; leads: number }[];
  trafficSources: { name: string; percentage: number }[];
}

export interface SiteSettings {
  heroHeadline: string;
  heroSubheadline: string;
  trustedCompaniesHeading: string;
  servicesHeading: string;
  portfolioHeading: string;
  teamHeading: string;
  pricingHeading: string;
  testimonialsHeading: string;
  faqHeading: string;
  blogHeading: string;
  contactHeading: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  logoText: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface TrustedCompany {
  id: string;
  name: string;
  logo: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  uploadedAt: string;
}

