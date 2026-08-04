import { BlogPost, CaseStudy, ServiceItem, TeamMember, Testimonial, PricingPackage, SiteSettings, AnalyticsData, Lead } from '../types';

export const initialSiteSettings: SiteSettings = {
  heroHeadline: "Turning Social Media Into Your Business Growth Engine",
  heroSubheadline: "We deploy high-converting ad funnels, viral social strategies, and hyper-targeted creative systems that scale ambitious brands to multi-million revenue.",
  trustedCompaniesHeading: "Trusted By High-Growth Founders & Category Leaders Worldwide",
  servicesHeading: "Our Core Growth Engines & Capabilities",
  portfolioHeading: "Proven Case Studies & Scale Stories",
  teamHeading: "Meet The Masterminds Behind Your Growth Engine",
  pricingHeading: "Predictable Pricing Designed For Maximum Scalable Profit",
  testimonialsHeading: "Clients Reviews",
  faqHeading: "Everything You Need To Know",
  blogHeading: "Latest Growth Insights & Strategies",
  contactHeading: "Book Your Free Growth Audit",
  contactEmail: "hello@smartmoveagency.io",
  contactPhone: "+92 320 2479323",
  officeAddress: "Smart Move Tower, Suite 400, Main Boulevard, Gulberg III, Lahore, Pakistan",
  logoText: "Smart Move Marketing Agency",
  socialLinks: {
    twitter: "https://twitter.com/smartmoveagency",
    linkedin: "https://www.linkedin.com/public-profile/settings",
    instagram: "https://www.instagram.com/smartmove_marketingagency?igsh=MWFjdGI4amo2eG5ndg==",
    youtube: "https://youtube.com/@smartmoveagency"
  }
};

export const initialServices: ServiceItem[] = [
  {
    id: "social-media-management",
    title: "Social Media Management",
    iconName: "Share2",
    shortDesc: "Omnichannel organic content strategy, community growth, and viral short-form video execution.",
    fullDesc: "Complete social presence engineering across TikTok, Instagram, LinkedIn, and YouTube. We script, film, edit, and schedule high-retention content tailored to your target demographic.",
    features: ["Monthly Content Calendar (30+ posts)", "Viral Short-Form Reels/TikToks", "Community Engagement & DM Funnels", "Brand Voice & Visual Guide"],
    tagline: "Dominate the Feed",
    startingPrice: "PKR 250,000/mo"
  },
  {
    id: "paid-ads",
    title: "Facebook & Instagram Ads",
    iconName: "Target",
    shortDesc: "High-ROAS Meta advertising campaigns with AI dynamic creative testing and custom attribution.",
    fullDesc: "Data-driven Meta & TikTok ad funnels optimized for low CAC and maximum customer lifetime value. We leverage full CBO setups, lookalike matrices, and retargeting loops.",
    features: ["Custom Creative Studio (Images & Video)", "Audience Segmentation & Lookalikes", "A/B Dynamic Copy & Headline Testing", "Daily ROAS & Conversion Tracking"],
    tagline: "Predictable Scale",
    startingPrice: "PKR 350,000/mo"
  },
  {
    id: "web-development",
    title: "Web Development",
    iconName: "Code2",
    shortDesc: "Futuristic, ultra-fast WebGL & React web applications optimized for conversion performance.",
    fullDesc: "Next-gen web applications built for speed, responsiveness, and conversion architecture. We combine dark glass aesthetics, smooth animations, and high-velocity page loads.",
    features: ["Full-Stack React & Vite Engine", "Sub-1s Page Load Optimization", "Custom CMS & CRM Integration", "SEO & Mobile First Responsive Architecture"],
    tagline: "Digital Excellence",
    startingPrice: "PKR 500,000"
  },
  {
    id: "branding",
    title: "Brand Identity",
    iconName: "Palette",
    shortDesc: "Futuristic visual identities, design systems, and brand positioning that command attention.",
    fullDesc: "Complete brand overhaul including logo design, color systems, typography pairs, brand guidelines, and 3D visual mockups that position your company as the category leader.",
    features: ["Vector Logo Package & Icon Set", "Complete Design System & Tokens", "Brand Messaging & Tone Architecture", "Social & Ad Template Library"],
    tagline: "Category Leader",
    startingPrice: "PKR 300,000"
  },
  {
    id: "video-editing",
    title: "High-Impact Video Editing",
    iconName: "Video",
    shortDesc: "Cinema-grade editing, motion graphics, sound design, and hook optimization for maximum retention.",
    fullDesc: "Hook-optimized video editing built to arrest attention in the first 2 seconds. Includes custom sound design, captions, kinetic typography, and motion overlays.",
    features: ["2-Second Hook Optimization", "Dynamic Subtitles & Motion FX", "Sound Design & Royalty-Free Audio", "Multi-Format Export (9:16, 16:9, 1:1)"],
    tagline: "Viral Engagement",
    startingPrice: "PKR 180,000/mo"
  },
  {
    id: "seo",
    title: "SEO & Content Funnels",
    iconName: "Search",
    shortDesc: "Dominant organic search ranking and programmatic content systems that drive continuous intent leads.",
    fullDesc: "Technical SEO audits, high-intent keyword positioning, and AI-enhanced editorial strategies designed to capture market share and drive low-cost organic customer acquisition.",
    features: ["Technical SEO & Core Web Vitals Fixes", "High-Intent Keyword Map", "10+ Long-Form SEO Articles/mo", "Backlink Outreach & Authority Building"],
    tagline: "Organic Dominance",
    startingPrice: "PKR 220,000/mo"
  },
  {
    id: "funnel-optimization",
    title: "Funnel & CRO Optimization",
    iconName: "Zap",
    shortDesc: "Conversion rate engineering, landing page A/B testing, and automated SMS/Email workflows.",
    fullDesc: "We audit every drop-off point in your buyer journey, optimize landing page copy and UX, and build high-converting email/SMS flows to maximize revenue per session.",
    features: ["Landing Page A/B Split Testing", "Cart Abandonment & Welcome SMS Sequences", "Heatmap & User Session Recording Audits", "Offer Structuring & Upsell Logic"],
    tagline: "Max Value Extraction",
    startingPrice: "PKR 280,000"
  }
];

