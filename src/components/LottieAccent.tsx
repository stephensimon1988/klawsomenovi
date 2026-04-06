import { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';

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

const LottieAccent = ({ type = 'sparkle', className = '', loop = true, size = 80, url }: LottieAccentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    const fetchUrl = url || LOTTIE_URLS[type];
    let isMounted = true;

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setAnimationData(data);
      })
      .catch((err) => console.warn('Lottie load failed:', err));

    return () => {
      isMounted = false;
    };
  }, [type, url]);

  useEffect(() => {
    if (!containerRef.current || !animationData) return;

    const instance = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop,
      autoplay: true,
      animationData,
    });

    return () => {
      instance.destroy();
    };
  }, [animationData, loop]);

  return <div ref={containerRef} className={`pointer-events-none ${className}`} style={{ width: size, height: size }} aria-hidden="true" />;
};

export default LottieAccent;

