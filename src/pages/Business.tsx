import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import { toast } from 'sonner';

const opportunityNav = [
  { label: '🎰 Host a Machine in Your Business', href: '#hosted', color: 'border-kawaii-mint text-kawaii-mint' },
  { label: '⭐ Become a Klawsome Partner', href: '#partner', color: 'border-klawsome-yellow text-klawsome-yellow' },
  { label: '🧸 Custom Plushie Orders', href: '#plushie', color: 'border-kawaii-pink text-kawaii-pink' },
];

const klawsomeHandles = [
  'Machine delivery & installation',
  'All prize stocking & restocking',
  'All repairs & maintenance',
  'Revenue tracking & monthly payouts',
  'Ongoing machine operation',
];

const businessProvides = [
  'Floor space for the machine',
  'One standard power outlet',
  'A 2.4GHz WiFi connection',
];

const venues = [
  '🍜 Restaurants',
  '🧋 Bubble Tea Shops',
  '🎳 Entertainment Venues',
  '🛍️ Retail Stores',
  '⏳ Waiting Areas',
  '🏪 High Foot Traffic Spaces',
];

const partnerIncludes = [
  { icon: '🎰', title: 'Machines', desc: 'Full fleet of Klawsome machines customized for your space.' },
  { icon: '🧸', title: 'Prizes', desc: 'Licensed plushies, anime collectibles, and more — supplied by us.' },
  { icon: '📱', title: 'Tech', desc: 'Remote monitoring, cashless payments, and real-time analytics.' },
  { icon: '🎓', title: 'Training', desc: 'Full onboarding so you're confident from day one.' },
  { icon: '📣', title: 'Marketing', desc: 'Brand assets, social media support, and launch help.' },
  { icon: '🔧', title: 'Support', desc: 'Ongoing maintenance support and prize restocking guidance.' },
];

const pricingTiers = [
  { label: 'Simple Design', title: 'Standard Plushie', price: '$4–6', per: 'per unit', desc: 'Clean shapes, minimal detail. Great for branded giveaways and simple mascots.', variant: 'light' as const },
  { label: 'Complex Design', title: 'Detailed Plushie', price: '$6–8', per: 'per unit', desc: 'Highly detailed characters with accessories, facial features, and layered textures.', variant: 'accent' as const },
  { label: 'XL / Life-Size', title: 'Oversized Plushie', price: '$15–40', per: 'per unit', desc: 'Statement-making XL and life-size plushies. Perfect for displays, events, and premium prizes.', variant: 'dark' as const },
];

const howSteps = [
  { num: 1, title: 'Reach Out', desc: 'Fill out the form below and tell us about yourself, your business, and which opportunity interests you.' },
  { num: 2, title: 'We Connect', desc: 'Our team follows up within 1–2 business days to learn more and answer your questions.' },
  { num: 3, title: 'Review & Plan', desc: 'We review your location or concept together and map out the right path forward.' },
  { num: 4, title: 'Launch!', desc: 'Machines installed, plushies stocked, partners trained — you're ready to go.' },
];

const plushieSteps = [
  { icon: '📝', title: 'Share your design', desc: 'Send us a sketch, image, or description of your plushie concept.' },
  { icon: '💬', title: 'We send a quote', desc: 'We review complexity, size, and quantity then get back to you with pricing.' },
  { icon: '✅', title: 'Approve & produce', desc: 'Once approved, we handle production and delivery of your custom order.' },
];

const Business = () => {
  const [formData, setFormData] = useState({ name: '', email: '', opportunity: '', business_type: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Thanks! We'll be in touch within 1–2 business days.');
  };

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-klawsome-navy pt-28 pb-20 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,hsl(var(--klawsome-red)/0.28)_0%,transparent_55%),radial-gradient(ellipse_at_80%_30%,hsl(var(--kawaii-mint)/0.2)_0%,transparent_50%),radial-gradient(ellipse_at_55%_85%,hsl(var(--klawsome-yellow)/0.15)_0%,transparent_45%)]" />
        <div className="container mx-auto relative z-10">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-klawsome-yellow text-klawsome-navy font-heading font-bold text-xs tracking-widest uppercase px-5 py-2 rounded-full mb-7"
          >
            🤝 For Businesses & Partners
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl md:text-6xl font-bold text-white leading-tight mb-5"
          >
            Grow With<br /><span className="text-klawsome-yellow">Klawsome!</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/75 font-body font-semibold text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Three ways to bring the magic of Klawsome into your world — whether you're a business owner, entrepreneur, or creator. Pick your path below.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Button asChild size="lg" className="rounded-full px-10 text-lg kawaii-shadow">
              <a href="#contact">Get in Touch →</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Opportunity Nav Pills */}
      <div className="bg-muted py-7 px-4 text-center border-b border-primary/10">
        <p className="text-xs font-heading font-bold text-muted-foreground tracking-widest uppercase mb-4">Our Opportunities</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {opportunityNav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`inline-block bg-background font-heading font-bold text-sm px-5 py-2 rounded-full border-2 transition-all hover:scale-105 ${item.color}`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* ═══ OPPORTUNITY 1: HOST A MACHINE ═══ */}
      <div id="hosted">
        <div className="relative overflow-hidden bg-gradient-to-br from-kawaii-mint to-[hsl(160,45%,72%)] py-16 px-4 text-center text-white">
          <span className="absolute font-heading text-[220px] font-bold text-white/[0.08] right-[-10px] top-[-40px] leading-none pointer-events-none select-none">01</span>
          <div className="container mx-auto relative z-10">
            <p className="text-xs font-heading font-bold tracking-[3px] uppercase text-white/80 mb-3">Opportunity 01</p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">Host a Klawsome Machine<br />in Your Business</h2>
            <div className="inline-flex items-center gap-2 bg-white/20 border-2 border-white/40 text-white font-bold text-sm px-5 py-2.5 rounded-full mb-7">
              <MapPin className="w-4 h-4" /> Available within 50 miles of Novi, MI (48375) only
            </div>
            <p className="text-white/80 font-body font-semibold text-base max-w-xl mx-auto mb-8 leading-relaxed">
              We place a machine in your space, handle everything, and you earn a share of every token played — no upfront cost, no hassle.
            </p>
            <Button asChild className="rounded-full px-10 bg-klawsome-navy text-white hover:bg-klawsome-navy/90">
              <a href="#contact">Apply for a Hosted Machine</a>
            </Button>
          </div>
        </div>

        <div className="bg-background py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            {/* Profit Banner */}
            <div className="bg-klawsome-navy rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
              <div>
                <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-2">You earn 10% of every token played.</h3>
                <p className="text-white/70 font-body font-semibold text-sm leading-relaxed max-w-md">
                  We handle the machine, the prizes, the repairs — everything. You simply provide the space and a 2.4GHz WiFi connection, and collect your 10% share each month.
                </p>
              </div>
              <span className="font-heading text-6xl md:text-7xl font-bold text-klawsome-yellow whitespace-nowrap">🎯 10%</span>
            </div>

            {/* Responsibility Cards */}
            <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2">What each side handles</h3>
            <p className="text-muted-foreground font-body font-semibold mb-7">A truly hands-off opportunity for your business.</p>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-muted rounded-2xl p-8 border-t-4 border-kawaii-mint">
                <h4 className="font-heading text-xl font-bold mb-1">Klawsome Takes Care Of</h4>
                <p className="text-sm text-muted-foreground font-bold mb-5">We do the heavy lifting</p>
                <ul className="space-y-3">
                  {klawsomeHandles.map((item) => (
                    <li key={item} className="flex items-start gap-3 font-body font-bold text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-kawaii-mint/20 text-kawaii-mint flex items-center justify-center text-xs mt-0.5"><Check className="w-3 h-3" /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-muted rounded-2xl p-8 border-t-4 border-primary">
                <h4 className="font-heading text-xl font-bold mb-1">Your Business Provides</h4>
                <p className="text-sm text-muted-foreground font-bold mb-5">That's really it</p>
                <ul className="space-y-3">
                  {businessProvides.map((item) => (
                    <li key={item} className="flex items-start gap-3 font-body font-bold text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mt-0.5"><Check className="w-3 h-3" /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Venues */}
            <h3 className="font-heading text-xl md:text-2xl font-bold mb-5">Perfect for high-traffic spots</h3>
            <div className="flex flex-wrap gap-3 mb-12">
              {venues.map((v) => (
                <span key={v} className="bg-muted border-2 border-border rounded-full px-5 py-2.5 font-heading font-bold text-sm hover:bg-klawsome-yellow/30 hover:border-klawsome-yellow transition-all cursor-default">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ OPPORTUNITY 2: PARTNER ═══ */}
      <div id="partner">
        <div className="relative overflow-hidden bg-gradient-to-br from-klawsome-navy to-[hsl(216,50%,22%)] py-16 px-4 text-center text-white">
          <span className="absolute font-heading text-[220px] font-bold text-white/[0.08] right-[-10px] top-[-40px] leading-none pointer-events-none select-none">02</span>
          <div className="container mx-auto relative z-10">
            <p className="text-xs font-heading font-bold tracking-[3px] uppercase text-white/80 mb-3">Opportunity 02</p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">Become a<br />Klawsome Partner</h2>
            <p className="text-white/80 font-body font-semibold text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Open your own Klawsome-powered arcade or claw machine corner. We provide the machines, prizes, technology, and training — you bring the space and the hustle.
            </p>
            <Button asChild className="rounded-full px-10 bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-bold">
              <a href="#contact">Apply to Be a Partner</a>
            </Button>
          </div>
        </div>

        <div className="bg-background py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <span className="inline-block bg-klawsome-yellow text-klawsome-navy font-heading font-bold text-base px-7 py-3 rounded-full mb-4">Everything you need, provided.</span>

            <div className="bg-background rounded-2xl p-8 mb-8 kawaii-shadow">
              <h3 className="font-heading text-xl md:text-2xl font-bold text-klawsome-navy mb-3">Why partner with Klawsome?</h3>
              <p className="text-muted-foreground font-body font-semibold leading-relaxed">
                We're not a franchise — we're a partnership. No franchise fees, no royalties. You operate independently with our full backing. We succeed when you succeed.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
              {partnerIncludes.map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -4 }}
                  className="bg-background rounded-xl p-6 kawaii-shadow border-b-4 border-klawsome-yellow"
                >
                  <span className="text-3xl mb-3 block">{item.icon}</span>
                  <h5 className="font-heading text-base font-bold text-klawsome-navy mb-1">{item.title}</h5>
                  <p className="text-xs text-muted-foreground font-body font-semibold leading-snug">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-klawsome-navy rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start mb-10">
              <span className="text-4xl flex-shrink-0">🏗️</span>
              <div>
                <h4 className="font-heading text-xl font-bold text-klawsome-yellow mb-2">Build your own brand. Keep your freedom.</h4>
                <p className="text-white/75 font-body font-semibold text-sm leading-relaxed">
                  You can brand your space however you want. We provide the infrastructure, you create the experience. No strict playbooks — just guidance, support, and winning prizes.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Button asChild className="rounded-full px-10 bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-bold">
                <a href="#contact">Become a Partner →</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ OPPORTUNITY 3: CUSTOM PLUSHIES ═══ */}
      <div id="plushie">
        <div className="relative overflow-hidden bg-gradient-to-br from-[hsl(340,60%,65%)] to-kawaii-pink py-16 px-4 text-center text-white">
          <span className="absolute font-heading text-[220px] font-bold text-white/[0.08] right-[-10px] top-[-40px] leading-none pointer-events-none select-none">03</span>
          <div className="container mx-auto relative z-10">
            <p className="text-xs font-heading font-bold tracking-[3px] uppercase text-white/80 mb-3">Opportunity 03</p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">Custom Plushie<br />Orders</h2>
            <p className="text-white/80 font-body font-semibold text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Turn your character, mascot, or idea into a real plushie. We handle sourcing, manufacturing, and delivery — from concept to cuddly reality.
            </p>
            <Button asChild className="rounded-full px-10 bg-klawsome-navy text-white hover:bg-klawsome-navy/90">
              <a href="#contact">Start a Custom Order</a>
            </Button>
          </div>
        </div>

        <div className="bg-background py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            {/* Min order callout */}
            <div className="bg-muted border-l-4 border-kawaii-pink rounded-r-xl p-5 flex items-center gap-4 mb-10">
              <span className="text-3xl flex-shrink-0">📦</span>
              <p className="font-body font-bold text-sm">
                Minimum order: <span className="text-primary">100 units</span>. Pricing varies by size, complexity, and quantity.
              </p>
            </div>

            <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2">Pricing by complexity</h3>
            <p className="text-muted-foreground font-body font-semibold mb-7">All prices are per unit, based on minimum 100-unit orders.</p>

            <div className="grid md:grid-cols-3 gap-5 mb-10">
              {pricingTiers.map((tier) => (
                <motion.div
                  key={tier.title}
                  whileHover={{ y: -5 }}
                  className={`rounded-2xl p-8 text-center transition-all ${
                    tier.variant === 'dark'
                      ? 'bg-klawsome-navy border-2 border-klawsome-navy'
                      : tier.variant === 'accent'
                      ? 'bg-muted border-2 border-primary'
                      : 'bg-muted border-2 border-border'
                  }`}
                >
                  <p className={`text-xs font-bold tracking-widest uppercase mb-2 ${tier.variant === 'dark' ? 'text-klawsome-yellow' : 'text-primary'}`}>{tier.label}</p>
                  <h5 className={`font-heading text-lg font-bold mb-2 ${tier.variant === 'dark' ? 'text-white' : 'text-klawsome-navy'}`}>{tier.title}</h5>
                  <p className={`font-heading text-4xl font-bold mb-1 ${tier.variant === 'dark' ? 'text-klawsome-yellow' : 'text-klawsome-navy'}`}>{tier.price}</p>
                  <p className={`text-sm font-bold mb-3 ${tier.variant === 'dark' ? 'text-white/60' : 'text-muted-foreground'}`}>{tier.per}</p>
                  <p className={`text-sm font-semibold leading-snug ${tier.variant === 'dark' ? 'text-white/65' : 'text-muted-foreground'}`}>{tier.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* How it works - plushie */}
            <div className="bg-muted rounded-2xl p-8 mb-10">
              <h3 className="font-heading text-xl md:text-2xl font-bold mb-6">How it works</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {plushieSteps.map((step) => (
                  <div key={step.title} className="text-center">
                    <span className="text-3xl mb-2 block">{step.icon}</span>
                    <h6 className="font-heading text-base font-bold mb-1">{step.title}</h6>
                    <p className="text-sm text-muted-foreground font-body font-semibold leading-snug">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button asChild className="rounded-full px-10 bg-[hsl(340,60%,65%)] text-white hover:bg-[hsl(340,60%,55%)]">
                <a href="#contact">Start Your Custom Order →</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="bg-klawsome-navy py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <p className="text-xs font-heading font-bold tracking-[3px] uppercase text-klawsome-yellow mb-3">The Process</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-14">Getting Started is Easy</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
            {howSteps.map((step) => (
              <div key={step.num}>
                <div className="w-14 h-14 bg-klawsome-yellow text-klawsome-navy font-heading text-xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 kawaii-shadow">
                  {step.num}
                </div>
                <h4 className="font-heading text-base font-bold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-white/60 font-body font-semibold leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" className="bg-background py-20 px-4 text-center">
        <div className="container mx-auto max-w-2xl">
          <p className="text-xs font-heading font-bold tracking-[3px] uppercase text-primary mb-3">Let's Talk</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground font-body font-semibold mb-10">Tell us which opportunity excites you and we'll take it from there.</p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-kawaii-mint/10 border-2 border-kawaii-mint rounded-xl p-6 text-kawaii-mint font-heading font-bold text-lg"
            >
              🎉 Thanks! We'll be in touch within 1–2 business days.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="text-left">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-heading font-bold">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background border-2 border-border rounded-xl px-4 py-3 font-body font-semibold text-sm focus:border-primary outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-heading font-bold">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@yourbusiness.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background border-2 border-border rounded-xl px-4 py-3 font-body font-semibold text-sm focus:border-primary outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-heading font-bold">I'm interested in…</label>
                  <select
                    value={formData.opportunity}
                    onChange={(e) => setFormData({ ...formData, opportunity: e.target.value })}
                    className="bg-background border-2 border-border rounded-xl px-4 py-3 font-body font-semibold text-sm focus:border-primary outline-none transition-colors"
                  >
                    <option value="">Select an opportunity…</option>
                    <option>Host a Klawsome machine in my business</option>
                    <option>Become a Klawsome Partner (open my own arcade)</option>
                    <option>Custom plushie order</option>
                    <option>Multiple opportunities</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-heading font-bold">I am a…</label>
                  <select
                    value={formData.business_type}
                    onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                    className="bg-background border-2 border-border rounded-xl px-4 py-3 font-body font-semibold text-sm focus:border-primary outline-none transition-colors"
                  >
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
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-heading font-bold">Tell us more</label>
                  <textarea
                    placeholder="Share your idea, location, concept — anything that helps us understand what you're looking for…"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="bg-background border-2 border-border rounded-xl px-4 py-3 font-body font-semibold text-sm focus:border-primary outline-none transition-colors resize-y"
                  />
                </div>
              </div>
              <div className="text-center mt-7">
                <Button type="submit" size="lg" className="rounded-full px-14 text-lg">
                  Send Message →
                </Button>
                <p className="text-xs text-muted-foreground font-body font-bold mt-3">
                  We'll reply within 1–2 business days · hello@klawsomenovi.com
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
