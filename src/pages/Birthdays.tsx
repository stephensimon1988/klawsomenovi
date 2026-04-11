import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import SectionWrapper from '@/components/SectionWrapper';
import DynamicSection from '@/components/DynamicSection';
import { usePageSections } from '@/hooks/useCmsContent';

const Birthdays = () => {
  const { data: sections } = usePageSections('birthdays');

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      {sections?.map((s) => (
        <SectionWrapper key={s.id} config={s}>
          <DynamicSection sectionId={s.id} sectionType={s.section_type} />
        </SectionWrapper>
      ))}
      <KawaiiFooter />
    </div>
  );
};

export default Birthdays;
