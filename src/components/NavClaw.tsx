import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
import navClaw from '@/assets/nav-claw.webp';

const CLAW_WIDTH = 60;
// image aspect ~ 1053 / 1716
const CLAW_HEIGHT = Math.round((CLAW_WIDTH * 1716) / 1053);
const DROP_BOTTOM = 50; // bottom edge of claw 50px below top of viewport
const DROPPED_Y = DROP_BOTTOM - CLAW_HEIGHT; // top offset when dropped (negative)
const HIDDEN_Y = -CLAW_HEIGHT - 20;

interface NavClawProps {
  active: boolean;
  pointerX: number | null;
  minX?: number;
  maxX?: number;
}

const NavClaw = ({ active, pointerX, minX, maxX }: NavClawProps) => {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const y = useMotionValue(HIDDEN_Y);
  const xSpring = useSpring(x, { stiffness: 150, damping: 20, mass: 0.6 });
  const ySpring = useSpring(y, { stiffness: 120, damping: 14, mass: 0.8 });
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = reduced.matches;
    const update = () => setEnabled(desktop.matches && !reduced.matches);
    update();
    desktop.addEventListener('change', update);
    reduced.addEventListener('change', update);
    return () => {
      desktop.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    animate(y, active ? DROPPED_Y : HIDDEN_Y, {
      type: 'spring',
      stiffness: active ? 120 : 180,
      damping: active ? 14 : 22,
      mass: 0.8,
    });
  }, [active, enabled, y]);

  useEffect(() => {
    if (!enabled || pointerX == null) return;
    const half = CLAW_WIDTH / 2;
    const lo = (minX ?? 0) + half;
    const hi = (maxX ?? window.innerWidth) - half;
    const clamped = Math.max(lo, Math.min(hi, pointerX));
    x.set(clamped);
  }, [pointerX, enabled, x, minX, maxX]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 z-40 pointer-events-none"
      style={{ left: xSpring, y: ySpring, width: CLAW_WIDTH, marginLeft: -CLAW_WIDTH / 2 }}
    >
      <img
        src={navClaw}
        alt=""
        draggable={false}
        style={{ width: CLAW_WIDTH, height: 'auto', display: 'block' }}
      />
    </motion.div>
  );
};

export default NavClaw;