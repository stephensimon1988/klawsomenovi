import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import SectionWrapper from '@/components/SectionWrapper';
import CustomBlock from '@/components/CustomBlock';
import { toast } from 'sonner';
import { useCmsTable, usePageSections, type BusinessSection, type BusinessPricingTier, type BusinessHowStep, type PageSection } from '@/hooks/useCmsContent';

// Fallback data
const fallbackSections: BusinessSection[] = [
  { id: '1', section_key: 'hosted', title: 'Host a Klawsome Machine in Your Business', subtitle: 'We place a machine in your space, handle everything, and you earn a share of every token played -- no upfront cost, no hassle.', description: 'You earn 10% of every token played.', bullet_points: ['Machine delivery & installation', 'All prize stocking & restocking', 'All repairs & maintenance', 'Revenue tracking & monthly payouts', 'Ongoing machine operation'], image_url: '', sort_order: 0 },
  { id: '2', section_key: 'partner', title: 'Become a Klawsome Partner', subtitle: 'Open your own Klawsome-powered arcade or claw machine corner.', description: "We're not a franchise -- we're a partnership.", bullet_points: ['Full fleet of Klawsome machines', 'Licensed plushies and anime collectibles', 'Remote monitoring and cashless payments', 'Full onboarding and training', 'Brand assets and marketing support', 'Ongoing maintenance support'], image_url: '', sort_order: 1 },
  { id: '3', section_key: 'plushie', title: 'Custom Plushie Orders', subtitle: 'Turn your character, mascot, or idea into a real plushie.', description: 'Minimum order: 100 units.', bullet_points: ['Share your design', 'We send a quote', 'Approve & produce'], image_url: '', sort_order: 2 },
];

const fallbackPricing: BusinessPricingTier[] = [
  { id: '1', name: 'Standard Plushie', price: '$4-6', features: ['Simple Design', 'Clean shapes, minimal detail'], is_highlight: false, sort_order: 0 },
  { id: '2', name: 'Detailed Plushie', price: '$6-8', features: ['Complex Design', 'Highly detailed characters'], is_highlight: false, sort_order: 1 },
  { id: '3', name: 'Oversized Plushie', price: '$15-40', features: ['XL / Life-Size', 'Statement-making'], is_highlight: false, sort_order: 2 },
];

const fallbackHowSteps: BusinessHowStep[] = [
  { id: '1', title: 'Reach Out', description: 'Fill out the form below.', icon: '1', sort_order: 0 },
  { id: '2', title: 'We Connect', description: 'Our team follows up within 1-2 business days.', icon: '2', sort_order: 1 },
  { id: '3', title: 'Review & Plan', description: 'We review your location or concept together.', icon: '3', sort_order: 2 },
  { id: '4', title: 'Launch!', description: "Machines installed, plushies stocked -- you're ready to go.", icon: '4', sort_order: 3 },
];

const businessProvides = ['Floor space for the machine', 'One standard power outlet', 'A 2.4GHz WiFi connection'];
const venues = ['🍜 Restaurants', '🧋 Bubble Tea Shops', '🎳 Entertainment Venues', '🛍️ Retail Stores', '⏳ Waiting Areas', '🏪 High Foot Traffic Spaces'];
const partnerIncludes = [
  { icon: '🎰', title: 'Machines', desc: 'Full fleet of Klawsome machines customized for your space.' },
  { icon: '🧸', title: 'Prizes', desc: 'Licensed plushies, anime collectibles, and more -- supplied by us.' },
  { icon: '📱', title: 'Tech', desc: 'Remote monitoring, cashless payments, and real-time analytics.' },
  { icon: '🎓', title: 'Training', desc: "Full onboarding so you're confident from day one." },
  { icon: '📣', title: 'Marketing', desc: 'Brand assets, social media support, and launch help.' },
  { icon: '🔧', title: 'Support', desc: 'Ongoing maintenance support and prize restocking guidance.' },
];

// Hero Component
const BusinessHero = () => (
  <section className="relative min-h-[70vh] flex items-end overflow-hidden">
    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/55fefb9f-eb8b-4185-a0bf-aec7b9e28a73/Klawsome_FriendsFamily-054-Edit.jpg')` }} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
    <div className="relative z-10 container mx-auto px-6 lg:px-12 pb-20 pt-32">
      <div className="max-w-2xl">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white uppercase leading-[0.95] mb-6">GROW WITH<br />KLAWSOME</h1>
        <p className="text-white/70 font-body text-lg max-w-xl">Three ways to bring the magic of Klawsome into your world — whether you're a business owner, entrepreneur, or creator 🤝</p>
      </div>
    </div>
  </section>
);