export const initialCaseStudies: CaseStudy[] = [];

export const initialTestimonials: Testimonial[] = [
  {
    id: "test-future-tour",
    name: "Future Tour & Travel Europe",
    role: "Director",
    company: "Future Tour & Travel Europe (Sweden)",
    logo: "FUTURE TOUR",
    avatar: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80",
    content: "We hired SmartMove Marketing Agency for our social media management, and the results exceeded our expectations. Their content strategy, page optimization, and consistent posting helped us generate a large number of quality travel leads. They truly understand how to grow a travel business online.",
    rating: 5,
    metric: "Google Rated 5.0/5"
  },
  {
    id: "test-haga-bagel",
    name: "Haga Bagel",
    role: "Owner",
    company: "Haga Bagel (Restaurant, Sweden)",
    logo: "HAGA BAGEL",
    avatar: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80",
    content: "SmartMove Marketing Agency completely transformed our social media presence. From creating high-quality content to running Facebook ad campaigns, they delivered outstanding results. Our engagement increased significantly, and we reached many new customers. Professional, creative, and easy to work with. Highly recommended!",
    rating: 5,
    metric: "1 Review • Sweden"
  },
  {
    id: "test-ecomascendx",
    name: "Ecomascendx Team",
    role: "Founder",
    company: "Ecomascendx Amazon Agency",
    logo: "ECOMASCENDX",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
    content: "SmartMove Marketing Agency helped us run targeted Meta Ads to attract potential Amazon business clients. Their audience targeting strategy and ad optimization brought quality inquiries and helped us expand our client base. A reliable marketing partner.",
    rating: 5,
    metric: "5.0 out of 5 Stars"
  },
  {
    id: "test-easygo",
    name: "EasyGo Travel Agency",
    role: "Management",
    company: "EasyGo Travel Agency",
    logo: "EASYGO",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    content: "Our Meta Ads campaign was handled exceptionally well by SmartMove Marketing Agency. They optimized the ads, targeted the right audience, and generated high-quality leads for our travel services. Great communication and excellent marketing expertise.",
    rating: 5,
    metric: "Google Rated 5/5"
  },
  {
    id: "test-sikis-salon",
    name: "Sikis Salon & Aesthetics",
    role: "Management",
    company: "Sikis Salon and Aesthetics",
    logo: "SIKIS SALON",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    content: "We've been using Smart Move Marketing for our salon's social media and couldn't be happier. Our online presence is transformed! Our Instagram looks amazing with creative, professional posts, and we've seen a noticeable increase in client inquiries. They really understand the salon and aesthetics market. Highly recommended!",
    rating: 5,
    metric: "Ticket ID: SMMA0019"
  },
  {
    id: "test-dr-aniqa",
    name: "Dr. Aniqa Inam",
    role: "Medical Educator",
    company: "MRCP 1&2 (MRCP(UK))",
    logo: "MRCP 1&2",
    avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=300&q=80",
    content: "SmartMove Marketing Agency has been managing my Instagram professionally with creative content, consistent posting, and an attractive visual style. My profile looks much more professional, and engagement has improved noticeably. I highly recommend their social media management services.",
    rating: 5,
    metric: "Google Verified Review"
  },
  {
    id: "test-nexus-ai",
    name: "Nexus AI Solutions",
    role: "Co-Founder",
    company: "Nexus AI Solutions",
    logo: "NEXUS AI",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    content: "Outstanding collaboration! Smart Move Marketing designed high-impact campaigns that scaled our brand authority and improved user acquisition efficiency significantly.",
    rating: 5,
    metric: "35% Conversion Boost"
  }
];

