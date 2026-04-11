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
}

interface SectionWrapperProps {
  config: PageSectionConfig;
  children: React.ReactNode;
  fullControl?: boolean;
}

const COLUMN_GRID: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

/** Determine contrasting text color based on background */
function getAutoTextColor(bgColor: string): string {
  if (!bgColor) return '';
  // Parse hex
  if (bgColor.startsWith('#')) {
    const hex = bgColor.replace('#', '');
    if (hex.length < 6) return '';
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (r * 299 + g * 587 + b * 114) / 1000;
    if (luminance < 80) return '#ffffff';     // white on very dark
    if (luminance < 150) return '#f0ebe3';    // beige on medium-dark
    return '#1a1a2e';                          // dark on light
  }
  // Parse hsl
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
    section_height,
    wrapper_max_width,
    padding_y,
    bg_color,
    bg_image_url,
    custom_css_class,
    columns = 1,
    photos = [],
    text_color,
  } = config;

  const sectionStyle: React.CSSProperties = {};

  if (section_height && section_height !== 'auto') {
    sectionStyle.minHeight = section_height;
  }

  if (bg_color) {
    sectionStyle.backgroundColor = bg_color;
  }

  if (bg_image_url) {
    sectionStyle.backgroundImage = `url('${bg_image_url}')`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }

  // Auto-contrast text color
  const computedTextColor = text_color || getAutoTextColor(bg_color);
  if (computedTextColor) {
    sectionStyle.color = computedTextColor;
  }

  const photoArray = Array.isArray(photos) ? photos.filter(Boolean) : [];

  if (fullControl) {
    return (
      <div id={`section-${section_key}`} data-section-id={id} style={sectionStyle} className={custom_css_class || undefined}>
        {children}
        {photoArray.length > 0 && (
          <div style={{ maxWidth: wrapper_max_width === 'full' ? '100%' : (wrapper_max_width || '1200px'), marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingBottom: padding_y || '7rem' }}>
            <SectionPhotoGallery photos={photoArray} />
          </div>
        )}
      </div>
    );
  }

  const paddingValue = padding_y || '7rem';
  const maxWidth = wrapper_max_width === 'full' ? '100%' : (wrapper_max_width || '1200px');
  const useGrid = columns > 1;

  return (
    <div
      id={`section-${section_key}`}
      data-section-id={id}
      style={sectionStyle}
      className={custom_css_class || undefined}
    >
      <div
        style={{
          maxWidth,
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingTop: paddingValue,
          paddingBottom: photoArray.length > 0 ? '2rem' : paddingValue,
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
        }}
        className={useGrid ? `grid ${COLUMN_GRID[columns] || 'grid-cols-1'} gap-8` : undefined}
      >
        {children}
      </div>
      {photoArray.length > 0 && (
        <div
          style={{
            maxWidth,
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            paddingBottom: paddingValue,
          }}
        >
          <SectionPhotoGallery photos={photoArray} />
        </div>
      )}
    </div>
  );
};

export default SectionWrapper;