// Opportunities Tabs Component
const BusinessOpportunities = () => {
  const [activeTab, setActiveTab] = useState('hosted');
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const tabsSectionRef = useRef<HTMLDivElement>(null);
  const tabsNavRef = useRef<HTMLDivElement>(null);

  const { data: dbSections } = useCmsTable<BusinessSection>('business_sections');
  const { data: dbPricing } = useCmsTable<BusinessPricingTier>('business_pricing_tiers');

  const sections = dbSections?.length ? dbSections : fallbackSections;
  const pricingTiers = dbPricing?.length ? dbPricing : fallbackPricing;

  const hosted = sections.find(s => s.section_key === 'hosted');
  const partner = sections.find(s => s.section_key === 'partner');
  const plushie = sections.find(s => s.section_key === 'plushie');

  useEffect(() => {
    const section = tabsSectionRef.current;
    const nav = tabsNavRef.current;
    if (!section || !nav) return;
    const observer = new IntersectionObserver(([entry]) => {
      const navRect = nav.getBoundingClientRect();
      const navIsAboveViewport = navRect.bottom < 64;
      const sectionVisible = entry.isIntersecting;
      setShowStickyTabs(navIsAboveViewport && sectionVisible);
    }, { threshold: 0, rootMargin: '-64px 0px 0px 0px' });
    observer.observe(section);
    const handleScroll = () => {
      const navRect = nav.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      setShowStickyTabs(navRect.bottom < 64 && sectionRect.bottom > 64 && sectionRect.top < window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener('scroll', handleScroll); };
  }, []);

  const tabTriggerClass = "relative font-heading font-bold text-sm px-8 py-3 rounded-t-lg rounded-b-none border border-b-0 border-transparent text-muted-foreground bg-transparent transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-border data-[state=active]:shadow-none data-[state=active]:mb-[-2px] data-[state=active]:border-t-2 data-[state=active]:border-t-primary hover:text-foreground/80";

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div ref={tabsSectionRef}>
        <AnimatePresence>
          {showStickyTabs && (
            <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }} className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md shadow-lg px-4 py-3 text-center border-b border-border">
              <TabsList className="bg-transparent h-auto gap-0 rounded-none border-b-2 border-border pb-0 inline-flex">
                <TabsTrigger value="hosted" className={tabTriggerClass}>🎰 Host a Machine</TabsTrigger>
                <TabsTrigger value="partner" className={tabTriggerClass}>⭐ Become a Partner</TabsTrigger>
                <TabsTrigger value="plushie" className={tabTriggerClass}>🧸 Custom Plushies</TabsTrigger>
              </TabsList>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={tabsNavRef} className="bg-secondary/50 pt-8 px-6 lg:px-12 text-center">
          <p className="text-xs font-heading font-bold text-primary tracking-widest uppercase mb-4">Our Opportunities</p>
          <TabsList className="bg-transparent h-auto gap-0 rounded-none border-b-2 border-border pb-0 inline-flex">
            <TabsTrigger value="hosted" className={tabTriggerClass}>🎰 Host a Machine</TabsTrigger>
            <TabsTrigger value="partner" className={tabTriggerClass}>⭐ Become a Partner</TabsTrigger>
            <TabsTrigger value="plushie" className={tabTriggerClass}>🧸 Custom Plushies</TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: HOST */}
        <TabsContent value="hosted" className="mt-0">
          <div className="py-28 px-6 lg:px-12 bg-background text-center">
            <div className="container mx-auto max-w-4xl relative">
              <span className="absolute font-heading text-[220px] font-bold text-foreground/[0.03] right-[-10px] top-[-40px] leading-none pointer-events-none select-none">01</span>
              <p className="text-xs font-heading font-bold tracking-[3px] uppercase text-primary mb-3">Opportunity 01</p>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">{hosted?.title || 'Host a Klawsome Machine'}<br />in Your Business</h2>
              <div className="inline-flex items-center gap-2 bg-secondary border border-border text-foreground font-bold text-sm px-5 py-2.5 rounded-full mb-7"><MapPin className="w-4 h-4" /> Available within 50 miles of Novi, MI (48375) only</div>
              <p className="text-muted-foreground font-body text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">{hosted?.subtitle}</p>
              <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg font-heading font-bold bg-primary hover:bg-primary/90 text-white"><a href="#contact">Apply for a Hosted Machine</a></Button>
            </div>
          </div>
          <div className="py-28 px-6 lg:px-12 bg-secondary/50">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-2xl border border-border bg-background p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div><h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2">You earn 10% of every token played.</h3><p className="text-muted-foreground font-body text-sm leading-relaxed max-w-md">{hosted?.description}</p></div>
                <span className="font-heading text-6xl md:text-7xl font-bold text-primary whitespace-nowrap">🎯 10%</span>
              </div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">What each side handles</h3>
              <p className="text-muted-foreground font-body mb-7">A truly hands-off opportunity for your business.</p>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="rounded-2xl border border-border bg-background p-8">
                  <h4 className="font-heading text-xl font-bold text-foreground mb-1">Klawsome Takes Care Of</h4>
                  <p className="text-sm text-muted-foreground font-bold mb-5">We do the heavy lifting</p>
                  <ul className="space-y-3">{(hosted?.bullet_points || []).map(item => <li key={item} className="flex items-start gap-3 font-body text-sm text-foreground/80"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mt-0.5"><Check className="w-3 h-3" /></span>{item}</li>)}</ul>
                </div>
                <div className="rounded-2xl border border-border bg-background p-8">
                  <h4 className="font-heading text-xl font-bold text-foreground mb-1">Your Business Provides</h4>
                  <p className="text-sm text-muted-foreground font-bold mb-5">That's really it</p>
                  <ul className="space-y-3">{businessProvides.map(item => <li key={item} className="flex items-start gap-3 font-body text-sm text-foreground/80"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mt-0.5"><Check className="w-3 h-3" /></span>{item}</li>)}</ul>
                </div>
              </div>
              <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-5">Perfect for high-traffic spots</h3>
              <div className="flex flex-wrap gap-3 mb-8">{venues.map(v => <span key={v} className="bg-background border border-border rounded-full px-5 py-2.5 font-heading font-bold text-sm text-foreground/80 hover:bg-primary/5 hover:border-primary/40 transition-all cursor-default">{v}</span>)}</div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: PARTNER */}
        <TabsContent value="partner" className="mt-0">
          <div className="py-28 px-6 lg:px-12 bg-background text-center">
            <div className="container mx-auto max-w-4xl relative">
              <span className="absolute font-heading text-[220px] font-bold text-foreground/[0.03] right-[-10px] top-[-40px] leading-none pointer-events-none select-none">02</span>
              <p className="text-xs font-heading font-bold tracking-[3px] uppercase text-primary mb-3">Opportunity 02</p>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">{partner?.title || 'Become a Klawsome Partner'}</h2>
              <p className="text-muted-foreground font-body text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">{partner?.subtitle}</p>
              <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg font-heading font-bold bg-primary hover:bg-primary/90 text-white"><a href="#contact">Apply to Be a Partner ⭐</a></Button>
            </div>
          </div>
          <div className="py-28 px-6 lg:px-12 bg-secondary/50">
            <div className="container mx-auto max-w-4xl">
              <span className="inline-block bg-primary text-white font-heading font-bold text-base px-7 py-3 rounded-full mb-6">Everything you need, provided.</span>
              <div className="rounded-2xl border border-border bg-background p-8 mb-8">
                <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-3">Why partner with Klawsome?</h3>
                <p className="text-muted-foreground font-body leading-relaxed">{partner?.description}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
                {partnerIncludes.map((item, index) => (
                  <motion.div key={item.title} className="rounded-2xl border border-border bg-background p-6 text-center hover:shadow-lg transition-shadow" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                    <span className="text-3xl mb-3 block">{item.icon}</span>
                    <h5 className="font-heading text-base font-bold text-foreground mb-1">{item.title}</h5>
                    <p className="text-xs text-muted-foreground font-body leading-snug">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
              <div className="rounded-2xl border border-border bg-background p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start mb-10">
                <span className="text-4xl flex-shrink-0">🏗️</span>
                <div>
                  <h4 className="font-heading text-xl font-bold text-foreground mb-2">Build your own brand. Keep your freedom.</h4>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">You can brand your space however you want. We provide the infrastructure, you create the experience.</p>
                </div>
              </div>
              <div className="text-center"><Button asChild size="lg" className="rounded-full px-8 py-6 text-lg font-heading font-bold bg-primary hover:bg-primary/90 text-white"><a href="#contact">Become a Partner →</a></Button></div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: PLUSHIES */}
        <TabsContent value="plushie" className="mt-0">
          <div className="py-28 px-6 lg:px-12 bg-background text-center">
            <div className="container mx-auto max-w-4xl relative">
              <span className="absolute font-heading text-[220px] font-bold text-foreground/[0.03] right-[-10px] top-[-40px] leading-none pointer-events-none select-none">03</span>
              <p className="text-xs font-heading font-bold tracking-[3px] uppercase text-primary mb-3">Opportunity 03</p>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">{plushie?.title || 'Custom Plushie Orders'}</h2>
              <p className="text-muted-foreground font-body text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">{plushie?.subtitle}</p>
              <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg font-heading font-bold bg-primary hover:bg-primary/90 text-white"><a href="#contact">Start a Custom Order</a></Button>
            </div>
          </div>
          <div className="py-28 px-6 lg:px-12 bg-secondary/50">
            <div className="container mx-auto max-w-4xl">
              <div className="border-l-4 border-primary rounded-r-2xl bg-background p-5 flex items-center gap-4 mb-10 border border-border"><span className="text-3xl flex-shrink-0">📦</span><p className="font-body font-bold text-sm text-foreground">{plushie?.description}</p></div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">Pricing by complexity</h3>
              <p className="text-muted-foreground font-body mb-7">All prices are per unit, based on minimum 100-unit orders.</p>
              <div className="grid md:grid-cols-3 gap-5 mb-10">
                {pricingTiers.map((tier, index) => (
                  <motion.div key={tier.id} className={`rounded-2xl p-8 text-center border ${index === pricingTiers.length - 1 ? 'bg-klawsome-navy border-primary/30 text-white' : 'bg-background border-border'}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.15 }}>
                    <p className="text-xs font-bold tracking-widest uppercase mb-2 text-primary">{tier.features?.[0] || ''}</p>
                    <h5 className={`font-heading text-lg font-bold mb-2 ${index === pricingTiers.length - 1 ? 'text-white' : 'text-foreground'}`}>{tier.name}</h5>
                    <p className="font-heading text-4xl font-bold mb-1 text-primary">{tier.price}</p>
                    <p className={`text-sm font-bold mb-3 ${index === pricingTiers.length - 1 ? 'text-white/60' : 'text-muted-foreground'}`}>per unit</p>
                    <p className={`text-sm leading-snug ${index === pricingTiers.length - 1 ? 'text-white/60' : 'text-muted-foreground'}`}>{tier.features?.slice(1).join('. ') || ''}</p>
                  </motion.div>
                ))}
              </div>
              <div className="rounded-2xl border border-border bg-background p-8 mb-10">
                <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-6">How it works</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {(plushie?.bullet_points || []).map((step, i) => (
                    <div key={i} className="text-center"><span className="text-3xl mb-2 block">{['📝', '💬', '✅'][i] || '📌'}</span><h6 className="font-heading text-base font-bold text-foreground mb-1">{step}</h6></div>
                  ))}
                </div>
              </div>
              <div className="text-center"><Button asChild size="lg" className="rounded-full px-8 py-6 text-lg font-heading font-bold bg-primary hover:bg-primary/90 text-white"><a href="#contact">Start Your Custom Order →</a></Button></div>
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

// How It Works Component
const BusinessHowItWorks = () => {
  const { data: dbHowSteps } = useCmsTable<BusinessHowStep>('business_how_steps');
  const howSteps = dbHowSteps?.length ? dbHowSteps : fallbackHowSteps;
  return (
    <section className="py-28 px-6 lg:px-12 bg-klawsome-navy text-center">
      <div className="container mx-auto max-w-4xl">
        <p className="text-xs font-heading font-bold tracking-[3px] uppercase text-primary mb-3">The Process</p>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-14 leading-tight">Getting Started is Easy</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
          {howSteps.map((step, index) => (
            <motion.div key={step.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.15 }}>
              <div className="w-14 h-14 bg-primary text-white font-heading text-xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">{step.icon}</div>
              <h4 className="font-heading text-base font-bold text-white mb-2">{step.title}</h4>
              <p className="text-sm text-white/60 font-body leading-snug">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Contact Form Component
const BusinessContact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', opportunity: '', business_type: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); toast.success("Thanks! We'll be in touch within 1-2 business days."); };

  return (
    <section id="contact" className="py-28 px-6 lg:px-12 bg-background text-center">
      <div className="container mx-auto max-w-2xl">
        <p className="text-xs font-heading font-bold tracking-[3px] uppercase text-primary mb-3">Let's Talk</p>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">Ready to Get Started?</h2>
        <p className="text-muted-foreground font-body mb-10">Tell us which opportunity excites you and we'll take it from there.</p>
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-border bg-secondary/50 p-6 text-foreground font-heading font-bold text-lg">🎉 Thanks! We'll be in touch within 1-2 business days.</motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="text-left">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2"><label className="text-sm font-heading font-bold text-foreground">Your Name</label><input type="text" required placeholder="Jane Smith" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="border border-border rounded-2xl px-4 py-3 font-body text-sm text-foreground bg-background placeholder:text-muted-foreground focus:border-primary outline-none transition-colors" /></div>
              <div className="flex flex-col gap-2"><label className="text-sm font-heading font-bold text-foreground">Email Address</label><input type="email" required placeholder="jane@yourbusiness.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="border border-border rounded-2xl px-4 py-3 font-body text-sm text-foreground bg-background placeholder:text-muted-foreground focus:border-primary outline-none transition-colors" /></div>
              <div className="flex flex-col gap-2 md:col-span-2"><label className="text-sm font-heading font-bold text-foreground">I'm interested in...</label><select value={formData.opportunity} onChange={e => setFormData({ ...formData, opportunity: e.target.value })} className="border border-border rounded-2xl px-4 py-3 font-body text-sm text-foreground bg-background focus:border-primary outline-none transition-colors"><option value="">Select an opportunity...</option><option>Host a Klawsome machine in my business</option><option>Become a Klawsome Partner (open my own arcade)</option><option>Custom plushie order</option><option>Multiple opportunities</option></select></div>
              <div className="flex flex-col gap-2 md:col-span-2"><label className="text-sm font-heading font-bold text-foreground">I am a...</label><select value={formData.business_type} onChange={e => setFormData({ ...formData, business_type: e.target.value })} className="border border-border rounded-2xl px-4 py-3 font-body text-sm text-foreground bg-background focus:border-primary outline-none transition-colors"><option value="">Select...</option><option>Restaurant owner</option><option>Bubble Tea / Cafe owner</option><option>Entertainment Venue owner</option><option>Retail Store owner</option><option>Entrepreneur / aspiring arcade owner</option><option>Individual / consumer</option><option>Other</option></select></div>
              <div className="flex flex-col gap-2 md:col-span-2"><label className="text-sm font-heading font-bold text-foreground">Tell us more</label><textarea placeholder="Share your idea, location, concept..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows={5} className="border border-border rounded-2xl px-4 py-3 font-body text-sm text-foreground bg-background placeholder:text-muted-foreground focus:border-primary outline-none transition-colors resize-y" /></div>
            </div>
            <div className="text-center mt-7">
              <Button type="submit" size="lg" className="rounded-full px-14 py-6 text-lg font-heading font-bold bg-primary hover:bg-primary/90 text-white">Send Message →</Button>
              <p className="text-xs text-muted-foreground font-body font-bold mt-3">We'll reply within 1-2 business days · hello@klawsomenovi.com</p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

const SECTION_MAP: Record<string, React.ComponentType> = {
  hero: BusinessHero,
  opportunities: BusinessOpportunities,
  howitworks: BusinessHowItWorks,
  contact: BusinessContact,
};

const FALLBACK_SECTIONS: PageSection[] = [
  { id: 'f1', page: 'business', section_key: 'hero', label: 'Hero', sort_order: 1, is_visible: true, section_height: '70vh', wrapper_max_width: 'full', padding_y: '0', bg_color: '', bg_image_url: '', custom_css_class: '' },
  { id: 'f2', page: 'business', section_key: 'opportunities', label: 'Opportunities', sort_order: 2, is_visible: true, section_height: 'auto', wrapper_max_width: 'full', padding_y: '0', bg_color: '', bg_image_url: '', custom_css_class: '' },
  { id: 'f3', page: 'business', section_key: 'howitworks', label: 'How It Works', sort_order: 3, is_visible: true, section_height: 'auto', wrapper_max_width: 'full', padding_y: '0', bg_color: '', bg_image_url: '', custom_css_class: '' },
  { id: 'f4', page: 'business', section_key: 'contact', label: 'Contact', sort_order: 4, is_visible: true, section_height: 'auto', wrapper_max_width: 'full', padding_y: '0', bg_color: '', bg_image_url: '', custom_css_class: '' },
];

const Business = () => {
  const { data: sections } = usePageSections('business');
  const displaySections = sections && sections.length > 0 ? sections : FALLBACK_SECTIONS;

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      {displaySections.map((s) => {
        if (s.section_key.startsWith('custom:')) {
          return (
            <SectionWrapper key={s.id} config={s}>
              <CustomBlock blockKey={s.section_key.replace('custom:', '')} />
            </SectionWrapper>
          );
        }
        const Component = SECTION_MAP[s.section_key];
        if (!Component) return null;
        return (
          <SectionWrapper key={s.id} config={s} fullControl>
            <Component />
          </SectionWrapper>
        );
      })}
      <KawaiiFooter />
    </div>
  );
};

export default Business;
