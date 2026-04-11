import React from 'react';
import SectionPhotoGallery from './SectionPhotoGallery';

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
}

interface SectionWrapperProps {
  config: PageSectionConfig;
  children: React.ReactNode;
  fullControl?: boolean;
}

/** Fixed styles per section type */
const SECTION_TYPE_STYLES: Record<string, { padding: string; maxWidth: string; minHeight?: string }> = {
  hero: { padding: '0', maxWidth: '100%' },
  section: { padding: '60px 0', maxWidth: '1200px' },
  small: { padding: '30px 0', maxWidth: '1000px' },
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

const SectionWrapper = ({ config, children, fullControl = false }: SectionWrapperProps) => {
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
    // Legacy fallbacks
    section_height,
    wrapper_max_width,
    padding_y,
  } = config;

  // Use section_type system if available, otherwise fall back to legacy fields
  const typeStyles = SECTION_TYPE_STYLES[section_type] || SECTION_TYPE_STYLES.section;
  
  const sectionStyle: React.CSSProperties = {};

  // Height: hero uses hero_height, others are auto
  if (section_type === 'hero') {
    sectionStyle.minHeight = hero_height || '100vh';
  } else if (section_height && section_height !== 'auto') {
    // Legacy fallback
    sectionStyle.minHeight = section_height;
  }

  if (bg_color) sectionStyle.backgroundColor = bg_color;

  if (bg_image_url) {
    sectionStyle.backgroundImage = `url('${bg_image_url}')`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }

  const computedTextColor = text_color || getAutoTextColor(bg_color);
  if (computedTextColor) sectionStyle.color = computedTextColor;

  const photoArray = Array.isArray(photos) ? photos.filter(Boolean) : [];

  // Derive container styles from section_type
  const maxWidth = typeStyles.maxWidth;
  const paddingValue = typeStyles.padding;

  if (fullControl) {
    return (
      <div id={`section-${section_key}`} data-section-id={id} style={sectionStyle} className={custom_css_class || undefined}>
        {children}
        {photoArray.length > 0 && (
          <div style={{ maxWidth: maxWidth === '100%' ? '100%' : maxWidth, marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingBottom: '2rem' }}>
            <SectionPhotoGallery photos={photoArray} />
          </div>
        )}
      </div>
    );
  }

  // Parse padding into top/bottom
  const paddingParts = paddingValue.split(' ');
  const paddingTop = paddingParts[0];
  const paddingBottom = paddingParts.length > 1 ? paddingParts[1] : paddingParts[0];

  return (
    <div
      id={`section-${section_key}`}
      data-section-id={id}
      style={sectionStyle}
      className={custom_css_class || undefined}
    >
      <div
        style={{
          maxWidth: maxWidth === '100%' ? '100%' : maxWidth,
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingTop,
          paddingBottom: photoArray.length > 0 ? '2rem' : paddingBottom,
          paddingLeft: maxWidth === '100%' ? '0' : '1.5rem',
          paddingRight: maxWidth === '100%' ? '0' : '1.5rem',
        }}
      >
        {children}
      </div>
      {photoArray.length > 0 && (
        <div
          style={{
            maxWidth: maxWidth === '100%' ? '100%' : maxWidth,
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            paddingBottom,
          }}
        >
          <SectionPhotoGallery photos={photoArray} />
        </div>
      )}
    </div>
  );
};

export default SectionWrapper;
