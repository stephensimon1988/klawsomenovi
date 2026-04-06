import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type AnimationType = 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown' | 'fadeIn' | 'parallax' | 'scaleIn';

interface GsapScrollOptions {
  type?: AnimationType;
  duration?: number;
  delay?: number;
  distance?: number;
  scrub?: boolean | number;
  start?: string;
  end?: string;
  parallaxSpeed?: number;
}

export function useGsapScroll<T extends HTMLElement = HTMLDivElement>(options: GsapScrollOptions = {}) {
  const ref = useRef<T>(null);
  const {
    type = 'slideUp',
    duration = 1,
    delay = 0,
    distance = 80,
    scrub = false,
    start = 'top 85%',
    end = 'bottom 20%',
    parallaxSpeed = 0.3,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let fromVars: gsap.TweenVars = {};
    let toVars: gsap.TweenVars = {};

    switch (type) {
      case 'slideLeft':
        fromVars = { x: -distance, opacity: 0 };
        toVars = { x: 0, opacity: 1 };
        break;
      case 'slideRight':
        fromVars = { x: distance, opacity: 0 };
        toVars = { x: 0, opacity: 1 };
        break;
      case 'slideUp':
        fromVars = { y: distance, opacity: 0 };
        toVars = { y: 0, opacity: 1 };
        break;
      case 'slideDown':
        fromVars = { y: -distance, opacity: 0 };
        toVars = { y: 0, opacity: 1 };
        break;
      case 'fadeIn':
        fromVars = { opacity: 0 };
        toVars = { opacity: 1 };
        break;
      case 'parallax':
        fromVars = { y: distance * parallaxSpeed * 100 };
        toVars = { y: -distance * parallaxSpeed * 50 };
        break;
      case 'scaleIn':
        fromVars = { scale: 0.85, opacity: 0 };
        toVars = { scale: 1, opacity: 1 };
        break;
    }

    const tween = gsap.fromTo(el, fromVars, {
      ...toVars,
      duration: scrub ? undefined : duration,
      delay: scrub ? undefined : delay,
      ease: scrub ? 'none' : 'power3.out',
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub: scrub === true ? 1 : scrub || false,
        toggleActions: scrub ? undefined : 'play none none none',
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [type, duration, delay, distance, scrub, start, end, parallaxSpeed]);

  return ref;
}

// Stagger children animation
export function useGsapStagger<T extends HTMLElement = HTMLDivElement>(options: {
  stagger?: number;
  type?: AnimationType;
  duration?: number;
  distance?: number;
  childSelector?: string;
} = {}) {
  const ref = useRef<T>(null);
  const {
    stagger = 0.12,
    type = 'slideUp',
    duration = 0.8,
    distance = 60,
    childSelector = ':scope > *',
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll(childSelector);
    if (!children.length) return;

    let fromVars: gsap.TweenVars = {};
    let toVars: gsap.TweenVars = {};

    switch (type) {
      case 'slideUp':
        fromVars = { y: distance, opacity: 0 };
        toVars = { y: 0, opacity: 1 };
        break;
      case 'slideLeft':
        fromVars = { x: -distance, opacity: 0 };
        toVars = { x: 0, opacity: 1 };
        break;
      case 'slideRight':
        fromVars = { x: distance, opacity: 0 };
        toVars = { x: 0, opacity: 1 };
        break;
      case 'scaleIn':
        fromVars = { scale: 0.85, opacity: 0 };
        toVars = { scale: 1, opacity: 1 };
        break;
      default:
        fromVars = { y: distance, opacity: 0 };
        toVars = { y: 0, opacity: 1 };
    }

    const tween = gsap.fromTo(children, fromVars, {
      ...toVars,
      duration,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [stagger, type, duration, distance, childSelector]);

  return ref;
}
