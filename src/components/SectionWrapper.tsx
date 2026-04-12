import React from 'react';
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
  } = config;

  const typeStyles = SECTION_TYPE_STYLES[section_type] || SECTION_TYPE_STYLES.section;
  const hasBgImage = !!bg_image_url;
  const photoArray = Array.isArray(photos) ? photos.filter(Boolean) : [];

  // OUTER: <section> = 100vw, holds background color/image/overlay
  // INNER: <div> = capped container (1200px / 1000px), centered, holds content

  const sectionStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    flex: '1 1 auto',
  };

  if (section_type === 'hero') {
    sectionStyle.minHeight = hero_height || '100vh';
  } else if (section_height && section_height !== 'auto') {
    sectionStyle.minHeight = section_height;
  }

  // Background goes on the SECTION (full-width)
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

  // Container styles — global max width from site_settings
  const containerMax = globalContainerMax;
  const paddingY = typeStyles.paddingY;
  const effectivePadY = paddingY === '0' ? (section_type === 'hero' ? '3rem' : '0') : paddingY;
  const SAFE_PAD_X = '1.5rem';

  return (
    <section
      id={`section-${section_key}`}
      data-section-id={id}
      style={sectionStyle}
      className={custom_css_class || undefined}
    >
      {/* Dark overlay for readability — on the section, not the container */}
      {hasBgImage && <div className="absolute inset-0 bg-black/45 z-0" aria-hidden="true" />}

      {/* Centered content container */}
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
          ...(section_type === 'hero' ? {
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center',
            minHeight: 'inherit',
          } : {}),
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
