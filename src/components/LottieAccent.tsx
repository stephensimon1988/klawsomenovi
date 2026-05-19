import { useEffect, useRef, useState } from 'react';

const LOTTIE_URLS = {
  sparkle: 'https://lottie.host/2a60c0ba-9d13-42a8-b760-4b26b6c4e536/PGKTLwmOBd.json',
  star: 'https://lottie.host/0f0b3a44-7f1e-4533-85b4-1b0e1ca4c982/C2FWdKMitE.json',
  confetti: 'https://lottie.host/b7e53708-8b24-401c-b3b8-cf2f88f0e31a/1FQvbGKRfF.json',
  heart: 'https://lottie.host/bf861a28-c77a-4b4e-95d5-cd3d8e0fbe2a/pnFMUEhkoo.json',
} as const;

type AccentType = keyof typeof LOTTIE_URLS;

interface LottieAccentProps {
  type?: AccentType;
  className?: string;
  loop?: boolean;
  size?: number;
  url?: string;
}

// Cache results across mounts so a failed URL is never refetched.
const animationCache = new Map<string, object | 'failed'>();

const LottieAccent = ({ type = 'sparkle', className = '', loop = true, size = 80, url }: LottieAccentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [animationData, setAnimationData] = useState<object | null>(null);

  // Only mount fetch + lottie engine when the placeholder scrolls near viewport.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const fetchUrl = url || LOTTIE_URLS[type];
    const cached = animationCache.get(fetchUrl);
    if (cached === 'failed') return;
    if (cached) {
      setAnimationData(cached);
      return;
    }
    let cancelled = false;
    fetch(fetchUrl)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data) => {
        animationCache.set(fetchUrl, data);
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {
        animationCache.set(fetchUrl, 'failed');
      });
    return () => {
      cancelled = true;
    };
  }, [inView, type, url]);

  useEffect(() => {
    if (!containerRef.current || !animationData) return;
    let instance: { destroy: () => void } | null = null;
    let cancelled = false;
    // Dynamic import keeps lottie-web out of the main bundle.
    import('lottie-web').then(({ default: lottie }) => {
      if (cancelled || !containerRef.current) return;
      instance = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop,
        autoplay: true,
        animationData,
      });
    });
    return () => {
      cancelled = true;
      instance?.destroy();
    };
  }, [animationData, loop]);

  return <div ref={containerRef} className={`pointer-events-none ${className}`} style={{ width: size, height: size }} aria-hidden="true" />;
};

export default LottieAccent;

