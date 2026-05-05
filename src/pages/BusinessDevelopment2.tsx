import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import KawaiiDivider from '@/components/KawaiiDivider';
import PageHero from '@/components/PageHero';
import { toast } from 'sonner';
import {
  useCmsTable,
  usePageHero,
  type BusinessSection,
  type BusinessPricingTier,
  type BusinessHowStep,
} from '@/hooks/useCmsContent';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

type ContentSection = {
  id: string;
  page_key: string;
  section_key: string;
  eyebrow: string;
  headline: string;
  body: string;
  cta_text: string;
  cta_url: string;
  image_url: string;
  list_items: any;
  sort_order: number;
};

function usePageContent(pageKey: string) {
  return useQuery<ContentSection[]>({
    queryKey: ['cms', 'page_content_sections', pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content_sections' as any)
        .select('*')
        .eq('page_key', pageKey)
        .order('sort_order', { ascending: true });
      if (error) return [];
      return (data || []) as unknown as ContentSection[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

const fallbackSections: BusinessSection[] = [
  {
    id: '1', section_key: 'hosted',
    title: 'Host a Klawsome Machine in Your Business',
    subtitle: "We place a machine in your space, handle everything, and you earn a share of every token played — no upfront cost, no hassle.",
    description: 'We handle the machine, the prizes, the repairs — everything. You simply provide the space and a 2.4GHz WiFi connection, and collect your 10% share each month.',
    bullet_points: ['Machine delivery & installation', 'All prize stocking & restocking', 'All repairs & maintenance', 'Revenue tracking & monthly payouts', 'Ongoing machine operation'],
    image_url: '', sort_order: 0,
  },
  {
    id: '2', section_key: 'partner',
    title: 'Become a Klawsome Partner',
    subtitle: 'Open your own fully-equipped Klawsome claw arcade. We give you everything you need — the brand, the machines, the training, the marketing. You bring the vision.',
    description: '',
    bullet_points: [],
    image_url: '', sort_order: 1,
  },
  {
    id: '3', section_key: 'plushie',
    title: 'Custom Plushie Orders',
    subtitle: "Have a character, mascot, or design in mind? Share it with us and we'll create a quote. Simple to life-size, we do it all — for businesses and individuals alike.",
    description: '',
    bullet_points: [],
    image_url: '', sort_order: 2,
  },
];

const fallbackPricing: BusinessPricingTier[] = [
  { id: '1', name: 'Standard Plushie', price: '$4–6', features: ['Simple Design', 'Clean shapes, minimal detail. Great for branded giveaways and simple mascots.'], is_highlight: false, sort_order: 0 },
  { id: '2', name: 'Detailed Plushie', price: '$6–8', features: ['Complex Design', 'Highly detailed characters with accessories, facial features, and layered textures.'], is_highlight: true, sort_order: 1 },
  { id: '3', name: 'Oversized Plushie', price: '$15–40', features: ['XL / Life-Size', 'Statement-making XL and life-size plushies. Perfect for displays, events, and premium prizes.'], is_highlight: false, sort_order: 2 },
];

const fallbackHowSteps: BusinessHowStep[] = [
  { id: '1', title: 'Reach Out', description: 'Fill out the form below and tell us about yourself, your business, and which opportunity interests you.', icon: '1', sort_order: 0 },
  { id: '2', title: 'We Connect', description: 'Our team follows up within 1–2 business days to learn more and answer your questions.', icon: '2', sort_order: 1 },
  { id: '3', title: 'Review & Plan', description: 'We review your location or concept together and map out the right path forward.', icon: '3', sort_order: 2 },
  { id: '4', title: 'Launch!', description: "Machines installed, plushies stocked, partners trained — you're ready to go.", icon: '4', sort_order: 3 },
];

const businessProvides = [
  'Floor space for the machine',
  'One standard power outlet',
  'A 2.4GHz WiFi connection',
];

const fallbackVenues = ['🍜 Restaurants', '🧋 Bubble Tea Shops', '🎳 Entertainment Venues', '🛍️ Retail Stores', '⏳ Waiting Areas', '🏪 High Foot Traffic Spaces'];

const fallbackPartnerIncludes = [
  { icon: '🎰', title: 'Equipment', desc: 'Commercial-grade claw machines, fully set up and ready to play from day one.' },
  { icon: '🧸', title: 'Plushies & Prizes', desc: 'Our curated kawaii-style plushie inventory, restocked as you grow.' },
  { icon: '✨', title: 'The Brand', desc: 'Full use of the Klawsome name, look, feel, and identity customers already love.' },
  { icon: '📋', title: 'Training', desc: 'Hands-on training for you and your staff on how to run everything smoothly.' },
  { icon: '📣', title: 'Marketing Materials', desc: 'Ready-to-use social media assets, templates, and launch marketing support.' },
  { icon: '🤝', title: 'Ongoing Support', desc: "We're in your corner as you scale — operational guidance and continued partnership." },
];

const fallbackPlushieSteps = [
  { icon: '📝', title: 'Share your design', desc: 'Send us a sketch, image, or description of your plushie concept.' },
  { icon: '💬', title: 'We send a quote', desc: 'We review complexity, size, and quantity then get back to you with pricing.' },
  { icon: '✅', title: 'Approve & produce', desc: 'Once approved, we handle production and delivery of your custom order.' },
];

const BusinessDevelopment2 = () => {
  const [formData, setFormData] = useState({ name: '', email: '', opportunity: '', business_type: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'hosted' | 'partner' | 'plushie'>('hosted');
  const tabsBarRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'hosted', label: '🎰 Host a Machine' },
    { id: 'partner', label: '⭐ Become a Partner' },
    { id: 'plushie', label: '🧸 Custom Plushies' },
  ] as const;

  const handleTabClick = (id: 'hosted' | 'partner' | 'plushie') => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 80;
      const offset = navHeight + (tabsBarRef.current?.offsetHeight || 0) + 12;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const ids: Array<'hosted' | 'partner' | 'plushie'> = ['hosted', 'partner', 'plushie'];
    const handler = () => {
      const navHeight = 80;
      const offset = navHeight + (tabsBarRef.current?.offsetHeight || 0) + 24;
      let current: 'hosted' | 'partner' | 'plushie' = 'hosted';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - offset <= 0) current = id;
      }
      setActiveTab(current);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const { data: hero } = usePageHero('business-development');
  const { data: dbSections } = useCmsTable<BusinessSection>('business_sections');
  const { data: dbPricing } = useCmsTable<BusinessPricingTier>('business_pricing_tiers');
  const { data: dbHowSteps } = useCmsTable<BusinessHowStep>('business_how_steps');
  const { data: dbContent } = usePageContent('business-development');

  const sections = dbSections?.length ? dbSections : fallbackSections;
  const pricingTiers = dbPricing?.length ? dbPricing : fallbackPricing;
  const howSteps = dbHowSteps?.length ? dbHowSteps : fallbackHowSteps;

  const hosted = sections.find(s => s.section_key === 'hosted') || fallbackSections[0];
  const partner = sections.find(s => s.section_key === 'partner') || fallbackSections[1];
  const plushie = sections.find(s => s.section_key === 'plushie') || fallbackSections[2];

  const findContent = (key: string) => dbContent?.find(c => c.section_key === key);
  const partnerTagline = findContent('partner_tagline')?.headline || 'Own a Fantasy Claw Arcade — Be the Go-To Entertainment Spot in Your City';
  const partnerWhy = findContent('partner_why');
  const partnerIncludes = findContent('partner_includes');
  const partnerIncludesItems = (Array.isArray(partnerIncludes?.list_items) ? partnerIncludes!.list_items : fallbackPartnerIncludes) as Array<{ icon: string; title: string; desc: string }>;
  const freedomBox = findContent('freedom_box');
  const minOrder = findContent('plushie_min_order');
  const plushieHow = findContent('plushie_how');
  const plushieHowItems = (Array.isArray(plushieHow?.list_items) ? plushieHow!.list_items : fallbackPlushieSteps) as Array<{ icon: string; title: string; desc: string }>;
  const venuesContent = findContent('venues');
  const venues = (Array.isArray(venuesContent?.list_items) && venuesContent!.list_items.length ? venuesContent!.list_items : fallbackVenues) as string[];
  const contactIntro = findContent('contact_intro');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Thanks! We'll be in touch within 1–2 business days.");
  };

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />

      <PageHero
        eyebrow={hero?.eyebrow || '🤝 For Businesses & Partners'}
        title={hero?.title || 'Grow With Klawsome'}
        subtitle={hero?.subtitle || "Three ways to bring the magic of Klawsome into your world — whether you're a business owner, entrepreneur, or creator."}
        imageUrl={hero?.image_url || ''}
      >
        <Button asChild size="lg" className="rounded-full px-10 py-6 text-sm font-heading font-bold tracking-wider bg-primary hover:bg-primary/90 text-white uppercase">
          <a href="#contact">{hero?.cta_text || 'Get in Touch'}</a>
        </Button>
      </PageHero>

      {/* STICKY TABS — kawaii style */}
      <div ref={tabsBarRef} className="sticky top-20 z-30 bg-[hsl(var(--klawsome-baby-pink))]/95 backdrop-blur-md border-b-2 border-white/40 shadow-sm">
        <div className="ds-container section-x py-4">
          <p className="ds-eyebrow text-center mb-3">Our Opportunities</p>
          <div role="tablist" aria-label="Opportunities" className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {tabs.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={t.id}
                  onClick={() => handleTabClick(t.id)}
                  className={`font-heading font-bold text-sm px-5 py-2.5 rounded-full border-2 transition-all ${
                    isActive
                      ? 'bg-primary border-primary text-white shadow-md'
                      : 'bg-white border-primary text-primary hover:bg-primary/10'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* HOSTED — baby blue band like homepage About */}
      <KawaiiDivider variant="wave" from="baby-pink" to="baby-blue" stroke="white" />
      <section id="hosted" className="section-y section-x bg-[hsl(var(--klawsome-baby-blue))]">
        <div className="ds-container max-w-5xl">
          <div className="text-center mb-12">
            <p className="ds-eyebrow mb-3">Opportunity 01</p>
            <h2 className="ds-h2 mb-4">Host a Klawsome Machine<br />in Your Business</h2>
            <div className="inline-flex items-center gap-2 bg-white/70 border-2 border-white text-foreground font-bold text-sm px-5 py-2.5 rounded-full mb-6">
              <MapPin className="w-4 h-4" /> Available within 50 miles of Novi, MI (48375)
            </div>
            <p className="ds-lead max-w-2xl mx-auto">{hosted.subtitle}</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-7 mb-12 shadow-md">
            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">You earn 10% of every token played.</h3>
              <p className="text-muted-foreground font-body font-semibold text-sm leading-relaxed max-w-md">{hosted.description}</p>
            </div>
            <span className="font-bold text-6xl text-primary whitespace-nowrap">🎯 10%</span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-3xl p-8 border-t-[5px] border-primary shadow-sm">
              <h4 className="font-heading text-xl font-bold text-foreground mb-1">Klawsome Takes Care Of</h4>
              <p className="text-sm text-muted-foreground font-bold mb-5">We do the heavy lifting</p>
              <ul className="space-y-3">
                {hosted.bullet_points.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body font-bold text-sm text-foreground/90">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center mt-0.5"><Check className="w-3 h-3" /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-3xl p-8 border-t-[5px] border-[hsl(var(--klawsome-yellow))] shadow-sm">
              <h4 className="font-heading text-xl font-bold text-foreground mb-1">Your Business Provides</h4>
              <p className="text-sm text-muted-foreground font-bold mb-5">That's really it</p>
              <ul className="space-y-3">
                {businessProvides.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body font-bold text-sm text-foreground/90">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[hsl(var(--klawsome-yellow)/0.3)] text-foreground flex items-center justify-center mt-0.5"><Check className="w-3 h-3" /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className="font-heading text-2xl font-bold text-foreground mb-5 text-center">Perfect for high-traffic spots</h3>
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {venues.map((v) => (
              <span key={v} className="bg-white border-2 border-white rounded-full px-5 py-2.5 font-heading font-bold text-sm text-foreground hover:bg-[hsl(var(--klawsome-yellow)/0.4)] transition-all cursor-default shadow-sm">
                {v}
              </span>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="rounded-full px-8 py-6 font-heading font-bold bg-primary hover:bg-primary/90 text-white shadow-lg">
              <a href="#contact">Apply for a Hosted Machine →</a>
            </Button>
          </div>
        </div>
      </section>

      {/* PARTNER — baby pink band */}
      <KawaiiDivider variant="scallop" from="baby-blue" to="baby-pink" stroke="baby-blue" />
      <section id="partner" className="section-y section-x bg-[hsl(var(--klawsome-baby-pink))]">
        <div className="ds-container max-w-5xl">
          <div className="text-center mb-12">
            <p className="ds-eyebrow mb-3">Opportunity 02</p>
            <span className="inline-block bg-[hsl(var(--klawsome-yellow))] text-foreground font-heading font-bold text-base px-7 py-3 rounded-full mb-5">{partnerTagline}</span>
            <h2 className="ds-h2 mb-4">Become a Klawsome Partner</h2>
            <p className="ds-lead max-w-2xl mx-auto">{partner.subtitle}</p>
          </div>

          <div className="bg-white rounded-3xl p-10 mb-10 shadow-md">
            <h3 className="font-heading text-2xl font-bold text-foreground mb-3">{partnerWhy?.headline || "Why we're not calling this a franchise"}</h3>
            <p className="text-muted-foreground font-body font-semibold leading-relaxed">{partnerWhy?.body}</p>
          </div>

          <h3 className="font-heading text-3xl font-bold text-foreground mb-5 text-center">What Klawsome Supplies</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {partnerIncludesItems.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-7 shadow-md border-b-4 border-[hsl(var(--klawsome-yellow))] hover:-translate-y-1 transition-transform">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h5 className="font-heading text-lg font-bold text-foreground mb-2">{item.title}</h5>
                <p className="text-sm text-muted-foreground font-semibold leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-10 mb-10 flex flex-col md:flex-row gap-7 items-start shadow-md">
            <div className="text-5xl flex-shrink-0">{freedomBox?.eyebrow || '💡'}</div>
            <div>
              <h4 className="font-heading text-2xl font-bold text-primary mb-3">{freedomBox?.headline || 'Pair it with your other concepts'}</h4>
              <p className="text-muted-foreground font-body font-semibold leading-relaxed">{freedomBox?.body}</p>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="rounded-full px-8 py-6 font-heading font-bold bg-primary hover:bg-primary/90 text-white shadow-lg">
              <a href="#contact">Let's Talk Partnership →</a>
            </Button>
          </div>
        </div>
      </section>

      {/* PLUSHIE — coral red like homepage tokens */}
      <KawaiiDivider variant="cloud" from="baby-pink" to="red" stroke="white" />
      <section id="plushie" className="section-y section-x bg-primary">
        <div className="ds-container max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-heading font-black text-white/80 tracking-[3px] uppercase mb-3">Opportunity 03</p>
            <h2 className="ds-h2 text-white mb-4">Custom Plushie Orders</h2>
            <p className="ds-lead text-white/85 max-w-2xl mx-auto">{plushie.subtitle}</p>
          </div>

          <div className="bg-white/95 rounded-r-2xl border-l-[5px] border-[hsl(var(--klawsome-yellow))] p-6 mb-12 flex items-center gap-4 shadow-md">
            <span className="text-3xl flex-shrink-0">{minOrder?.eyebrow || '📦'}</span>
            <p className="font-body font-bold text-foreground leading-relaxed">
              <strong className="text-primary">{minOrder?.headline || 'Minimum order: 100 units.'}</strong> {minOrder?.body}
            </p>
          </div>

          <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2 text-center">Pricing by complexity</h3>
          <p className="text-white/80 font-semibold mb-7 text-center">All prices are per unit, based on minimum 100-unit orders.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {pricingTiers.map((tier, idx) => {
              const isHighlight = tier.is_highlight || idx === 1;
              return (
                <div key={tier.id} className={`rounded-3xl p-8 text-center transition-transform hover:-translate-y-1 bg-white shadow-md ${isHighlight ? 'border-4 border-[hsl(var(--klawsome-yellow))]' : 'border-2 border-white'}`}>
                  <div className="text-xs font-heading font-black tracking-[2px] uppercase mb-3 text-primary">
                    {tier.features?.[0] || 'Plushie'}
                  </div>
                  <h5 className="font-heading text-lg font-bold mb-2 text-foreground">{tier.name}</h5>
                  <div className="font-bold text-5xl leading-none mb-2 text-foreground">{tier.price}</div>
                  <div className="text-sm font-bold text-muted-foreground">per unit</div>
                  {tier.features?.[1] && (
                    <p className="text-sm font-semibold mt-3 leading-relaxed text-muted-foreground">{tier.features[1]}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-white/95 rounded-3xl p-9 mb-10 shadow-md">
            <h3 className="font-heading text-2xl font-bold text-foreground mb-6 text-center">{plushieHow?.headline || 'How it works'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {plushieHowItems.map((step) => (
                <div key={step.title} className="text-center">
                  <div className="text-3xl mb-2">{step.icon}</div>
                  <h6 className="font-heading text-base font-bold text-foreground mb-1">{step.title}</h6>
                  <p className="text-sm text-muted-foreground font-semibold leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="rounded-full px-8 py-6 font-heading font-bold bg-white hover:bg-white/90 text-primary shadow-lg">
              <a href="#contact">Start Your Custom Order →</a>
            </Button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — white */}
      <KawaiiDivider variant="bumps" from="red" to="white" stroke="baby-pink" />
      <section className="section-y section-x bg-background">
        <div className="ds-container text-center">
          <p className="ds-eyebrow mb-3">The Process</p>
          <h2 className="ds-h2 mb-4">Getting Started is Easy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mt-12">
            {howSteps.map((step) => (
              <div key={step.id} className="text-center">
                <div className="w-14 h-14 bg-primary text-white font-bold text-2xl rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {step.icon}
                </div>
                <h4 className="font-heading text-lg font-bold text-foreground mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground font-semibold leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT — baby blue */}
      <KawaiiDivider variant="petals" from="white" to="baby-blue" stroke="baby-pink" />
      <section id="contact" className="section-y section-x bg-[hsl(var(--klawsome-baby-blue))]">
        <div className="ds-container max-w-3xl">
          <div className="text-center mb-10">
            <p className="ds-eyebrow mb-3">{contactIntro?.eyebrow || "Let's Talk"}</p>
            <h2 className="ds-h2 mb-4">{contactIntro?.headline || 'Ready to Get Started?'}</h2>
            <p className="ds-lead max-w-md mx-auto">{contactIntro?.body || "Tell us which opportunity excites you and we'll take it from there."}</p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-2xl border-2 border-primary p-8 text-center text-primary shadow-md">
              <Sparkles className="w-10 h-10 mx-auto mb-3" />
              <p className="font-heading font-bold text-lg">Thanks! We'll be in touch within 1–2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-10 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="fname" className="text-sm font-heading font-black text-foreground">Your Name</label>
                  <input id="fname" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Jane Smith" className="bg-background border-2 border-border rounded-xl px-4 py-3 font-body font-semibold text-foreground focus:border-primary focus:outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="femail" className="text-sm font-heading font-black text-foreground">Email Address</label>
                  <input id="femail" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="jane@yourbusiness.com" className="bg-background border-2 border-border rounded-xl px-4 py-3 font-body font-semibold text-foreground focus:border-primary focus:outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="fopp" className="text-sm font-heading font-black text-foreground">I'm interested in…</label>
                  <select id="fopp" value={formData.opportunity} onChange={(e) => setFormData({ ...formData, opportunity: e.target.value })} className="bg-background border-2 border-border rounded-xl px-4 py-3 font-body font-semibold text-foreground focus:border-primary focus:outline-none transition-colors">
                    <option value="">Select an opportunity…</option>
                    <option>Host a Klawsome machine in my business</option>
                    <option>Become a Klawsome Partner (open my own arcade)</option>
                    <option>Custom plushie order</option>
                    <option>Multiple opportunities</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="fbtype" className="text-sm font-heading font-black text-foreground">I am a…</label>
                  <select id="fbtype" value={formData.business_type} onChange={(e) => setFormData({ ...formData, business_type: e.target.value })} className="bg-background border-2 border-border rounded-xl px-4 py-3 font-body font-semibold text-foreground focus:border-primary focus:outline-none transition-colors">
                    <option value="">Select…</option>
                    <option>Restaurant owner</option>
                    <option>Bubble Tea / Café owner</option>
                    <option>Entertainment Venue owner</option>
                    <option>Retail Store owner</option>
                    <option>Entrepreneur / aspiring arcade owner</option>
                    <option>Individual / consumer</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="fmsg" className="text-sm font-heading font-black text-foreground">Tell us more</label>
                  <textarea id="fmsg" rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Share your idea, location, concept — anything that helps us understand what you're looking for…" className="bg-background border-2 border-border rounded-xl px-4 py-3 font-body font-semibold text-foreground focus:border-primary focus:outline-none transition-colors resize-y min-h-[120px]" />
                </div>
              </div>
              <div className="text-center mt-7">
                <Button type="submit" size="lg" className="rounded-full px-12 py-6 text-base font-heading font-bold bg-primary hover:bg-primary/90 text-white shadow-lg hover:scale-105 transition-all">
                  Send Message →
                </Button>
                <p className="mt-4 text-xs text-muted-foreground font-bold">We'll reply within 1–2 business days.</p>
              </div>
            </form>
          )}
        </div>
      </section>

      <KawaiiDivider variant="cloud" from="baby-blue" to="baby-pink" stroke="white" />
      <KawaiiFooter prevColor="baby-pink" />
    </div>
  );
};

export default BusinessDevelopment2;