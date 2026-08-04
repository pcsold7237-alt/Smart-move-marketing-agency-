import { useState, useEffect } from 'react';

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-gray-900/50">
      <div
        className="h-full bg-gradient-to-r from-[#B7FF00] via-[#9BE000] to-[#CFFF33] transition-all duration-150 ease-out shadow-[0_0_12px_#B7FF00]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

export function CustomCursorGlow() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setPosition({ x: e.clientX, y: e.clientY });
          if (!visible) setVisible(true);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden md:block"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(183, 255, 0, 0.05), transparent 80%)`,
      }}
    />
  );
}

export function CookieBanner() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('smartmove_cookie_accepted');
    if (!stored) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('smartmove_cookie_accepted', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-md p-5 rounded-2xl glass-card border border-[#B7FF00]/20 shadow-2xl backdrop-blur-xl animate-bounce-subtle">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-[#B7FF00]/10 text-[#B7FF00] border border-[#B7FF00]/30">
          🍪
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white">Cookie & Performance Telemetry</h4>
          <p className="text-xs text-[#BFC5D2] mt-1 leading-relaxed">
            We use essential cookies and anonymized performance analytics to optimize your growth audit session experience.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleAccept}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#B7FF00] to-[#9BE000] text-xs font-extrabold text-black hover:opacity-90 transition-opacity cursor-pointer shadow-[0_0_15px_rgba(183,255,0,0.3)]"
            >
              Accept All
            </button>
            <button
              onClick={handleAccept}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
