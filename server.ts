import express, { Request, Response } from "express";
import compression from "compression";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import {
  initialSiteSettings,
  initialServices,
  initialCaseStudies,
  initialTestimonials,
  initialTeam,
  initialPricing,
  initialBlogPosts,
  initialLeads,
  initialAnalytics,
  initialTrustedCompanies,
  initialFaqs
} from "./src/data/initialData.js";
import { Lead, BlogPost, SiteSettings, AnalyticsData, ServiceItem, CaseStudy, Testimonial, TeamMember, PricingPackage, TrustedCompany, FAQItem, MediaItem } from "./src/types.js";

const getMetaUrl = () => {
  try {
    return (new Function('return import.meta.url'))();
  } catch (e) {
    return '';
  }
};

const resolvedFilename = typeof __filename !== 'undefined' 
  ? __filename 
  : (getMetaUrl() ? fileURLToPath(getMetaUrl()) : '');
const resolvedDirname = typeof __dirname !== 'undefined' 
  ? __dirname 
  : (resolvedFilename ? path.dirname(resolvedFilename) : process.cwd());

const app = express();
app.use(compression());
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// --- SECURITY HEADERS ---
app.use((req: Request, res: Response, next: () => void) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// --- SUPABASE CLIENT (used to persist Pricing & Blog data — survives serverless restarts/redeploys) ---
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const SUPABASE_ADMIN_SECRET = process.env.SUPABASE_ADMIN_SECRET || "";
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
if (!supabase) {
  console.warn("⚠️ SUPABASE_URL/SUPABASE_ANON_KEY not set — Pricing & Blog will fall back to local JSON storage.");
}

// Ensure data & uploads directories exist
const DATA_DIR = path.join(resolvedDirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(resolvedDirname, 'public', 'uploads');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Could not create DATA_DIR (read-only filesystem?):', err);
}
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Could not create UPLOADS_DIR (read-only filesystem?):', err);
}

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

interface DatabaseSchema {
  siteSettings: SiteSettings;
  services: ServiceItem[];
  caseStudies: CaseStudy[];
  testimonials: Testimonial[];
  team: TeamMember[];
  pricing: PricingPackage[];
  blogPosts: BlogPost[];
  trustedCompanies: TrustedCompany[];
  faqs: FAQItem[];
  leads: Lead[];
  analytics: AnalyticsData;
  mediaLibrary: MediaItem[];
  auditLogs: { id: string; action: string; user: string; timestamp: string }[];
}

let db: DatabaseSchema = {
  siteSettings: { ...initialSiteSettings },
  services: [...initialServices],
  caseStudies: [...initialCaseStudies],
  testimonials: [...initialTestimonials],
  team: [...initialTeam],
  pricing: [...initialPricing],
  blogPosts: [...initialBlogPosts],
  trustedCompanies: [...initialTrustedCompanies],
  faqs: [...initialFaqs],
  leads: [...initialLeads],
  analytics: { ...initialAnalytics },
  mediaLibrary: [
    { id: 'media-1', name: 'Founder Portrait', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', size: '240 KB', type: 'image/jpeg', uploadedAt: new Date().toISOString() }
  ],
  auditLogs: [
    { id: 'log-1', action: 'System booted with persistent JSON store', user: 'System', timestamp: new Date().toISOString() }
  ]
};

// Load database from file if exists
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      db = { ...db, ...parsed };
      console.log('Database loaded successfully from disk.');
    } else {
      saveDatabase();
      console.log('Initialized new database on disk.');
    }
  } catch (e) {
    console.error('Error loading database, using defaults:', e);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving database to disk:', e);
  }
}

loadDatabase();

// --- SUPABASE HELPERS: PRICING & BLOG (source of truth when Supabase is configured) ---
function mapPricingRow(row: any): PricingPackage {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    period: row.period,
    description: row.description,
    popular: !!row.popular,
    features: Array.isArray(row.features) ? row.features : [],
    recommendedSpend: row.recommended_spend
  };
}

function mapBlogRow(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    excerpt: row.excerpt,
    content: row.content,
    readTime: row.read_time,
    date: row.post_date,
    author: row.author,
    image: row.image,
    published: !!row.published,
    featured: !!row.featured
  };
}

async function fetchPricingFromSupabase(): Promise<PricingPackage[]> {
  if (!supabase) return db.pricing;
  const { data, error } = await supabase.from("pricing_packages").select("*").order("sort_order", { ascending: true });
  if (error || !data) {
    console.error("Supabase pricing fetch error:", error);
    return db.pricing;
  }
  return data.map(mapPricingRow);
}

async function getPricingRowById(id: string): Promise<any | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("pricing_packages").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("Supabase pricing lookup error:", error);
    return null;
  }
  return data;
}

async function upsertPricingInSupabase(pkg: PricingPackage, sortOrder: number): Promise<PricingPackage | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("admin_upsert_pricing", {
    p_secret: SUPABASE_ADMIN_SECRET,
    p_id: pkg.id,
    p_name: pkg.name,
    p_price: pkg.price,
    p_period: pkg.period,
    p_description: pkg.description,
    p_popular: !!pkg.popular,
    p_features: pkg.features,
    p_recommended_spend: pkg.recommendedSpend,
    p_sort_order: sortOrder
  });
  if (error) {
    console.error("Supabase pricing upsert error:", error);
    return null;
  }
  return mapPricingRow(data);
}

