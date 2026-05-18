import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { openBookingModal } from '@/components/BookNowDialog';
import asianYouthNovi from '@/assets/community/asian-youth-novi.jpg';
import kalayaanPh from '@/assets/community/kalayaan-ph-independence.jpg';
import paaralangTrunk from '@/assets/community/paaralang-pilipino-halloween-trunk.jpg';
import cannedFoodDrive from '@/assets/community/canned-food-drive.jpg';

interface Partner {
  name: string;
  tag: string;
  blurb: string;
  image: string;
}

const PLACEHOLDER = '/placeholder.svg';

const partners: Partner[] = [
  {
    name: 'Dear Asian Youth Novi',
    tag: 'Tabling',
    blurb:
      'We joined Dear Asian Youth Novi and the Asian Youth Advocates at the Novi Community Fest — tabling, handing out giveaways, and celebrating AAPI representation alongside our neighbors.',
    image: asianYouthNovi,
  },
  {
    name: 'Kalayaan PH Independence Festival',
    tag: 'Tabling · Giveaways',
    blurb:
      'We tabled at the Kalayaan Philippine Independence Day Festival, running kids\u2019 games and giveaways to celebrate Filipino culture with the community.',
    image: kalayaanPh,
  },
  {
    name: 'Paaralang-Pilipino — Trunk or Treat',
    tag: 'Tabling · Costume Prizes',
    blurb:
      'Halloween Trunk or Treat with Paaralang-Pilipino — costume contest prizes, kawaii plushies, and a whole lot of candy for the kids.',
    image: paaralangTrunk,
  },
  {
    name: 'Canned Food Drive',
    tag: 'Service Project',
    blurb:
      'In partnership with Paaralang-Pilipino, we collected and donated canned goods to families in need across the metro Detroit area.',
    image: cannedFoodDrive,
  },
  {
    name: 'Toys for Tots',
    tag: 'Service Project',
    blurb:
      'Donating and sorting toys with Paaralang-Pilipino so every kid wakes up to something special during the holidays.',
    image: PLACEHOLDER,
  },
  {
    name: 'MSU PASS',
    tag: 'Student Org Visits',
    blurb:
      'Michigan State University\u2019s Philippine American Student Society visits Klawsome with Paaralang-Pilipino — bridging college students with younger Filipino-American learners across all three locations.',
    image: PLACEHOLDER,
  },
  {
    name: 'Colorful Collection',
    tag: 'Literacy · Representation',
    blurb:
      'A University of Michigan student-created nonprofit advocating children\u2019s literacy and Asian representation. We team up with Colorful Collection and Paaralang-Pilipino to put more books with kids who see themselves on the page.',
    image: PLACEHOLDER,
  },
  {
    name: 'Novi Public Library',
    tag: 'National Reading Month',
    blurb:
      'For National Reading Month we partnered with the Novi Public Library and Colorful Collection on a challenge bookmark and reading rewards — including free play at Klawsome!',
    image: PLACEHOLDER,
  },
];

const galleryPhotos: { caption: string; image: string }[] = Array.from({ length: 16 }).map((_, i) => ({
  caption: [
    'Novi Community Fest', 'Novi Community Fest', 'Kalayaan Festival', 'Kalayaan Festival',
    'Trunk or Treat', 'Trunk or Treat', 'Canned Food Drive', 'Canned Food Drive',
    'Toys for Tots', 'Toys for Tots', 'MSU PASS Visit', 'MSU PASS Visit',
    'Colorful Collection', 'Colorful Collection', 'Novi Library Reading Month', 'Novi Library Reading Month',
  ][i],
  image: PLACEHOLDER,
}));

const crossPromoEasy = [
  'Newsletter / Social Media mentions',
  'Website feature',
  'In-store flyer mentions',
  'Free play exchange',
];

const crossPromoInvolved = [
  'Coupon exchange',
  'Claw machine placement (profit share)',
  'Catering discount',
  'Custom plush of your mascot with your brand',
  'Custom claw machine with your brand & design',
];