export const initialTeam: TeamMember[] = [
  {
    id: "team-muniba",
    name: "Muniba Inam",
    role: "Lead Growth Engineer & Founder",
    image: "/cf25f7b8-0d91-4ab0-b025-9920ebc651f3.jpg",
    bio: "Visionary Growth Strategist and Lead Engineer at Digiloom IT. Specialist in 360° performance marketing, high-converting funnel architecture, brand scaling, and data-driven revenue optimization.",
    specialization: "360° Digital Growth Engine",
    socials: {
      linkedin: "https://www.linkedin.com/public-profile/settings",
      instagram: "https://www.instagram.com/smartmove_marketingagency?igsh=MWFjdGI4amo2eG5ndg==",
      twitter: "https://www.facebook.com/share/19dw4x1x5z/"
    }
  }
];

export const initialPricing: PricingPackage[] = [
  {
    id: "pkg-starter",
    name: "Starter Velocity",
    price: 150,
    period: "/month",
    description: "Ideal for early-stage startups and businesses seeking consistent social growth & proven paid ads validation.",
    features: [
      "1 Ad Channel (Meta or TikTok)",
      "12 Custom High-Converting Creatives/mo",
      "Social Media Management (3 posts/week)",
      "Bi-Weekly Strategy & ROAS Calls",
      "Dedicated Growth Slack Channel",
      "Full Conversion Analytics Dashboard"
    ],
    recommendedSpend: "$1k - $3k/mo ad spend"
  },
  {
    id: "pkg-growth",
    name: "Growth Scale",
    price: 250,
    period: "/month",
    popular: true,
    description: "Our core revenue accelerator package for brands ready to aggressively dominate market share.",
    features: [
      "2 Ad Channels (Meta + Google / TikTok)",
      "24 Custom Creatives (Images + Hook Videos)/mo",
      "Full Organic Social Management (5 posts/week)",
      "High-Converting Landing Page Optimization",
      "Weekly ROAS & Attribution Reports",
      "AI Chatbot Strategist Integration",
      "Priority 24/7 Slack & Phone Support"
    ],
    recommendedSpend: "$3k - $10k/mo ad spend"
  },
  {
    id: "pkg-enterprise",
    name: "Enterprise Dominance",
    price: 550,
    period: "/month",
    description: "Full-service digital takeover: custom web development, omnichannel paid ads, video production & SEO.",
    features: [
      "Omnichannel Media Buying (Meta, Google, TikTok, YT)",
      "Unlimited Ad Creative Studio (40+ assets/mo)",
      "Custom React Web App or Funnel Overhaul",
      "Dedicated Full-Time Creative & Growth Team",
      "Technical SEO & Programmatic Content Engine",
      "Daily Attribution & Real-time Profit Tracking",
      "Executive Board Room Reporting"
    ],
    recommendedSpend: "$10k+/mo ad spend"
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "How to Scale Meta Ads to $100k/Day Without ROAS Fatigue in 2026",
    slug: "scale-meta-ads-2026",
    category: "Paid Advertising",
    excerpt: "Discover the exact CBO setup, dynamic creative testing framework, and Andromeda bidding strategies top 1% media buyers use today.",
    content: `## The Era of Broad Targeting and Dynamic Creative Systems

Meta's auction algorithm in 2026 heavily favors creative diversity over micro-interest targeting. If your ad campaigns are fatiguing after $5,000 in spend, the issue isn't the audience—it's your creative velocity.

### Key Pillars of Modern Meta Scale:
1. **The 3x3 Creative Matrix**: Test 3 distinct psychological angles across 3 distinct visual formats (Hook Video, Glass Card Graphic, User Demonstration).
2. **Dynamic Advantage+ Shopping Setups**: Consolidate campaign structures into single CBO containers to let Meta's machine learning distribute spend dynamically.
3. **First-Frame Hook Psychology**: You have 1.8 seconds to stop the thumb. Use visual contrast, unexpected movement, or bold text callouts.

By implementing these 3 principles, our agency consistently scales clients from $10k/month to over $150k/month while keeping customer acquisition costs stable.`,
    readTime: "6 min read",
    date: "July 24, 2026",
    author: {
      name: "Alexander Thorne",
      role: "Chief Growth Strategist",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
    },
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
    published: true,
    featured: true
  },
  {
    id: "blog-2",
    title: "Why Glassmorphism and Dark UI Drive 38% Higher Conversion Rates",
    slug: "dark-ui-glassmorphism-cro",
    category: "Web & UX",
    excerpt: "An empirical look at visual hierarchy, contrast ratios, and how futuristic aesthetic design creates instant brand authority.",
    content: `## The Psychology of Visual Trust in High-Ticket B2B & Tech

First impressions on digital landing pages are established within 50 milliseconds. Modern consumers are conditioned to associate sleek, dark glassmorphism layouts with high-tech premium value.

### Why Dark Glass UI Works:
- **Focused Contrast**: Bright cyan and electric blue action buttons pops effortlessly against deep obsidian (#0B0F17) canvases.
- **Visual Depth**: Layering frosted glass panels creates optical hierarchy that naturally guides the eye to conversion CTAs.
- **Reduced Eyestrain**: Extended engagement times lead to higher reading completion of value propositions.

When redesigning web experiences for tech clients, switching to dark glass architectures paired with fast load speeds consistently yields a 25% to 40% increase in lead submission rates.`,
    readTime: "5 min read",
    date: "July 18, 2026",
    author: {
      name: "Sophia Chen",
      role: "VP of Creative",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
    },
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
    published: true
  },
  {
    id: "blog-3",
    title: "The B2B Organic TikTok & Short-Form Playbook for High-Ticket Services",
    slug: "b2b-short-form-video-playbook",
    category: "Social Media",
    excerpt: "Think TikTok is only for teenage dance trends? Here is how B2B companies are booking $50k deals directly through short-form video.",
    content: `## B2B Organic Video is the New Cold Outreach

Cold email response rates have plummeted, but short-form video feeds are hungry for authentic, high-value expert breakdowns.

### The 4-Part Short-Form B2B Formula:
1. **The Pattern Disrupt**: "Stop doing X if you want Y result in 2026."
2. **The Case Study Tease**: "Here is how we helped a SaaS company go from $10k to $100k MRR."
3. **The Tactical Value**: Give away the exact strategy step-by-step in 45 seconds.
4. **The Value-Add CTA**: "Comment 'AUDIT' and our AI tool will analyze your ad funnel for free."

Consistency is key—posting 1-2 high-retention clips per day establishes authority faster than 6 months of traditional blog posting.`,
    readTime: "7 min read",
    date: "July 10, 2026",
    author: {
      name: "Jaxson Reed",
      role: "Web & AI Architect",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"
    },
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1000&q=80",
    published: true
  }
];

