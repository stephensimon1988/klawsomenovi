import { useEffect } from 'react';

/**
 * Mounts a single pointermove listener and updates the global
 * `--divider-x` CSS variable that KawaiiDivider reads. Smoothed via rAF lerp.
 * Disabled for reduced-motion users and coarse-pointer (touch) devices.
 */
const DividerParallax = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || coarse) return;

    let targetNX = 0; // -1..1
    let currentNX = 0;
    let raf = 0;
    const root = document.documentElement;
    const MAX_VW = 0.05; // 5vw of slack each direction

    const tick = () => {
      currentNX += (targetNX - currentNX) * 0.08;
      const vw = window.innerWidth;
      const px = -currentNX * vw * MAX_VW; // image follows cursor opposite (parallax feel)
      root.style.setProperty('--divider-x', `${px.toFixed(2)}px`);
      if (Math.abs(targetNX - currentNX) > 0.0005) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      targetNX = Math.max(-1, Math.min(1, nx));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
      root.style.removeProperty('--divider-x');
    };
  }, []);

  return null;
};

export default DividerParallax;