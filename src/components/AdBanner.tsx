import React, { useState, useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
  adClient?: string;
  adSlot?: string;
  onVisibilityChange?: (visible: boolean) => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  className = '',
  adClient = (import.meta as any).env?.VITE_ADSENSE_CLIENT_ID,
  adSlot = (import.meta as any).env?.VITE_ADSENSE_SLOT_ID,
  onVisibilityChange,
}) => {
  const [isAdLoaded, setIsAdLoaded] = useState<boolean>(false);
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (!adClient || !adSlot) {
      setIsAdLoaded(false);
      onVisibilityChange?.(false);
      return;
    }

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // ignore
    }

    const ins = insRef.current;
    if (!ins) return;

    const checkAdStatus = () => {
      const status = ins.getAttribute('data-ad-status');
      const hasIframe = ins.querySelector('iframe') !== null;
      const hasContent = ins.children.length > 0;

      if (status === 'filled' || hasIframe || (hasContent && status !== 'unfilled')) {
        setIsAdLoaded(true);
        onVisibilityChange?.(true);
      } else if (status === 'unfilled') {
        setIsAdLoaded(false);
        onVisibilityChange?.(false);
      }
    };

    const observer = new MutationObserver(checkAdStatus);
    observer.observe(ins, { attributes: true, childList: true, subtree: true });

    checkAdStatus();
    const timer = setTimeout(checkAdStatus, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [adClient, adSlot, onVisibilityChange]);

  if (!adClient || !adSlot || !isAdLoaded) {
    return (
      <div className="hidden" aria-hidden="true">
        {adClient && adSlot && (
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: 'none' }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
          />
        )}
      </div>
    );
  }

  return (
    <aside
      aria-label="Sponsored Advertisement"
      className={`fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] transition-all ${className}`}
    >
      <div className="max-w-4xl mx-auto px-2 sm:px-4 h-[50px] md:h-[60px] flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </aside>
  );
};