const CommunityPartners = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const next = useCallback(
    () => setLightbox((i) => (i === null ? i : (i + 1) % galleryPhotos.length)),
    [],
  );
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? i : (i - 1 + galleryPhotos.length) % galleryPhotos.length)),
    [],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, close, next, prev]);

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />

      <PageHero
        eyebrow="Community"
        title="Community Partners"
        subtitle="Klawsome is proud to team up with local schools, student orgs, libraries, and nonprofits across metro Detroit. Here are some of the people we get to show up for."
        imageUrl=""
      />

      {/* Partners 4-col grid */}
      <section className="section-y section-x">
        <div className="ds-container">
          <h2 className="ds-h2 uppercase mb-12 border-t border-foreground pt-6">Our Partners</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.map((p) => (
              <article
                key={p.name}
                className="flex flex-col bg-card rounded-kawaii border border-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-56 flex items-center justify-center bg-secondary/40 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className={p.image === PLACEHOLDER ? 'max-h-full max-w-full object-contain' : 'w-full h-full object-cover'}
                  />
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <span className="inline-block self-start text-[10px] tracking-[0.18em] uppercase font-heading font-bold px-3 py-1 rounded-full bg-primary/15 text-primary">
                    {p.tag}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-klawsome-navy leading-tight">
                    {p.name}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{p.blurb}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-promo (from PDF) */}
      <section className="section-y section-x bg-secondary/40">
        <div className="ds-container grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="ds-h2 uppercase mb-6">Easy ways to cross-promote</h2>
            <ul className="space-y-3 font-body text-foreground">
              {crossPromoEasy.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 inline-block w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="ds-h2 uppercase mb-6">Want to go further?</h2>
            <ul className="space-y-3 font-body text-foreground">
              {crossPromoInvolved.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 inline-block w-2 h-2 rounded-full bg-accent shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Photo gallery */}
      <section className="section-y section-x">
        <div className="ds-container">
          <h2 className="ds-h2 uppercase mb-12 border-t border-foreground pt-6">Community Photo Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryPhotos.map((p, idx) => (
              <figure key={idx} className="group">
                <button
                  type="button"
                  onClick={() => setLightbox(idx)}
                  className="block w-full aspect-square overflow-hidden rounded-2xl bg-secondary cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={p.caption}
                >
                  <img
                    src={p.image}
                    alt={p.caption}
                    loading="lazy"
                    className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
                <figcaption className="mt-3 text-sm font-body text-muted-foreground">{p.caption}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-8 text-sm font-body text-muted-foreground">
            Photos are placeholders — swap them in the Command Center once you\u2019ve picked your favorites from the Google Photos albums.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-y section-x bg-primary/10">
        <div className="ds-container text-center">
          <h2 className="ds-h2 uppercase mb-4">Collaborate with us!</h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto mb-8">
            For more info, visit klawsomenovi.com or email{' '}
            <a href="mailto:team@klawsomenovi.com" className="text-primary underline">
              team@klawsomenovi.com
            </a>
            .
          </p>
          <Button
            size="lg"
            onClick={openBookingModal}
            className="rounded-full px-8 font-heading font-bold tracking-wider bg-primary hover:bg-primary/90 text-white"
          >
            GET IN TOUCH
          </Button>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label="Previous"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label="Next"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
          <figure
            className="max-w-[92vw] max-h-[88vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryPhotos[lightbox].image}
              alt={galleryPhotos[lightbox].caption}
              className="max-w-[92vw] max-h-[78vh] object-contain rounded-lg shadow-2xl bg-white p-8"
            />
            <figcaption className="text-white/80 font-body text-sm text-center">
              {galleryPhotos[lightbox].caption}
              <span className="ml-3 text-white/50">{lightbox + 1} / {galleryPhotos.length}</span>
            </figcaption>
          </figure>
        </div>
      )}

      <KawaiiFooter />
    </div>
  );
};

export default CommunityPartners;