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
      <section className="pt-32 pb-16 px-6 lg:px-12">
        <div className="container mx-auto">
          <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-6">Help</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold uppercase leading-[0.95] mb-8 max-w-4xl">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground font-body text-lg max-w-2xl">
            Everything you wanted to know about claw machines, kawaii plushies, parties, and the rest.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-6 lg:px-12 border-b border-border sticky top-20 bg-background/95 backdrop-blur z-30">
        <div className="container mx-auto flex gap-8 overflow-x-auto">
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
      <section className="py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-3xl">
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
