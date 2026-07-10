import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Check, Heart, Star, Sparkles, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import { toast } from 'sonner';
import { useCmsSingle, useCmsTable, type BusinessSection, type BusinessPricingTier, type BusinessHowStep, type SiteSettings } from '@/hooks/useCmsContent';

const FloatingIcon = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{ y: [0, -12, 0] }}
    transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

// Fallback data
const fallbackSections: BusinessSection[] = [
  { id: '1', section_key: 'hosted', title: 'Host a Klawsome Machine in Your Business', subtitle: 'We place a machine in your space, handle everything, and you earn a share of every token played - no upfront cost, no hassle.', description: 'You earn 10% of every token played.', bullet_points: ['Machine delivery & installation', 'All prize stocking & restocking', 'All repairs & maintenance', 'Revenue tracking & monthly payouts', 'Ongoing machine operation'], image_url: '', sort_order: 0 },
  { id: '2', section_key: 'partner', title: 'Become a Klawsome Partner', subtitle: 'Open your own Klawsome-powered arcade or claw machine corner.', description: "We're not a franchise - we're a partnership.", bullet_points: ['Full fleet of Klawsome machines', 'Licensed plushies and anime collectibles', 'Remote monitoring and cashless payments', 'Full onboarding and training', 'Brand assets and marketing support', 'Ongoing maintenance support'], image_url: '', sort_order: 1 },
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
  { id: '4', title: 'Launch!', description: "Machines installed, plushies stocked - you're ready to go.", icon: '4', sort_order: 3 },
];

const businessProvides = [
  'Floor space for the machine',
  'One standard power outlet',
  'A 2.4GHz WiFi connection',
];

const venues = [
  '🍜 Restaurants', '🧋 Bubble Tea Shops', '🎳 Entertainment Venues',
  '🛍️ Retail Stores', '⏳ Waiting Areas', '🏪 High Foot Traffic Spaces',
];

const partnerIncludes = [
  { icon: '🎰', title: 'Machines', desc: 'Full fleet of Klawsome machines customized for your space.' },
  { icon: '🧸', title: 'Prizes', desc: 'Licensed plushies, anime collectibles, and more - supplied by us.' },
  { icon: '📱', title: 'Tech', desc: 'Remote monitoring, cashless payments, and real-time analytics.' },
  { icon: '🎓', title: 'Training', desc: "Full onboarding so you're confident from day one." },
  { icon: '📣', title: 'Marketing', desc: 'Brand assets, social media support, and launch help.' },
  { icon: '🔧', title: 'Support', desc: 'Ongoing maintenance support and prize restocking guidance.' },
];

