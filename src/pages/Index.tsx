import KawaiiNav from '@/components/KawaiiNav';
import KawaiiHero from '@/components/KawaiiHero';
import KawaiiVisit from '@/components/KawaiiVisit';
import KawaiiAbout from '@/components/KawaiiAbout';
import KawaiiTokenPrices from '@/components/KawaiiTokenPrices';
import KawaiiReviews from '@/components/KawaiiReviews';
import KawaiiNews from '@/components/KawaiiNews';
import KawaiiGiftCards from '@/components/KawaiiGiftCards';
import KawaiiStory from '@/components/KawaiiStory';
import KawaiiFooter from '@/components/KawaiiFooter';
import SectionWrapper from '@/components/SectionWrapper';
import DynamicSection from '@/components/DynamicSection';
import { usePageSections, type PageSection } from '@/hooks/useCmsContent';

const SECTION_MAP: Record<string, React.ComponentType> = {
  hero: KawaiiHero,
  about: KawaiiAbout,
  visit: KawaiiVisit,
  tokens: KawaiiTokenPrices,
  reviews: KawaiiReviews,
  news: KawaiiNews,
  giftcards: KawaiiGiftCards,
  story: KawaiiStory,
};

// Sections that manage their own full-bleed layout
const FULL_CONTROL_SECTIONS = ['hero', 'about', 'visit', 'tokens', 'reviews', 'news', 'giftcards', 'story'];

const SchedulingPlaceholder = () => (
  <>
    <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-4">Schedule</p>
    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">Book Your Visit</h2>
    <p className="text-muted-foreground font-body text-lg mb-10">Schedule your next Klawsome adventure!</p>
    <div className="rounded-2xl border border-border bg-background p-16 text-muted-foreground text-center font-body">
      Acuity scheduling form coming soon
    </div>
  </>
);

// Fallback sections when DB hasn't loaded yet
const FALLBACK_SECTIONS: PageSection[] = [
  { id: 'f1', page: 'home', section_key: 'hero', label: 'Hero', sort_order: 1, is_visible: true, section_height: '100vh', wrapper_max_width: 'full', padding_y: '0', bg_color: '', bg_image_url: '', custom_css_class: '', columns: 1 },
  { id: 'f2', page: 'home', section_key: 'about', label: 'About', sort_order: 2, is_visible: true, section_height: 'auto', wrapper_max_width: '1200px', padding_y: '7rem', bg_color: '', bg_image_url: '', custom_css_class: '', columns: 1 },
  { id: 'f3', page: 'home', section_key: 'visit', label: 'Visit', sort_order: 3, is_visible: true, section_height: 'auto', wrapper_max_width: '1200px', padding_y: '7rem', bg_color: '', bg_image_url: '', custom_css_class: '', columns: 1 },
  { id: 'f4', page: 'home', section_key: 'tokens', label: 'Tokens', sort_order: 4, is_visible: true, section_height: 'auto', wrapper_max_width: '1200px', padding_y: '7rem', bg_color: '', bg_image_url: '', custom_css_class: '', columns: 1 },
  { id: 'f5', page: 'home', section_key: 'reviews', label: 'Reviews', sort_order: 5, is_visible: true, section_height: 'auto', wrapper_max_width: '1200px', padding_y: '7rem', bg_color: '', bg_image_url: '', custom_css_class: '', columns: 1 },
  { id: 'f6', page: 'home', section_key: 'news', label: 'News', sort_order: 6, is_visible: true, section_height: 'auto', wrapper_max_width: '1200px', padding_y: '7rem', bg_color: '', bg_image_url: '', custom_css_class: '', columns: 1 },
  { id: 'f7', page: 'home', section_key: 'giftcards', label: 'Gift Cards', sort_order: 7, is_visible: true, section_height: 'auto', wrapper_max_width: '1200px', padding_y: '7rem', bg_color: '', bg_image_url: '', custom_css_class: '', columns: 1 },
  { id: 'f8', page: 'home', section_key: 'scheduling', label: 'Scheduling', sort_order: 8, is_visible: true, section_height: 'auto', wrapper_max_width: '900px', padding_y: '7rem', bg_color: '', bg_image_url: '', custom_css_class: 'bg-secondary/50', columns: 1 },
  { id: 'f9', page: 'home', section_key: 'story', label: 'Story', sort_order: 9, is_visible: true, section_height: 'auto', wrapper_max_width: '900px', padding_y: '7rem', bg_color: '', bg_image_url: '', custom_css_class: '', columns: 1 },
];

const Index = () => {
  const { data: sections } = usePageSections('home');
  const displaySections = sections && sections.length > 0 ? sections : FALLBACK_SECTIONS;

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      {displaySections.map((s) => {
        const isCustom = s.section_key.startsWith('custom:');
        const isFullControl = FULL_CONTROL_SECTIONS.includes(s.section_key);

        if (isCustom) {
          return (
            <SectionWrapper key={s.id} config={s}>
              <DynamicSection sectionId={s.id} layoutJson={s.layout_json} />
            </SectionWrapper>
          );
        }

        if (s.section_key === 'scheduling') {
          return (
            <SectionWrapper key={s.id} config={s}>
              <SchedulingPlaceholder />
            </SectionWrapper>
          );
        }

        const Component = SECTION_MAP[s.section_key];
        if (!Component) return null;

        return (
          <SectionWrapper key={s.id} config={s} fullControl={isFullControl}>
            <Component />
          </SectionWrapper>
        );
      })}
      <KawaiiFooter />
    </div>
  );
};

export default Index;