async function fetchBlogFromSupabase(all: boolean): Promise<BlogPost[]> {
  if (!supabase) return all ? db.blogPosts : db.blogPosts.filter(p => p.published);
  let query = supabase.from("blog_posts").select("*").order("sort_order", { ascending: true });
  if (!all) query = query.eq("published", true);
  const { data, error } = await query;
  if (error || !data) {
    console.error("Supabase blog fetch error:", error);
    return all ? db.blogPosts : db.blogPosts.filter(p => p.published);
  }
  return data.map(mapBlogRow);
}

async function getBlogRowById(id: string): Promise<any | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("Supabase blog lookup error:", error);
    return null;
  }
  return data;
}

async function upsertBlogInSupabase(post: BlogPost, sortOrder: number): Promise<BlogPost | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("admin_upsert_blog", {
    p_secret: SUPABASE_ADMIN_SECRET,
    p_id: post.id,
    p_title: post.title,
    p_slug: post.slug,
    p_category: post.category,
    p_excerpt: post.excerpt,
    p_content: post.content,
    p_read_time: post.readTime,
    p_post_date: post.date,
    p_author: post.author,
    p_image: post.image,
    p_published: !!post.published,
    p_featured: !!post.featured,
    p_sort_order: sortOrder
  });
  if (error) {
    console.error("Supabase blog upsert error:", error);
    return null;
  }
  return mapBlogRow(data);
}

// --- GEMINI CLIENT ---
// Constructed defensively: if GEMINI_API_KEY is missing/invalid, the SDK constructor can throw,
// which (unguarded) would crash this entire module on import — taking down EVERY /api/* route,
// not just the chat one. Guarding this keeps the rest of the API alive even without the key.
let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} catch (err) {
  console.warn('⚠️ Failed to initialize GoogleGenAI client (GEMINI_API_KEY missing/invalid) — AI chat will use fallback replies:', err);
}