export const initialLeads: Lead[] = [
  {
    id: "lead-101",
    name: "Jonathan Vance",
    email: "jvance@vancetech.com",
    business: "Vance Tech Solutions",
    website: "https://vancetech.example.com",
    budget: "$10k - $25k",
    selectedPackage: "Growth Scale",
    goals: ["Scale Paid Ads", "High-Converting Web Funnel", "Increase ROAS"],
    status: "New",
    createdAt: "2026-07-29T14:32:00.000Z",
    notes: "Interested in scaling Meta ad spend and upgrading web UX."
  },
  {
    id: "lead-102",
    name: "Sarah Jenkins",
    email: "sarah@luminaapparel.com",
    business: "Lumina Studio",
    website: "https://lumina.example.com",
    budget: "$25k - $50k",
    selectedPackage: "Enterprise Dominance",
    goals: ["Viral Social Growth", "Video Editing", "Omnichannel Ads"],
    status: "Contacted",
    createdAt: "2026-07-28T10:15:00.000Z",
    notes: "Had initial discovery call. Sending proposal on Friday."
  },
  {
    id: "lead-103",
    name: "Robert Sterling",
    email: "r.sterling@solaris.io",
    business: "Solaris Labs",
    website: "https://solaris.example.io",
    budget: "$5k - $10k",
    selectedPackage: "Starter Velocity",
    goals: ["SEO Dominance", "Brand Identity"],
    status: "Converted",
    createdAt: "2026-07-25T09:00:00.000Z",
    notes: "Signed 6-month retainer for Growth Scale package!"
  }
];

