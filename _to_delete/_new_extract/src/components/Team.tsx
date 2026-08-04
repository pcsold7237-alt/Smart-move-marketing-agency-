import React, { useState } from 'react';
import { Linkedin, Twitter, Sparkles, X, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { TeamMember, SiteSettings } from '../types';

interface TeamProps {
  team: TeamMember[];
  heading?: string;
  settings?: SiteSettings;
}

export const Team: React.FC<TeamProps> = ({ team = [], heading, settings }) => {
  const [showBioModal, setShowBioModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const brandName = settings?.logoText || "Smart Move Marketing Agency";

  // Default fallback if team array is empty
  const displayTeam = team.length > 0 ? team : [
    {
      id: 'team-muniba',
      name: 'Muniba Inam',
      role: 'Lead Growth Engineer & Founder',
      image: '/cf25f7b8-0d91-4ab0-b025-9920ebc651f3.jpg',
      bio: `Visionary Growth Strategist and Lead Engineer at ${brandName}. Specialist in 360° performance marketing, high-converting funnel architecture, brand scaling, and data-driven revenue optimization.`,
      specialization: '360° Digital Growth Engine',
      socials: { linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' }
    }
  ];

  const handleOpenBio = (member: TeamMember) => {
    setSelectedMember(member);
    setShowBioModal(true);
  };

  return (
    <section id="team" className="py-24 relative bg-[#05080c] overflow-hidden">
      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B7FF00]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#B7FF00]" />
            <span>The Growth Engineers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display">
            {heading || "Meet The Masterminds Behind Your Growth Engine"}
          </h2>
          <p className="text-[#BFC5D2] text-sm sm:text-base leading-relaxed">
            Data-driven performance marketing, creative strategy, and scalable technical execution led by our team of growth engineers.
          </p>
        </div>

        {displayTeam.length === 1 ? (
          /* Single Featured Member Showcase Card */
          <div className="max-w-3xl mx-auto rounded-3xl bg-[#0f1520] border-2 border-[#B7FF00]/40 p-8 sm:p-12 shadow-[0_0_50px_rgba(183,255,0,0.2)] relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Picture Column with Integrated Logo */}
              <div className="md:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-[260px] aspect-square rounded-2xl overflow-hidden bg-black border-2 border-[#B7FF00] shadow-2xl group">
                  <img loading="lazy" decoding="async" src={displayTeam[0].image}
                    alt={displayTeam[0].name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Integrated Logo Watermark Overlay Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-[#B7FF00]/50 flex items-center gap-1.5 shadow-lg">
                    <div className="w-5 h-5 rounded-md overflow-hidden bg-[#B7FF00] p-0.5 shrink-0 flex items-center justify-center">
                      <img loading="lazy" decoding="async" src="/cf25f7b8-0d91-4ab0-b025-9920ebc651f3.jpg"
                        alt="Logo"
                        className="w-full h-full object-cover rounded-sm"
                      />
                    </div>
                    <span className="text-[10px] font-extrabold font-mono text-white tracking-wider">
                      {brandName.split(' ')[0]} <span className="text-[#B7FF00]">{brandName.split(' ')[1] || 'IT'}</span>
                    </span>
                  </div>

                  {/* Specialization Badge */}
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#B7FF00] text-black text-[10px] font-mono font-extrabold shadow-md uppercase tracking-wider">
                      {displayTeam[0].specialization}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Info Column */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B7FF00]/10 border border-[#B7FF00]/30 text-[#B7FF00] text-xs font-mono font-bold mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Lead Growth Engineer</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-white font-display tracking-tight">
                    {displayTeam[0].name}
                  </h3>
                  <p className="text-xs text-[#B7FF00] font-mono font-bold mt-1">
                    {displayTeam[0].role}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#BFC5D2] leading-relaxed font-sans">
                  {displayTeam[0].bio}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-[#B7FF00] shrink-0" />
                    <span>Scaled eCommerce & SaaS brands through paid social & Google Ads</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-[#B7FF00] shrink-0" />
                    <span>Architect of high-converting landing funnels & CRO optimization</span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenBio(displayTeam[0])}
                    className="px-5 py-2.5 rounded-full bg-[#B7FF00] text-black text-xs font-extrabold hover:bg-[#CFFF33] transition-all cursor-pointer shadow-[0_0_15px_rgba(183,255,0,0.3)]"
                  >
                    View Full Track Record
                  </button>

                  <div className="flex items-center gap-2">
                    {displayTeam[0].socials?.linkedin && (
                      <a
                        href={displayTeam[0].socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#B7FF00] border border-white/10"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {displayTeam[0].socials?.twitter && (
                      <a
                        href={displayTeam[0].socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#B7FF00] border border-white/10"
                        title="Twitter"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Multi-Member Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTeam.map((member) => (
              <div
                key={member.id}
                className="rounded-3xl bg-[#0f1520]/90 border border-white/10 p-6 flex flex-col justify-between transition-all hover:border-[#B7FF00]/40 group"
              >
                <div className="space-y-4">
                  {/* Photo with overlay */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black border border-white/10">
                    <img loading="lazy" decoding="async" src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                    />
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#B7FF00] text-[9px] font-mono font-extrabold tracking-wider border border-[#B7FF00]/30 uppercase">
                        {member.specialization}
                      </span>
                    </div>
                  </div>

                  {/* Bio details */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white tracking-tight">{member.name}</h3>
                    <p className="text-xs text-[#B7FF00] font-mono">{member.role}</p>
                  </div>

                  <p className="text-xs text-[#BFC5D2] line-clamp-3">{member.bio}</p>
                </div>

                <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenBio(member)}
                    className="text-xs font-bold text-[#B7FF00] hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    Track Record <Award className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex gap-2">
                    {member.socials?.linkedin && (
                      <a
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#B7FF00]/10 text-gray-400 hover:text-[#B7FF00] transition-all"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.socials?.twitter && (
                      <a
                        href={member.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#B7FF00]/10 text-gray-400 hover:text-[#B7FF00] transition-all"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bio Modal */}
      {showBioModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#0f1520] border border-[#B7FF00]/40">
            <button
              onClick={() => setShowBioModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#B7FF00] shrink-0 bg-black">
                <img loading="lazy" decoding="async" src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#B7FF00]/20 text-[#B7FF00] border border-[#B7FF00]/30 text-[10px] font-mono font-bold">
                  {selectedMember.specialization}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">{selectedMember.name}</h3>
                <p className="text-xs text-[#B7FF00] font-medium">{selectedMember.role}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-300 mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#B7FF00] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#B7FF00]" />
                Executive Bio & Growth Methodology
              </h4>
              <p className="leading-relaxed text-xs sm:text-sm text-[#BFC5D2] bg-white/5 p-4 rounded-2xl border border-white/5">
                {selectedMember.bio}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                {selectedMember.socials?.linkedin && (
                  <a
                    href={selectedMember.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#B7FF00] flex items-center gap-1.5 border border-white/10"
                  >
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}
              </div>

              <button
                onClick={() => setShowBioModal(false)}
                className="px-5 py-2 rounded-full bg-[#B7FF00] text-xs font-extrabold text-black hover:bg-[#CFFF33] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

