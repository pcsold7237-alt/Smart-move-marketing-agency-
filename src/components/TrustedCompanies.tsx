import React from 'react';
import { TrustedCompany } from '../types';

interface TrustedCompaniesProps {
  companies: TrustedCompany[];
  heading: string;
}

export const TrustedCompanies: React.FC<TrustedCompaniesProps> = ({ companies, heading }) => {
  if (!companies || companies.length === 0) return null;

  return (
    <section className="py-16 bg-[#030508] border-y border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-[#B7FF00] mb-8">
          {heading || "Trusted By High-Growth Founders & Category Leaders Worldwide"}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-85">
          {companies.map((comp) => (
            <div
              key={comp.id}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#0F1520]/60 border border-white/10 hover:border-[#B7FF00]/40 transition-all shadow-lg hover:scale-105"
            >
              {comp.logo ? (
                <img loading="lazy" decoding="async" src={comp.logo} alt={comp.name} className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-[#B7FF00]/20 text-[#B7FF00] flex items-center justify-center font-bold text-xs">
                  {comp.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-extrabold text-white tracking-wider font-display">
                {comp.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