export const initialAnalytics: AnalyticsData = {
  visitors: 14280,
  leads: 184,
  conversionRate: 4.62,
  aiChatUsage: 940,
  dailyViews: [
    { date: "Jul 24", views: 1200, leads: 14 },
    { date: "Jul 25", views: 1850, leads: 22 },
    { date: "Jul 26", views: 2100, leads: 28 },
    { date: "Jul 27", views: 1940, leads: 24 },
    { date: "Jul 28", views: 2400, leads: 31 },
    { date: "Jul 29", views: 2650, leads: 36 },
    { date: "Jul 30", views: 2140, leads: 29 }
  ],
  trafficSources: [
    { name: "Direct / Brand Search", percentage: 38 },
    { name: "Organic Social (TikTok & IG)", percentage: 29 },
    { name: "Meta & Google Ads", percentage: 21 },
    { name: "Referral & News", percentage: 12 }
  ]
};

export const initialTrustedCompanies = [
  { id: 'comp-1', name: 'Vance Tech', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80' },
  { id: 'comp-2', name: 'Hyperion', logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80' },
  { id: 'comp-3', name: 'Solaris', logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=200&q=80' },
  { id: 'comp-4', name: 'CyberVault', logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80' },
  { id: 'comp-5', name: 'Apex EV', logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }
];

export const initialFaqs = [
  { id: 'faq-1', question: 'How quickly can we launch our growth campaigns?', answer: 'Our onboarding and strategy deployment typically takes 3 to 5 business days, with first ad creatives and funnels live within week one.' },
  { id: 'faq-2', question: 'What is your average ROAS for clients?', answer: 'Our client portfolio averages between 4.5x and 8.2x ROAS depending on industry and offer maturity.' },
  { id: 'faq-3', question: 'Do you require long-term contracts?', answer: 'We offer flexible month-to-month retainers for our core growth engines, though quarterly partnerships yield optimal scaling results.' }
];

