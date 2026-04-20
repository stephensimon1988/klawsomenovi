import { useState } from 'react';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import { useCmsTable, type FaqItem } from '@/hooks/useCmsContent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const categories = [
  { key: 'general', label: 'General' },
  { key: 'plushies', label: 'Plushies & Trade-Ins' },
  { key: 'birthdays', label: 'Birthdays' },
  { key: 'miscellaneous', label: 'Miscellaneous' },
];

const Faq = () => {
  const { data: items } = useCmsTable<FaqItem>('faq_items');
  const [active, setActive] = useState('general');

  const filtered = (items || []).filter((i) => (i.page || 'general') === active);

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />

      {/* Hero */}
      <section className="ds-page-hero">
        <div className="ds-container">
          <p className="ds-eyebrow mb-6">Help</p>
          <h1 className="ds-h1 mb-8 max-w-4xl">
            Frequently Asked Questions
          </h1>
          <p className="ds-lead max-w-2xl">
            Everything you wanted to know about claw machines, kawaii plushies, parties, and the rest.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="section-x border-b border-border sticky top-20 bg-background/95 backdrop-blur z-30">
        <div className="ds-container flex gap-8 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={`py-5 font-heading font-bold text-xs tracking-[0.15em] uppercase whitespace-nowrap border-b-2 transition-colors ${
                active === c.key ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Items */}
      <section className="section-y section-x">
        <div className="ds-container-narrow">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground font-body text-center py-20">No questions in this category yet.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filtered.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border-b border-border">
                  <AccordionTrigger className="text-left font-heading font-bold text-lg md:text-xl py-6 hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-base md:text-lg leading-relaxed text-muted-foreground pb-6">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>

      <KawaiiFooter />
    </div>
  );
};

export default Faq;