// --- EMAIL SENDER HELPER ---
async function sendLeadEmail(lead: Lead) {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn("⚠️ SMTP Credentials are not configured. Saving lead in database but skipping email notification.");
    lead.emailSent = false;
    lead.emailError = "SMTP user/pass missing in environment variables.";
    const leadInDb = db.leads.find(l => l.id === lead.id);
    if (leadInDb) {
      leadInDb.emailSent = false;
      leadInDb.emailError = "SMTP user/pass missing in environment variables.";
    }
    db.auditLogs.unshift({
      id: 'log-' + Date.now(),
      action: `Lead "${lead.name}" saved securely. Email not sent (SMTP credentials missing).`,
      user: 'System',
      timestamp: new Date().toISOString()
    });
    saveDatabase();
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  const formattedDate = new Date(lead.createdAt).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'long'
  });

  const textContent = `A new lead has been submitted.

--------------------------------

Name:
${lead.name || "N/A"}

Email:
${lead.email || "N/A"}

Phone:
${lead.phone || lead.whatsapp || "N/A"}

Company:
${lead.business || "N/A"}

Website:
${lead.website || "N/A"}

Selected Service:
${lead.service || "N/A"}

Selected Package:
${lead.selectedPackage || "N/A"}

Monthly Budget:
${lead.budget || "N/A"}

Business Goals:
${Array.isArray(lead.goals) ? lead.goals.join(", ") : "N/A"}

Message:
${lead.message || "N/A"}

Submitted At:
${formattedDate}

IP Address:
${lead.ip || "N/A"}

Country:
${lead.country || "N/A"}

Browser:
${lead.browser || "N/A"}

Device:
${lead.device || "N/A"}

Referral Source:
${lead.referringPage || "N/A"}

--------------------------------

End of Lead`;

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; color: #111827;">
      <div style="text-align: center; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 2px solid #B7FF00;">
        <h2 style="color: #05080c; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">🚀 New Lead Received – Smart Move Marketing Agency</h2>
        <p style="color: #4b5563; font-size: 14px; margin: 6px 0 0 0; font-weight: 500;">Smart Move Marketing Agency</p>
      </div>
      
      <div style="margin-bottom: 24px;">
        <span style="display: inline-block; padding: 4px 12px; background-color: #B7FF00; color: #000000; font-size: 11px; font-weight: 800; text-transform: uppercase; border-radius: 9999px; font-family: monospace;">
          Status: ${lead.status}
        </span>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
        <tr style="background-color: #f9fafb;">
          <td style="padding: 12px; font-weight: bold; width: 35%; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Full Name:</td>
          <td style="padding: 12px; color: #111827; font-weight: 600; border-bottom: 1px solid #f3f4f6;">${lead.name || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Email Address:</td>
          <td style="padding: 12px; color: #111827; font-weight: 600; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${lead.email}" style="color: #2563eb; text-decoration: none;">${lead.email || 'N/A'}</a></td>
        </tr>
        <tr style="background-color: #f9fafb;">
          <td style="padding: 12px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Company Name:</td>
          <td style="padding: 12px; color: #111827; border-bottom: 1px solid #f3f4f6;">${lead.business || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Website/Store URL:</td>
          <td style="padding: 12px; color: #111827; border-bottom: 1px solid #f3f4f6;">
            ${lead.website && lead.website !== 'N/A' ? `<a href="${lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}" target="_blank" style="color: #2563eb; text-decoration: none;">${lead.website}</a>` : 'N/A'}
          </td>
        </tr>
        <tr style="background-color: #f9fafb;">
          <td style="padding: 12px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Monthly Budget:</td>
          <td style="padding: 12px; color: #16a34a; font-weight: bold; border-bottom: 1px solid #f3f4f6;">${lead.budget || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Selected Package:</td>
          <td style="padding: 12px; color: #4f46e5; font-weight: bold; border-bottom: 1px solid #f3f4f6;">${lead.selectedPackage || 'N/A'}</td>
        </tr>
        <tr style="background-color: #f9fafb;">
          <td style="padding: 12px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Phone Number:</td>
          <td style="padding: 12px; color: #111827; border-bottom: 1px solid #f3f4f6;">${lead.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">WhatsApp Number:</td>
          <td style="padding: 12px; color: #111827; border-bottom: 1px solid #f3f4f6;">${lead.whatsapp || 'N/A'}</td>
        </tr>
        <tr style="background-color: #f9fafb;">
          <td style="padding: 12px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Service Interest:</td>
          <td style="padding: 12px; color: #111827; border-bottom: 1px solid #f3f4f6;">${lead.service || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Referring Page:</td>
          <td style="padding: 12px; color: #6b7280; font-family: monospace; font-size: 12px; border-bottom: 1px solid #f3f4f6;">${lead.referringPage || 'N/A'}</td>
        </tr>
        <tr style="background-color: #f9fafb;">
          <td style="padding: 12px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">IP Address:</td>
          <td style="padding: 12px; color: #6b7280; font-family: monospace; font-size: 12px; border-bottom: 1px solid #f3f4f6;">${lead.ip || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Device / Browser:</td>
          <td style="padding: 12px; color: #6b7280; font-size: 12px; border-bottom: 1px solid #f3f4f6;">${lead.device || 'N/A'} / ${lead.browser || 'N/A'}</td>
        </tr>
        <tr style="background-color: #f9fafb;">
          <td style="padding: 12px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Country:</td>
          <td style="padding: 12px; color: #111827; border-bottom: 1px solid #f3f4f6;">${lead.country || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Date & Time:</td>
          <td style="padding: 12px; color: #111827; border-bottom: 1px solid #f3f4f6;">${formattedDate}</td>
        </tr>
      </table>

      ${lead.goals && lead.goals.length > 0 ? `
        <div style="margin-top: 20px; padding: 16px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #166534; font-size: 15px; font-weight: 700;">Main Growth Objectives:</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #14532d; line-height: 1.6;">
            ${lead.goals.map((g: string) => `<li>${g}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${lead.message ? `
        <div style="margin-top: 20px; padding: 16px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #374151; font-size: 15px; font-weight: 700;">Message / Details:</h4>
          <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${lead.message}</p>
        </div>
      ` : ''}

      ${lead.uploadedFiles && lead.uploadedFiles.length > 0 ? `
        <div style="margin-top: 20px; padding: 16px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px;">
          <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 15px; font-weight: 700;">Uploaded Attachments:</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #1e3a8a; line-height: 1.6;">
            ${lead.uploadedFiles.map((f: string) => `<li><a href="${f}" target="_blank" style="color: #2563eb; text-decoration: underline;">${f}</a></li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 11px; color: #9ca3af; font-family: monospace;">
        This is an automated real-time notification from your Smart Move Agency website.
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"${lead.name || 'Smart Move Lead'}" <${user}>`,
      to: "muslimstudent1991@gmail.com",
      subject: `🚀 New Lead Received – Smart Move Marketing Agency`,
      text: textContent,
      html: htmlContent
    });
    console.log("📨 Email notification sent successfully to muslimstudent1991@gmail.com:", info.messageId);
    
    lead.emailSent = true;
    lead.emailError = undefined;
    const leadInDb = db.leads.find(l => l.id === lead.id);
    if (leadInDb) {
      leadInDb.emailSent = true;
      leadInDb.emailError = undefined;
    }

    db.auditLogs.unshift({
      id: 'log-' + Date.now(),
      action: `Lead email notification sent successfully to muslimstudent1991@gmail.com for "${lead.name}".`,
      user: 'System',
      timestamp: new Date().toISOString()
    });
    saveDatabase();
  } catch (err: any) {
    console.error("❌ Error sending notification email via SMTP:", err);
    lead.emailSent = false;
    lead.emailError = err.message || String(err);
    const leadInDb = db.leads.find(l => l.id === lead.id);
    if (leadInDb) {
      leadInDb.emailSent = false;
      leadInDb.emailError = err.message || String(err);
    }

    db.auditLogs.unshift({
      id: 'log-' + Date.now(),
      action: `Email failed for "${lead.name}": ${err.message || err}`,
      user: 'System',
      timestamp: new Date().toISOString()
    });
    saveDatabase();
  }
}

// --- ADMIN AUTH: signed, stateless tokens (safe across serverless restarts) ---
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || ADMIN_PASSWORD;
const ADMIN_TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function signAdminToken(): string {
  const payload = JSON.stringify({ role: "admin", iat: Date.now(), exp: Date.now() + ADMIN_TOKEN_TTL_MS });
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", ADMIN_TOKEN_SECRET).update(payloadB64).digest("base64url");
  return `${payloadB64}.${sig}`;
}

function verifyAdminToken(token: string): boolean {
  if (!ADMIN_TOKEN_SECRET) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payloadB64, sig] = parts;
  const expectedSig = crypto.createHmac("sha256", ADMIN_TOKEN_SECRET).update(payloadB64).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return false;
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
    return payload.role === "admin" && typeof payload.exp === "number" && Date.now() <= payload.exp;
  } catch {
    return false;
  }
}

// Admin Auth Middleware
function requireAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ error: "Unauthorized. Admin authentication required." });
  }
  next();
}

// --- PUBLIC & API ENDPOINTS ---

// Prevent GET caching of API responses
app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", agency: db.siteSettings.logoText, database: "persistent-json", timestamp: new Date().toISOString() });
});

// Site Settings & CMS Bundle GET
app.get("/api/site-settings", async (req: Request, res: Response) => {
  const pricing = await fetchPricingFromSupabase();
  res.json({
    settings: db.siteSettings,
    services: db.services,
    caseStudies: db.caseStudies,
    testimonials: db.testimonials,
    team: db.team,
    pricing,
    trustedCompanies: db.trustedCompanies,
    faqs: db.faqs
  });
});

// Update Site Settings
app.put("/api/admin/site-settings", requireAdmin, (req: Request, res: Response) => {
  db.siteSettings = { ...db.siteSettings, ...req.body };
  saveDatabase();
  db.auditLogs.unshift({
    id: 'log-' + Date.now(),
    action: 'Updated Site Settings & Global Header/Hero',
    user: 'Administrator',
    timestamp: new Date().toISOString()
  });
  res.json({ success: true, settings: db.siteSettings });
});

// --- SERVICES CRUD ---
app.get("/api/services", (req: Request, res: Response) => {
  res.json({ services: db.services });
});

app.post("/api/admin/services", requireAdmin, (req: Request, res: Response) => {
  const newService: ServiceItem = {
    id: `service-${Date.now()}`,
    title: req.body.title || 'New Service',
    iconName: req.body.iconName || 'Zap',
    shortDesc: req.body.shortDesc || '',
    fullDesc: req.body.fullDesc || '',
    features: Array.isArray(req.body.features) ? req.body.features : [],
    tagline: req.body.tagline || 'Growth Engine',
    startingPrice: req.body.startingPrice || 'PKR 150,000'
  };
  db.services.push(newService);
  saveDatabase();
  res.status(201).json({ success: true, service: newService });
});

app.put("/api/admin/services/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.services.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: "Service not found" });
  db.services[index] = { ...db.services[index], ...req.body, id };
  saveDatabase();
  res.json({ success: true, service: db.services[index] });
});

app.delete("/api/admin/services/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  db.services = db.services.filter(s => s.id !== id);
  saveDatabase();
  res.json({ success: true });
});

// --- PORTFOLIO / CASE STUDIES CRUD ---
app.get("/api/portfolio", (req: Request, res: Response) => {
  res.json({ caseStudies: db.caseStudies });
});

app.post("/api/admin/portfolio", requireAdmin, (req: Request, res: Response) => {
  const newStudy: CaseStudy = {
    id: `case-${Date.now()}`,
    title: req.body.title || 'New Case Study',
    client: req.body.client || 'Client Name',
    category: req.body.category || 'Paid Ads',
    image: req.body.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
    videoUrl: req.body.videoUrl || '',
    roas: req.body.roas || '5.0x',
    growthMetric: req.body.growthMetric || '+300%',
    description: req.body.description || '',
    challenge: req.body.challenge || '',
    solution: req.body.solution || '',
    results: Array.isArray(req.body.results) ? req.body.results : []
  };
  db.caseStudies.unshift(newStudy);
  saveDatabase();
  res.status(201).json({ success: true, caseStudy: newStudy });
});

app.put("/api/admin/portfolio/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.caseStudies.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: "Case study not found" });
  db.caseStudies[index] = { ...db.caseStudies[index], ...req.body, id };
  saveDatabase();
  res.json({ success: true, caseStudy: db.caseStudies[index] });
});

app.delete("/api/admin/portfolio/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  db.caseStudies = db.caseStudies.filter(c => c.id !== id);
  saveDatabase();
  res.json({ success: true });
});

// --- TEAM CRUD ---
app.get("/api/team", (req: Request, res: Response) => {
  res.json({ team: db.team });
});

app.post("/api/admin/team", requireAdmin, (req: Request, res: Response) => {
  const newMember: TeamMember = {
    id: `team-${Date.now()}`,
    name: req.body.name || 'Team Member',
    role: req.body.role || 'Specialist',
    image: req.body.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: req.body.bio || '',
    specialization: req.body.specialization || '',
    socials: req.body.socials || {}
  };
  db.team.push(newMember);
  saveDatabase();
  res.status(201).json({ success: true, member: newMember });
});

app.put("/api/admin/team/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.team.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Team member not found" });
  db.team[index] = { ...db.team[index], ...req.body, id };
  saveDatabase();
  res.json({ success: true, member: db.team[index] });
});

app.delete("/api/admin/team/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  db.team = db.team.filter(t => t.id !== id);
  saveDatabase();
  res.json({ success: true });
});

// --- TESTIMONIALS CRUD ---
app.get("/api/testimonials", (req: Request, res: Response) => {
  res.json({ testimonials: db.testimonials });
});

app.post("/api/admin/testimonials", requireAdmin, (req: Request, res: Response) => {
  const newTestimonial: Testimonial = {
    id: `test-${Date.now()}`,
    name: req.body.name || 'Client',
    role: req.body.role || 'CEO',
    company: req.body.company || 'Company',
    logo: req.body.logo || 'LOGO',
    avatar: req.body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    content: req.body.content || '',
    rating: Number(req.body.rating) || 5,
    metric: req.body.metric || '5x ROAS'
  };
  db.testimonials.push(newTestimonial);
  saveDatabase();
  res.status(201).json({ success: true, testimonial: newTestimonial });
});

app.put("/api/admin/testimonials/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.testimonials.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Testimonial not found" });
  db.testimonials[index] = { ...db.testimonials[index], ...req.body, id };
  saveDatabase();
  res.json({ success: true, testimonial: db.testimonials[index] });
});

app.delete("/api/admin/testimonials/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  db.testimonials = db.testimonials.filter(t => t.id !== id);
  saveDatabase();
  res.json({ success: true });
});

// --- PRICING CRUD (persisted in Supabase) ---
app.get("/api/pricing", async (req: Request, res: Response) => {
  const pricing = await fetchPricingFromSupabase();
  res.json({ pricing });
});

app.post("/api/admin/pricing", requireAdmin, async (req: Request, res: Response) => {
  const newPrice: PricingPackage = {
    id: `price-${Date.now()}`,
    name: req.body.name || 'Plan',
    price: Number(req.body.price) || 1000,
    period: req.body.period || '/mo',
    description: req.body.description || '',
    popular: !!req.body.popular,
    features: Array.isArray(req.body.features) ? req.body.features : [],
    recommendedSpend: req.body.recommendedSpend || '$5k-$10k'
  };
  const saved = await upsertPricingInSupabase(newPrice, Date.now());
  if (!saved) {
    db.pricing.push(newPrice);
    saveDatabase();
    return res.status(201).json({ success: true, pricing: newPrice, warning: "Supabase not configured; saved to local fallback only." });
  }
  res.status(201).json({ success: true, pricing: saved });
});

app.put("/api/admin/pricing/:id", requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = await getPricingRowById(id);
  if (!existing) return res.status(404).json({ error: "Pricing package not found" });
  const merged: PricingPackage = {
    id,
    name: req.body.name ?? existing.name,
    price: req.body.price !== undefined ? Number(req.body.price) : Number(existing.price),
    period: req.body.period ?? existing.period,
    description: req.body.description ?? existing.description,
    popular: req.body.popular !== undefined ? !!req.body.popular : !!existing.popular,
    features: Array.isArray(req.body.features) ? req.body.features : existing.features,
    recommendedSpend: req.body.recommendedSpend ?? existing.recommended_spend
  };
  const saved = await upsertPricingInSupabase(merged, existing.sort_order);
  if (!saved) return res.status(500).json({ error: "Failed to update pricing package." });
  res.json({ success: true, pricing: saved });
});

app.delete("/api/admin/pricing/:id", requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!supabase) {
    db.pricing = db.pricing.filter(p => p.id !== id);
    saveDatabase();
    return res.json({ success: true, warning: "Supabase not configured; removed from local fallback only." });
  }
  const { error } = await supabase.rpc("admin_delete_pricing", { p_secret: SUPABASE_ADMIN_SECRET, p_id: id });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// --- BLOG CRUD (persisted in Supabase) ---
app.get("/api/blog", async (req: Request, res: Response) => {
  const { all } = req.query;
  const posts = await fetchBlogFromSupabase(all === 'true');
  res.json({ blogPosts: posts });
});

app.post("/api/admin/blog", requireAdmin, async (req: Request, res: Response) => {
  const newPost: BlogPost = {
    id: `post-${Date.now()}`,
    title: req.body.title || 'New Blog Post',
    slug: req.body.slug || `post-${Date.now()}`,
    category: req.body.category || 'Growth',
    excerpt: req.body.excerpt || '',
    content: req.body.content || '',
    readTime: req.body.readTime || '5 min read',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    author: req.body.author || { name: 'Smart Move Team', role: 'Growth Editors', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    image: req.body.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
    published: req.body.published !== undefined ? req.body.published : true,
    featured: !!req.body.featured
  };
  const saved = await upsertBlogInSupabase(newPost, Date.now());
  if (!saved) {
    db.blogPosts.unshift(newPost);
    saveDatabase();
    return res.status(201).json({ success: true, post: newPost, warning: "Supabase not configured; saved to local fallback only." });
  }
  res.status(201).json({ success: true, post: saved });
});

app.put("/api/admin/blog/:id", requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = await getBlogRowById(id);
  if (!existing) return res.status(404).json({ error: "Blog post not found" });
  const merged: BlogPost = {
    id,
    title: req.body.title ?? existing.title,
    slug: req.body.slug ?? existing.slug,
    category: req.body.category ?? existing.category,
    excerpt: req.body.excerpt ?? existing.excerpt,
    content: req.body.content ?? existing.content,
    readTime: req.body.readTime ?? existing.read_time,
    date: req.body.date ?? existing.post_date,
    author: req.body.author ?? existing.author,
    image: req.body.image ?? existing.image,
    published: req.body.published !== undefined ? !!req.body.published : !!existing.published,
    featured: req.body.featured !== undefined ? !!req.body.featured : !!existing.featured
  };
  const saved = await upsertBlogInSupabase(merged, existing.sort_order);
  if (!saved) return res.status(500).json({ error: "Failed to update blog post." });
  res.json({ success: true, post: saved });
});

app.delete("/api/admin/blog/:id", requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!supabase) {
    db.blogPosts = db.blogPosts.filter(p => p.id !== id);
    saveDatabase();
    return res.json({ success: true, warning: "Supabase not configured; removed from local fallback only." });
  }
  const { error } = await supabase.rpc("admin_delete_blog", { p_secret: SUPABASE_ADMIN_SECRET, p_id: id });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// --- TRUSTED COMPANIES CRUD ---
app.get("/api/trusted-companies", (req: Request, res: Response) => {
  res.json({ trustedCompanies: db.trustedCompanies });
});

app.post("/api/admin/trusted-companies", requireAdmin, (req: Request, res: Response) => {
  const newItem: TrustedCompany = {
    id: `comp-${Date.now()}`,
    name: req.body.name || 'Company',
    logo: req.body.logo || ''
  };
  db.trustedCompanies.push(newItem);
  saveDatabase();
  res.status(201).json({ success: true, trustedCompany: newItem });
});

app.put("/api/admin/trusted-companies/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.trustedCompanies.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: "Trusted company not found" });
  db.trustedCompanies[index] = { ...db.trustedCompanies[index], ...req.body, id };
  saveDatabase();
  res.json({ success: true, trustedCompany: db.trustedCompanies[index] });
});

app.delete("/api/admin/trusted-companies/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  db.trustedCompanies = db.trustedCompanies.filter(c => c.id !== id);
  saveDatabase();
  res.json({ success: true });
});

// --- FAQS CRUD ---
app.get("/api/faqs", (req: Request, res: Response) => {
  res.json({ faqs: db.faqs });
});

app.post("/api/admin/faqs", requireAdmin, (req: Request, res: Response) => {
  const newFaq: FAQItem = {
    id: `faq-${Date.now()}`,
    question: req.body.question || 'Question?',
    answer: req.body.answer || 'Answer here.'
  };
  db.faqs.push(newFaq);
  saveDatabase();
  res.status(201).json({ success: true, faq: newFaq });
});

app.put("/api/admin/faqs/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.faqs.findIndex(f => f.id === id);
  if (index === -1) return res.status(404).json({ error: "FAQ not found" });
  db.faqs[index] = { ...db.faqs[index], ...req.body, id };
  saveDatabase();
  res.json({ success: true, faq: db.faqs[index] });
});

app.delete("/api/admin/faqs/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  db.faqs = db.faqs.filter(f => f.id !== id);
  saveDatabase();
  res.json({ success: true });
});

// --- MEDIA LIBRARY & UPLOAD ---
app.get("/api/admin/media", requireAdmin, (req: Request, res: Response) => {
  res.json({ media: db.mediaLibrary });
});

app.post("/api/admin/upload", requireAdmin, (req: Request, res: Response) => {
  const { name, url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Image URL or data is required." });
  }

  let finalUrl = url;
  if (url.startsWith('data:')) {
    try {
      const matches = url.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const ext = mimeType.split('/')[1] || 'png';
        const filename = `upload-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
        const filepath = path.join(UPLOADS_DIR, filename);
        fs.writeFileSync(filepath, buffer);
        finalUrl = `/uploads/${filename}`;
      }
    } catch (e) {
      console.error('Error saving base64 upload to disk:', e);
    }
  }

  const newItem: MediaItem = {
    id: `media-${Date.now()}`,
    name: name || 'Uploaded Asset',
    url: finalUrl,
    size: '1.4 MB',
    type: finalUrl.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
    uploadedAt: new Date().toISOString()
  };

  db.mediaLibrary.unshift(newItem);
  saveDatabase();
  db.auditLogs.unshift({
    id: 'log-' + Date.now(),
    action: `Uploaded media: ${newItem.name}`,
    user: 'Administrator',
    timestamp: new Date().toISOString()
  });
  res.status(201).json({ success: true, item: newItem });
});

app.delete("/api/admin/media/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  db.mediaLibrary = db.mediaLibrary.filter(m => m.id !== id);
  saveDatabase();
  res.json({ success: true });
});

// --- IN-MEMORY RATE LIMITER ---
const ipRateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limitWindowMs = 60 * 1000; // 1 minute
  const maxRequests = 20; // Max 20 requests per minute

  const limitData = ipRateLimitMap.get(ip);
  if (!limitData || now > limitData.resetAt) {
    ipRateLimitMap.set(ip, { count: 1, resetAt: now + limitWindowMs });
    return false;
  }

  if (limitData.count >= maxRequests) {
    return true;
  }

  limitData.count += 1;
  return false;
}

// --- LEADS & ANALYTICS ---
app.post("/api/leads", async (req: Request, res: Response) => {
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || "127.0.0.1").split(',')[0].trim();

  // Rate limit check
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many submissions. Please wait a minute and try again." });
  }

  let {
    name,
    fullName,
    email,
    emailAddress,
    phone,
    phoneNumber,
    whatsapp,
    whatsappNumber,
    business,
    businessName,
    company,
    companyName,
    website,
    storeUrl,
    socials,
    socialMedia,
    service,
    selectedService,
    package: pkg,
    selectedPackage,
    budget,
    monthlyBudget,
    goals,
    businessGoals,
    message,
    uploadedFiles,
    referringPage,
  } = req.body;

  // Normalize fields
  const finalEmail = String(email || emailAddress || "").trim();
  let finalName = String(name || fullName || "").trim();
  let finalBusiness = String(business || businessName || company || companyName || "").trim();
  const finalPhone = String(phone || phoneNumber || "").trim();
  const finalWhatsapp = String(whatsapp || whatsappNumber || "").trim();
  const finalWebsite = String(website || storeUrl || "N/A").trim();
  const finalBudget = String(budget || monthlyBudget || "Unspecified").trim();
  const finalPackage = String(selectedPackage || pkg || "General Inquiry").trim();
  const finalService = String(selectedService || service || "All-Inclusive").trim();
  const finalGoals = Array.isArray(goals) ? goals : (Array.isArray(businessGoals) ? businessGoals : []);
  const finalMessage = String(message || "").trim();
  const finalReferrer = String(referringPage || req.headers.referer || "Direct / Main Web").trim();

  // Flex validation
  if (!finalEmail) {
    return res.status(400).json({ error: "Email address is required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(finalEmail)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  if (!finalName) {
    finalName = finalEmail.split("@")[0];
    finalName = finalName.charAt(0).toUpperCase() + finalName.slice(1);
  }

  if (!finalBusiness) {
    if (finalPackage.toLowerCase().includes("newsletter") || finalPackage.toLowerCase().includes("sub")) {
      finalBusiness = "Newsletter Subscriber";
    } else {
      finalBusiness = "Inquired Online";
    }
  }

  // Prevent spam and duplicate submissions (same email in last 2 minutes)
  const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
  const isDuplicate = db.leads.some(l => 
    l.email.toLowerCase() === finalEmail.toLowerCase() &&
    new Date(l.createdAt).getTime() > twoMinutesAgo
  );

  if (isDuplicate) {
    return res.status(200).json({ 
      success: true, 
      message: "Thank you! Your message has been sent successfully. Our team will contact you shortly.",
      isSpamPrevented: true 
    });
  }

  // Gather client browser/device metadata
  const userAgent = String(req.headers['user-agent'] || "");
  let browser = "Unknown Browser";
  if (userAgent.includes("Chrome")) browser = "Google Chrome";
  else if (userAgent.includes("Safari")) browser = "Apple Safari";
  else if (userAgent.includes("Firefox")) browser = "Mozilla Firefox";
  else if (userAgent.includes("Edge")) browser = "Microsoft Edge";
  else if (userAgent.includes("OPR") || userAgent.includes("Opera")) browser = "Opera";

  let device = "Desktop PC";
  if (userAgent.includes("Mobi") || userAgent.includes("Android") || userAgent.includes("iPhone")) {
    device = "Mobile Device";
  } else if (userAgent.includes("iPad") || userAgent.includes("Tablet")) {
    device = "Tablet Device";
  }

  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    name: finalName,
    email: finalEmail,
    business: finalBusiness,
    website: finalWebsite,
    budget: finalBudget,
    selectedPackage: finalPackage,
    goals: finalGoals,
    status: "New",
    createdAt: new Date().toISOString(),
    phone: finalPhone || undefined,
    whatsapp: finalWhatsapp || undefined,
    message: finalMessage || undefined,
    service: finalService || undefined,
    referringPage: finalReferrer,
    ip,
    browser,
    device,
    country: "Pakistan",
    uploadedFiles: Array.isArray(uploadedFiles) ? uploadedFiles : []
  };

  try {
    // Permanently save
    db.leads.unshift(newLead);
    db.analytics.leads += 1;
    db.analytics.conversionRate = parseFloat(((db.analytics.leads / (db.analytics.visitors || 1)) * 100).toFixed(2));
    saveDatabase();

    // Email notification disabled per user request
    // sendLeadEmail(newLead).catch(e => console.error("Email notification error:", e));

    return res.status(201).json({
      success: true,
      message: "Thank you! Your message has been sent successfully. Our team will contact you shortly.",
      lead: newLead
    });
  } catch (err: any) {
    console.error("Error saving lead:", err);
    return res.status(500).json({ error: "Internal server error. Your lead was not saved." });
  }
});

// --- AI CHATBOT ROUTE ---
app.post("/api/chat", async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  // Capture email inside chat conversation as a hot lead
  const emailMatch = String(message).match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  const phoneMatch = String(message).match(/(\+?\d[\d-\s()]{8,15}\d)/g);

  if (emailMatch) {
    const extractedEmail = emailMatch[0];
    const extractedPhone = phoneMatch ? phoneMatch[0] : "";
    const isDuplicate = db.leads.some(l => l.email.toLowerCase() === extractedEmail.toLowerCase());

    if (!isDuplicate) {
      const chatLead: Lead = {
        id: `lead-chat-${Date.now()}`,
        name: extractedEmail.split("@")[0].toUpperCase(),
        email: extractedEmail,
        business: "AURA Chat Interface",
        website: "N/A",
        budget: "Unspecified",
        selectedPackage: "AI Chat Lead Capture",
        goals: ["AI Chat Lead Capture"],
        status: "New",
        createdAt: new Date().toISOString(),
        phone: extractedPhone || undefined,
        message: `Extracted from AURA chat session. Message text: "${message}"`
      };
      db.leads.unshift(chatLead);
      db.analytics.leads += 1;
      db.analytics.conversionRate = parseFloat(((db.analytics.leads / (db.analytics.visitors || 1)) * 100).toFixed(2));
      saveDatabase();
      // sendLeadEmail(chatLead).catch(err => console.error("Chat lead email err:", err));
    }
  }

  try {
    db.analytics.aiChatUsage = (db.analytics.aiChatUsage || 0) + 1;
    saveDatabase();

    if (!process.env.GEMINI_API_KEY || !ai) {
      return res.json({
        text: `Thanks for asking! I'm AURA, Smart Move's AI Growth Strategist. I'd love to help you scale your ad accounts and landing pages. To get direct access to our specialist team and custom audit, click 'Book Audit' to schedule your free 1-on-1 audit!`
      });
    }

    const formattedHistory = Array.isArray(history) 
      ? history.map((h: any) => `${h.sender === 'user' ? 'User' : 'AURA'}: ${h.text}`).join("\n") 
      : "";

    const systemInstruction = `You are AURA, Smart Move's Elite AI Growth Strategist. You provide high-impact, direct, results-oriented, and actionable advice about Meta Ads, media buying, CRO (conversion rate optimization), creative testing, scaling funnels, and organic growth.
Keep your answers professional, concise, and incredibly specific (use metrics and examples like "aim for a 3% CTR", "hook rates above 35%"). Do NOT sound generic.
Encourage the user to claim their Free 15-Point Growth Audit to let our expert human team tear down their ad accounts.
Smart Move is a results-driven agency.
Format your responses beautifully using markdown, lists, and spacing where appropriate. Keep it short (max 2-3 paragraphs or bullet list).`;

    const fullPrompt = `${systemInstruction}\n\nChat History:\n${formattedHistory}\n\nUser Message: ${message}\n\nResponse:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: fullPrompt,
    });

    const replyText = response.text || "I'd love to help you analyze your ad accounts. Feel free to book a free 1-on-1 growth audit with our human expert team!";
    return res.json({ text: replyText });
  } catch (err: any) {
    console.error("Gemini AI Chat Error:", err);
    return res.json({ 
      text: "I am currently analyzing massive amounts of ad spend data. To get instant answers for your brand, please claim your free, custom 1-on-1 growth audit using our Lead Portal!"
    });
  }
});

app.get("/api/leads", requireAdmin, (req: Request, res: Response) => {
  res.json({ leads: db.leads });
});

app.patch("/api/leads/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const lead = db.leads.find(l => l.id === id);
  if (!lead) return res.status(404).json({ error: "Lead not found" });
  if (status) lead.status = status;
  if (notes !== undefined) lead.notes = notes;
  saveDatabase();
  res.json({ success: true, lead });
});

app.post("/api/admin/leads/:id/resend-email", requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const lead = db.leads.find(l => l.id === id);
  if (!lead) return res.status(404).json({ error: "Lead not found" });

  try {
    lead.emailError = undefined;
    await sendLeadEmail(lead);
    
    if (lead.emailSent) {
      return res.json({ success: true, message: "Email notification sent successfully!", lead });
    } else {
      return res.status(500).json({ error: lead.emailError || "Failed to send email", lead });
    }
  } catch (err: any) {
    console.error("Resend email error:", err);
    return res.status(500).json({ error: err.message || "Failed to send email", lead });
  }
});

app.delete("/api/admin/leads/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  db.leads = db.leads.filter(l => l.id !== id);
  saveDatabase();
  res.json({ success: true });
});

app.get("/api/analytics", requireAdmin, (req: Request, res: Response) => {
  res.json({ analytics: db.analytics });
});

app.post("/api/analytics/log-visitor", (req: Request, res: Response) => {
  db.analytics.visitors += 1;
  db.analytics.conversionRate = parseFloat(((db.analytics.leads / db.analytics.visitors) * 100).toFixed(2));
  saveDatabase();
  res.json({ success: true });
});

app.get("/api/admin/audit-logs", requireAdmin, (req: Request, res: Response) => {
  res.json({ auditLogs: db.auditLogs });
});

// Admin Login
app.post("/api/admin/login", (req: Request, res: Response) => {
  const { password } = req.body;
  if (!ADMIN_PASSWORD) {
    console.error("ADMIN_PASSWORD is not set in environment variables — admin login is disabled.");
    return res.status(500).json({ error: "Admin login is not configured on the server." });
  }
  if (password === ADMIN_PASSWORD) {
    const token = signAdminToken();
    return res.json({ success: true, token, admin: { name: "Agency Administrator", role: "Super Admin" } });
  }
  return res.status(401).json({ error: "Invalid admin password. Authorization failed." });
});

// --- VITE & SERVER BOOTSTRAP ---
// NOTE: On Vercel (process.env.VERCEL is set), this app is imported by api/index.ts
// as a serverless function handler — it must NOT call app.listen() there, and static
// asset / SPA fallback serving is handled by Vercel's own static hosting from `dist/`,
// not by this Express app. Locally (`npm run dev` / `npm start`) it still runs as a
// normal long-lived Node server exactly as before.
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Dynamically imported so this (and its Rollup native binding) is never touched
    // on Vercel — startServer() itself only runs when !process.env.VERCEL (see below),
    // but a top-level static import would still be evaluated at module load either way.
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, {
      maxAge: '1y',
      setHeaders: (res, path) => {
        if (express.static.mime.lookup(path) === 'text/html') {
          res.setHeader('Cache-Control', 'public, max-age=0');
        }
      }
    }));
    app.get("*all", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Move Agency server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