const Business = () => {
  const [formData, setFormData] = useState({ name: '', email: '', opportunity: '', business_type: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('hosted');
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const tabsSectionRef = useRef<HTMLDivElement>(null);
  const tabsNavRef = useRef<HTMLDivElement>(null);

  const { data: dbSections } = useCmsTable<BusinessSection>('business_sections');
  const { data: dbPricing } = useCmsTable<BusinessPricingTier>('business_pricing_tiers');
  const { data: dbHowSteps } = useCmsTable<BusinessHowStep>('business_how_steps');
  const { data: settings } = useCmsSingle<SiteSettings>('site_settings');
  const contactEmail = settings?.email || 'team@klawsomenovi.com';

  const sections = dbSections?.length ? dbSections : fallbackSections;
  const pricingTiers = dbPricing?.length ? dbPricing : fallbackPricing;
  const howSteps = dbHowSteps?.length ? dbHowSteps : fallbackHowSteps;

  const hosted = sections.find(s => s.section_key === 'hosted');
  const partner = sections.find(s => s.section_key === 'partner');
  const plushie = sections.find(s => s.section_key === 'plushie');

  useEffect(() => {
    const section = tabsSectionRef.current;
    const nav = tabsNavRef.current;
    if (!section || !nav) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const navRect = nav.getBoundingClientRect();
        const navIsAboveViewport = navRect.bottom < 64;
        const sectionVisible = entry.isIntersecting;
        setShowStickyTabs(navIsAboveViewport && sectionVisible);
      },
      { threshold: 0, rootMargin: '-64px 0px 0px 0px' }
    );

    observer.observe(section);

    const handleScroll = () => {
      const navRect = nav.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const navIsAboveViewport = navRect.bottom < 64;
      const sectionVisible = sectionRect.bottom > 64 && sectionRect.top < window.innerHeight;
      setShowStickyTabs(navIsAboveViewport && sectionVisible);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Thanks! We'll be in touch within 1-2 business days.");
  };

  const tabTriggerClass = "relative font-heading font-bold text-sm px-8 py-3 rounded-t-lg rounded-b-none border border-b-0 border-transparent text-white/60 bg-transparent transition-all data-[state=active]:bg-klawsome-navy data-[state=active]:text-white data-[state=active]:border-white/20 data-[state=active]:border-b-klawsome-navy data-[state=active]:shadow-none data-[state=active]:mb-[-2px] data-[state=active]:border-t-2 data-[state=active]:border-t-klawsome-yellow hover:text-white/80";

  return (
    <div className="min-h-screen bg-klawsome-navy">
      <KawaiiNav />

      {/* ══════ HERO ══════ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-klawsome-navy">
        <div className="absolute inset-0 bg-gradient-to-b from-klawsome-navy via-klawsome-navy/95 to-klawsome-navy" />

        <FloatingIcon delay={0} className="top-[15%] left-[10%]">
          <Heart className="w-10 h-10 text-primary opacity-40" fill="currentColor" />
        </FloatingIcon>
        <FloatingIcon delay={0.5} className="top-[18%] right-[15%]">
          <Star className="w-8 h-8 text-klawsome-yellow opacity-40" fill="currentColor" />
        </FloatingIcon>
        <FloatingIcon delay={1} className="bottom-[25%] left-[15%]">
          <Coins className="w-9 h-9 text-klawsome-yellow opacity-35" />
        </FloatingIcon>
        <FloatingIcon delay={1.5} className="bottom-[35%] right-[12%]">
          <Heart className="w-6 h-6 text-klawsome-baby-pink opacity-40" fill="currentColor" />
        </FloatingIcon>
        <FloatingIcon delay={0.8} className="top-[40%] left-[5%]">
          <Sparkles className="w-7 h-7 text-primary opacity-30" />
        </FloatingIcon>

        <div className="container relative z-10 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 leading-tight text-white">
              Grow With
              <br />
              <span className="kawaii-text-gradient">Klawsome!</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-body leading-relaxed">
              Three ways to bring the magic of Klawsome into your world - whether you're a business owner, entrepreneur, or creator 🤝
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="rounded-bubble px-8 py-6 text-lg font-heading font-semibold bg-primary hover:bg-primary/90 text-white hover:scale-105 transition-all duration-300">
                <a href="#contact">Get in Touch 📩</a>
              </Button>
              <Button asChild size="lg" className="rounded-bubble px-8 py-6 text-lg font-heading font-semibold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 hover:scale-105 transition-all duration-300">
                <a href="#hosted">View Opportunities ⭐</a>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50C360 100 720 0 1080 50C1260 75 1380 25 1440 50V100H0V50Z" fill="hsl(var(--klawsome-red))" />
          </svg>
        </div>
      </section>

      {/* ══════ OPPORTUNITIES TABS ══════ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div ref={tabsSectionRef}>
          <AnimatePresence>
            {showStickyTabs && (
              <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="fixed top-16 left-0 right-0 z-40 bg-primary/95 backdrop-blur-md shadow-lg px-4 py-3 text-center border-b border-white/10"
              >
                <TabsList className="bg-transparent h-auto gap-0 rounded-none border-b-2 border-white/20 pb-0 inline-flex">
                  <TabsTrigger value="hosted" className={tabTriggerClass}>🎰 Host a Machine</TabsTrigger>
                  <TabsTrigger value="partner" className={tabTriggerClass}>⭐ Become a Partner</TabsTrigger>
                  <TabsTrigger value="plushie" className={tabTriggerClass}>🧸 Custom Plushies</TabsTrigger>
                </TabsList>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={tabsNavRef} className="bg-primary pt-8 px-4 text-center">
            <p className="text-xs font-heading font-bold text-white/70 tracking-widest uppercase mb-4">Our Opportunities</p>
            <TabsList className="bg-transparent h-auto gap-0 rounded-none border-b-2 border-white/20 pb-0 inline-flex">
              <TabsTrigger value="hosted" className={tabTriggerClass}>🎰 Host a Machine</TabsTrigger>
              <TabsTrigger value="partner" className={tabTriggerClass}>⭐ Become a Partner</TabsTrigger>
              <TabsTrigger value="plushie" className={tabTriggerClass}>🧸 Custom Plushies</TabsTrigger>
            </TabsList>
          </div>

        {/* ══════ TAB 1: HOST A MACHINE ══════ */}
        <TabsContent value="hosted" className="mt-0">
          <div className="relative overflow-hidden bg-klawsome-navy py-20 px-4 text-center">
            <span className="absolute font-heading text-[220px] font-bold text-white/[0.05] right-[-10px] top-[-40px] leading-none pointer-events-none select-none">01</span>
            <div className="container mx-auto relative z-10">
              <p className="text-xs font-heading font-bold tracking-[3px] uppercase text-klawsome-yellow mb-3">Opportunity 01</p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">{hosted?.title || 'Host a Klawsome Machine'}<br />in Your Business</h2>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold text-sm px-5 py-2.5 rounded-bubble mb-7">
                <MapPin className="w-4 h-4" /> Available within 50 miles of Novi, MI (48375) only
              </div>
              <p className="text-white/60 font-body font-semibold text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                {hosted?.subtitle}
              </p>
              <Button asChild size="lg" className="rounded-bubble px-8 py-6 text-lg font-heading font-semibold bg-primary hover:bg-primary/90 text-white hover:scale-105 transition-all duration-300">
                <a href="#contact">Apply for a Hosted Machine</a>
              </Button>
            </div>
          </div>

          <div className="bg-primary py-16 px-4">
            <div className="container mx-auto max-w-4xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-kawaii p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border border-white/20">
                <div>
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-2">You earn 10% of every token played.</h3>
                  <p className="text-white/70 font-body font-semibold text-sm leading-relaxed max-w-md">
                    {hosted?.description}
                  </p>
                </div>
                <span className="font-heading text-6xl md:text-7xl font-bold text-klawsome-yellow whitespace-nowrap">🎯 10%</span>
              </div>

              <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">What each side handles</h3>
              <p className="text-white/60 font-body font-semibold mb-7">A truly hands-off opportunity for your business.</p>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-kawaii p-8 border border-white/20">
                  <h4 className="font-heading text-xl font-bold text-white mb-1">Klawsome Takes Care Of</h4>
                  <p className="text-sm text-white/60 font-bold mb-5">We do the heavy lifting</p>
                  <ul className="space-y-3">
                    {(hosted?.bullet_points || []).map((item) => (
                      <li key={item} className="flex items-start gap-3 font-body font-bold text-sm text-white/80">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-klawsome-yellow/20 text-klawsome-yellow flex items-center justify-center text-xs mt-0.5"><Check className="w-3 h-3" /></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-kawaii p-8 border border-white/20">
                  <h4 className="font-heading text-xl font-bold text-white mb-1">Your Business Provides</h4>
                  <p className="text-sm text-white/60 font-bold mb-5">That's really it</p>
                  <ul className="space-y-3">
                    {businessProvides.map((item) => (
                      <li key={item} className="flex items-start gap-3 font-body font-bold text-sm text-white/80">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-klawsome-yellow/20 text-klawsome-yellow flex items-center justify-center text-xs mt-0.5"><Check className="w-3 h-3" /></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-5">Perfect for high-traffic spots</h3>
              <div className="flex flex-wrap gap-3 mb-8">
                {venues.map((v) => (
                  <span key={v} className="bg-white/10 border border-white/20 rounded-bubble px-5 py-2.5 font-heading font-bold text-sm text-white/80 hover:bg-klawsome-yellow/20 hover:border-klawsome-yellow/40 transition-all cursor-default">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ══════ TAB 2: PARTNER ══════ */}
        <TabsContent value="partner" className="mt-0">
          <div className="relative overflow-hidden bg-klawsome-navy py-20 px-4 text-center">
            <span className="absolute font-heading text-[220px] font-bold text-white/[0.05] right-[-10px] top-[-40px] leading-none pointer-events-none select-none">02</span>
            <div className="container mx-auto relative z-10">
              <p className="text-xs font-heading font-bold tracking-[3px] uppercase text-klawsome-yellow mb-3">Opportunity 02</p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">{partner?.title || 'Become a'}<br /><span className="kawaii-text-gradient">Klawsome Partner</span></h2>
              <p className="text-white/60 font-body font-semibold text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                {partner?.subtitle}
              </p>
              <Button asChild size="lg" className="rounded-bubble px-8 py-6 text-lg font-heading font-semibold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 hover:scale-105 transition-all duration-300">
                <a href="#contact">Apply to Be a Partner ⭐</a>
              </Button>
            </div>
          </div>

          <div className="bg-primary py-16 px-4">
            <div className="container mx-auto max-w-4xl">
              <span className="inline-block bg-klawsome-yellow text-klawsome-navy font-heading font-bold text-base px-7 py-3 rounded-bubble mb-6">Everything you need, provided.</span>

              <div className="bg-white/10 backdrop-blur-sm rounded-kawaii p-8 mb-8 border border-white/20">
                <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-3">Why partner with Klawsome?</h3>
                <p className="text-white/70 font-body font-semibold leading-relaxed">
                  {partner?.description}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
                {partnerIncludes.map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="bg-white/10 backdrop-blur-sm rounded-kawaii p-6 border border-white/20 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <span className="text-3xl mb-3 block">{item.icon}</span>
                    <h5 className="font-heading text-base font-bold text-white mb-1">{item.title}</h5>
                    <p className="text-xs text-white/60 font-body font-semibold leading-snug">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-klawsome-navy rounded-kawaii p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start mb-10 border border-white/10">
                <span className="text-4xl flex-shrink-0">🏗️</span>
                <div>
                  <h4 className="font-heading text-xl font-bold text-klawsome-yellow mb-2">Build your own brand. Keep your freedom.</h4>
                  <p className="text-white/60 font-body font-semibold text-sm leading-relaxed">
                    You can brand your space however you want. We provide the infrastructure, you create the experience. No strict playbooks - just guidance, support, and winning prizes.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button asChild size="lg" className="rounded-bubble px-8 py-6 text-lg font-heading font-semibold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 hover:scale-105 transition-all duration-300">
                  <a href="#contact">Become a Partner →</a>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ══════ TAB 3: CUSTOM PLUSHIES ══════ */}
        <TabsContent value="plushie" className="mt-0">
          <div className="relative overflow-hidden bg-klawsome-navy py-20 px-4 text-center">
            <span className="absolute font-heading text-[220px] font-bold text-white/[0.05] right-[-10px] top-[-40px] leading-none pointer-events-none select-none">03</span>
            <div className="container mx-auto relative z-10">
              <p className="text-xs font-heading font-bold tracking-[3px] uppercase text-klawsome-yellow mb-3">Opportunity 03</p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">{plushie?.title || 'Custom Plushie'}<br /><span className="kawaii-text-gradient">Orders</span></h2>
              <p className="text-white/60 font-body font-semibold text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                {plushie?.subtitle}
              </p>
              <Button asChild size="lg" className="rounded-bubble px-8 py-6 text-lg font-heading font-semibold bg-primary hover:bg-primary/90 text-white hover:scale-105 transition-all duration-300">
                <a href="#contact">Start a Custom Order</a>
              </Button>
            </div>
          </div>

          <div className="bg-primary py-16 px-4">
            <div className="container mx-auto max-w-4xl">
              <div className="bg-white/10 backdrop-blur-sm border-l-4 border-klawsome-yellow rounded-r-kawaii p-5 flex items-center gap-4 mb-10">
                <span className="text-3xl flex-shrink-0">📦</span>
                <p className="font-body font-bold text-sm text-white">
                  {plushie?.description}
                </p>
              </div>

              <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">Pricing by complexity</h3>
              <p className="text-white/60 font-body font-semibold mb-7">All prices are per unit, based on minimum 100-unit orders.</p>

              <div className="grid md:grid-cols-3 gap-5 mb-10">
                {pricingTiers.map((tier, index) => (
                  <motion.div
                    key={tier.id}
                    className={`rounded-kawaii p-8 text-center border ${
                      index === pricingTiers.length - 1
                        ? 'bg-klawsome-navy border-klawsome-yellow/30'
                        : 'bg-white/10 backdrop-blur-sm border-white/20'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <p className="text-xs font-bold tracking-widest uppercase mb-2 text-klawsome-yellow">{tier.features?.[0] || ''}</p>
                    <h5 className="font-heading text-lg font-bold mb-2 text-white">{tier.name}</h5>
                    <p className="font-heading text-4xl font-bold mb-1 text-klawsome-yellow">{tier.price}</p>
                    <p className="text-sm font-bold mb-3 text-white/60">per unit</p>
                    <p className="text-sm font-semibold leading-snug text-white/60">{tier.features?.slice(1).join('. ') || ''}</p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-kawaii p-8 mb-10 border border-white/20">
                <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-6">How it works</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {(plushie?.bullet_points || []).map((step, i) => (
                    <div key={i} className="text-center">
                      <span className="text-3xl mb-2 block">{['📝', '💬', '✅'][i] || '📌'}</span>
                      <h6 className="font-heading text-base font-bold text-white mb-1">{step}</h6>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Button asChild size="lg" className="rounded-bubble px-8 py-6 text-lg font-heading font-semibold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 hover:scale-105 transition-all duration-300">
                  <a href="#contact">Start Your Custom Order →</a>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        </div>
      </Tabs>

      {/* ══════ HOW IT WORKS ══════ */}
      <section className="bg-klawsome-navy py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <p className="text-xs font-heading font-bold tracking-[3px] uppercase text-klawsome-yellow mb-3">The Process</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-14">Getting Started is <span className="kawaii-text-gradient">Easy</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
            {howSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="w-14 h-14 bg-klawsome-yellow text-klawsome-navy font-heading text-xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 kawaii-shadow">
                  {step.icon}
                </div>
                <h4 className="font-heading text-base font-bold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-white/60 font-body font-semibold leading-snug">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CONTACT FORM ══════ */}
      <section id="contact" className="bg-primary py-20 px-4 text-center">
        <div className="container mx-auto max-w-2xl">
          <p className="text-xs font-heading font-bold tracking-[3px] uppercase text-white/70 mb-3">Let's Talk</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/70 font-body font-semibold mb-10">Tell us which opportunity excites you and we'll take it from there.</p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-kawaii p-6 text-white font-heading font-bold text-lg"
            >
              🎉 Thanks! We'll be in touch within 1-2 business days.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="text-left">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-heading font-bold text-white">Your Name</label>
                  <input type="text" required placeholder="Jane Smith" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-kawaii px-4 py-3 font-body font-semibold text-sm text-white placeholder:text-white/40 focus:border-klawsome-yellow outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-heading font-bold text-white">Email Address</label>
                  <input type="email" required placeholder="jane@yourbusiness.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-kawaii px-4 py-3 font-body font-semibold text-sm text-white placeholder:text-white/40 focus:border-klawsome-yellow outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-heading font-bold text-white">I'm interested in...</label>
                  <select value={formData.opportunity} onChange={(e) => setFormData({ ...formData, opportunity: e.target.value })} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-kawaii px-4 py-3 font-body font-semibold text-sm text-white focus:border-klawsome-yellow outline-none transition-colors">
                    <option value="" className="text-klawsome-navy">Select an opportunity...</option>
                    <option className="text-klawsome-navy">Host a Klawsome machine in my business</option>
                    <option className="text-klawsome-navy">Become a Klawsome Partner (open my own arcade)</option>
                    <option className="text-klawsome-navy">Custom plushie order</option>
                    <option className="text-klawsome-navy">Multiple opportunities</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-heading font-bold text-white">I am a...</label>
                  <select value={formData.business_type} onChange={(e) => setFormData({ ...formData, business_type: e.target.value })} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-kawaii px-4 py-3 font-body font-semibold text-sm text-white focus:border-klawsome-yellow outline-none transition-colors">
                    <option value="" className="text-klawsome-navy">Select...</option>
                    <option className="text-klawsome-navy">Restaurant owner</option>
                    <option className="text-klawsome-navy">Bubble Tea / Cafe owner</option>
                    <option className="text-klawsome-navy">Entertainment Venue owner</option>
                    <option className="text-klawsome-navy">Retail Store owner</option>
                    <option className="text-klawsome-navy">Entrepreneur / aspiring arcade owner</option>
                    <option className="text-klawsome-navy">Individual / consumer</option>
                    <option className="text-klawsome-navy">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-heading font-bold text-white">Tell us more</label>
                  <textarea placeholder="Share your idea, location, concept - anything that helps us understand what you're looking for..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={5} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-kawaii px-4 py-3 font-body font-semibold text-sm text-white placeholder:text-white/40 focus:border-klawsome-yellow outline-none transition-colors resize-y" />
                </div>
              </div>
              <div className="text-center mt-7">
                <Button type="submit" size="lg" className="rounded-bubble px-14 py-6 text-lg font-heading font-semibold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 hover:scale-105 transition-all duration-300">
                  Send Message →
                </Button>
                <p className="text-xs text-white/60 font-body font-bold mt-3">
                  We'll reply within 1-2 business days · {contactEmail}
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      <KawaiiFooter />
    </div>
  );
};

export default Business;
