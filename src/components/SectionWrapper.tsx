import React, { useEffect, useRef, useState } from 'react';
import SectionPhotoGallery from './SectionPhotoGallery';
import { useContainerMaxWidth } from '@/contexts/SiteSettingsContext';

export interface PageSectionConfig {
  id: string;
  page: string;
  section_key: string;
  label: string;
  sort_order: number;
  is_visible: boolean;
  section_height: string;
  wrapper_max_width: string;
  padding_y: string;
  bg_color: string;
  bg_image_url: string;
  custom_css_class: string;
  columns?: number;
  photos?: string[];
  text_color?: string;
  layout_json?: Record<string, any>;
  section_type?: 'hero' | 'section' | 'small';
  hero_height?: '50vh' | '100vh';
  layout_template?: string;
  animation?: string;
}

interface SectionWrapperProps {
  config: PageSectionConfig;
  children: React.ReactNode;
}

/** Fixed styles per section type — containerMax now comes from global site_settings */
const SECTION_TYPE_STYLES: Record<string, { paddingY: string }> = {
  hero: { paddingY: '0' },
  section: { paddingY: '60px' },
  small: { paddingY: '30px' },
};

/** 25 animation presets */
export const ANIMATION_PRESETS: Record<string, { label: string; style: React.CSSProperties; animatedStyle: React.CSSProperties }> = {
  '': { label: 'None', style: {}, animatedStyle: {} },
  'fade-in': { label: 'Fade In', style: { opacity: 0, transition: 'opacity 0.8s ease-out' }, animatedStyle: { opacity: 1 } },
  'fade-up': { label: 'Fade Up', style: { opacity: 0, transform: 'translateY(60px)', transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }, animatedStyle: { opacity: 1, transform: 'translateY(0)' } },
  'fade-down': { label: 'Fade Down', style: { opacity: 0, transform: 'translateY(-60px)', transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }, animatedStyle: { opacity: 1, transform: 'translateY(0)' } },
  'fade-left': { label: 'Fade Left', style: { opacity: 0, transform: 'translateX(-60px)', transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }, animatedStyle: { opacity: 1, transform: 'translateX(0)' } },
  'fade-right': { label: 'Fade Right', style: { opacity: 0, transform: 'translateX(60px)', transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }, animatedStyle: { opacity: 1, transform: 'translateX(0)' } },
  'zoom-in': { label: 'Zoom In', style: { opacity: 0, transform: 'scale(0.85)', transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }, animatedStyle: { opacity: 1, transform: 'scale(1)' } },
  'zoom-out': { label: 'Zoom Out', style: { opacity: 0, transform: 'scale(1.15)', transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }, animatedStyle: { opacity: 1, transform: 'scale(1)' } },
  'flip-up': { label: 'Flip Up', style: { opacity: 0, transform: 'perspective(800px) rotateX(20deg) translateY(40px)', transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }, animatedStyle: { opacity: 1, transform: 'perspective(800px) rotateX(0) translateY(0)' } },
  'flip-down': { label: 'Flip Down', style: { opacity: 0, transform: 'perspective(800px) rotateX(-20deg) translateY(-40px)', transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }, animatedStyle: { opacity: 1, transform: 'perspective(800px) rotateX(0) translateY(0)' } },
  'flip-left': { label: 'Flip Left', style: { opacity: 0, transform: 'perspective(800px) rotateY(20deg) translateX(-40px)', transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }, animatedStyle: { opacity: 1, transform: 'perspective(800px) rotateY(0) translateX(0)' } },
  'flip-right': { label: 'Flip Right', style: { opacity: 0, transform: 'perspective(800px) rotateY(-20deg) translateX(40px)', transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }, animatedStyle: { opacity: 1, transform: 'perspective(800px) rotateY(0) translateX(0)' } },
  'slide-up': { label: 'Slide Up', style: { transform: 'translateY(100px)', transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }, animatedStyle: { transform: 'translateY(0)' } },
  'slide-down': { label: 'Slide Down', style: { transform: 'translateY(-100px)', transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }, animatedStyle: { transform: 'translateY(0)' } },
  'slide-left': { label: 'Slide Left', style: { transform: 'translateX(-100px)', transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }, animatedStyle: { transform: 'translateX(0)' } },
  'slide-right': { label: 'Slide Right', style: { transform: 'translateX(100px)', transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }, animatedStyle: { transform: 'translateX(0)' } },
  'rotate-in': { label: 'Rotate In', style: { opacity: 0, transform: 'rotate(-10deg) scale(0.9)', transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }, animatedStyle: { opacity: 1, transform: 'rotate(0) scale(1)' } },
  'rotate-in-right': { label: 'Rotate In Right', style: { opacity: 0, transform: 'rotate(10deg) scale(0.9)', transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }, animatedStyle: { opacity: 1, transform: 'rotate(0) scale(1)' } },
  'bounce-in': { label: 'Bounce In', style: { opacity: 0, transform: 'scale(0.5)', transition: 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)' }, animatedStyle: { opacity: 1, transform: 'scale(1)' } },
  'elastic-in': { label: 'Elastic In', style: { opacity: 0, transform: 'scale(0.7) translateY(30px)', transition: 'opacity 0.5s ease-out, transform 0.8s cubic-bezier(0.68,-0.55,0.265,1.55)' }, animatedStyle: { opacity: 1, transform: 'scale(1) translateY(0)' } },
  'blur-in': { label: 'Blur In', style: { opacity: 0, filter: 'blur(12px)', transition: 'opacity 0.8s ease-out, filter 0.8s ease-out' }, animatedStyle: { opacity: 1, filter: 'blur(0)' } },
  'skew-up': { label: 'Skew Up', style: { opacity: 0, transform: 'skewY(4deg) translateY(40px)', transition: 'opacity 0.7s ease-out, transform 0.7s ease-out' }, animatedStyle: { opacity: 1, transform: 'skewY(0) translateY(0)' } },
  'skew-left': { label: 'Skew Left', style: { opacity: 0, transform: 'skewX(6deg) translateX(-40px)', transition: 'opacity 0.7s ease-out, transform 0.7s ease-out' }, animatedStyle: { opacity: 1, transform: 'skewX(0) translateX(0)' } },
  'clip-up': { label: 'Clip Reveal Up', style: { clipPath: 'inset(100% 0 0 0)', transition: 'clip-path 0.8s cubic-bezier(0.25,0.46,0.45,0.94)' }, animatedStyle: { clipPath: 'inset(0 0 0 0)' } },
  'clip-left': { label: 'Clip Reveal Left', style: { clipPath: 'inset(0 100% 0 0)', transition: 'clip-path 0.8s cubic-bezier(0.25,0.46,0.45,0.94)' }, animatedStyle: { clipPath: 'inset(0 0 0 0)' } },
};

/** Determine contrasting text color based on background */
function getAutoTextColor(bgColor: string): string {
  if (!bgColor) return '';
  if (bgColor.startsWith('#')) {
    const hex = bgColor.replace('#', '');
    if (hex.length < 6) return '';
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (r * 299 + g * 587 + b * 114) / 1000;
    if (luminance < 80) return '#ffffff';
    if (luminance < 150) return '#f0ebe3';
    return '#1a1a2e';
  }
  const match = bgColor.match(/hsl\(\s*[\d.]+\s*,\s*[\d.]+%?\s*,\s*([\d.]+)%?\s*\)/);
  if (match) {
    const l = parseFloat(match[1]);
    if (l < 30) return '#ffffff';
    if (l < 50) return '#f0ebe3';
    return '#1a1a2e';
  }
  return '';
}

const SectionWrapper = ({ config, children }: SectionWrapperProps) => {
  const globalContainerMax = useContainerMaxWidth();
  const {
    id,
    section_key,
    bg_color,
    bg_image_url,
    custom_css_class,
    photos = [],
    text_color,
    section_type = 'section',
    hero_height = '100vh',
    section_height,
    animation = '',
  } = config;

  const typeStyles = SECTION_TYPE_STYLES[section_type] || SECTION_TYPE_STYLES.section;
  const hasBgImage = !!bg_image_url;
  const photoArray = Array.isArray(photos) ? photos.filter(Boolean) : [];

  // Animation: IntersectionObserver
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(!animation);

  useEffect(() => {
    if (!animation) { setIsVisible(true); return; }
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animation]);

  const preset = ANIMATION_PRESETS[animation] || ANIMATION_PRESETS[''];
  const animStyle = isVisible ? preset.animatedStyle : preset.style;

  const sectionStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    ...animStyle,
  };

  if (section_type === 'hero') {
    sectionStyle.minHeight = hero_height || '100vh';
  } else if (section_height && section_height !== 'auto') {
    sectionStyle.minHeight = section_height;
  }

  if (bg_color) sectionStyle.backgroundColor = bg_color;
  if (hasBgImage) {
    sectionStyle.backgroundImage = `url('${bg_image_url}')`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }

  const computedTextColor = text_color || (hasBgImage ? '#ffffff' : getAutoTextColor(bg_color));
  if (computedTextColor) sectionStyle.color = computedTextColor;

  const textShadowStyle: React.CSSProperties = hasBgImage
    ? { textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)' }
    : {};

  const containerMax = globalContainerMax;
  const paddingY = typeStyles.paddingY;
  const effectivePadY = paddingY === '0' ? (section_type === 'hero' ? '3rem' : '0') : paddingY;
  const SAFE_PAD_X = '1.5rem';

  return (
    <section
      ref={sectionRef}
      id={`section-${section_key}`}
      data-section-id={id}
      style={sectionStyle}
      className={custom_css_class || undefined}
    >
      {hasBgImage && <div className="absolute inset-0 bg-black/45 z-0" aria-hidden="true" />}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: containerMax,
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: SAFE_PAD_X,
          paddingRight: SAFE_PAD_X,
          paddingTop: effectivePadY,
          paddingBottom: photoArray.length > 0 ? '2rem' : effectivePadY,
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'center',
          flex: '1 1 auto',
          ...textShadowStyle,
        }}
        className="text-center"
      >
        {children}
      </div>

      {photoArray.length > 0 && (
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: containerMax,
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: SAFE_PAD_X,
            paddingRight: SAFE_PAD_X,
            paddingBottom: effectivePadY,
          }}
        >
          <SectionPhotoGallery photos={photoArray} />
        </div>
      )}
    </section>
  );
};

export default SectionWrapper;