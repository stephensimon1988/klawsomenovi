import React from 'react';

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
}

interface SectionWrapperProps {
  config: PageSectionConfig;
  children: React.ReactNode;
  /** If true, the wrapper applies no inner container (for heroes that manage their own layout) */
  fullControl?: boolean;
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

  if (fullControl) {
    return (
      <div id={`section-${section_key}`} data-section-id={id} style={sectionStyle} className={custom_css_class || undefined}>
        {children}
      </div>
    );
  }

  const paddingValue = padding_y || '7rem';
  const maxWidth = wrapper_max_width === 'full' ? '100%' : (wrapper_max_width || '1200px');

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
          paddingBottom: paddingValue,
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SectionWrapper;
