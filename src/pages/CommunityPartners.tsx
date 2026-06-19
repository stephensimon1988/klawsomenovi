import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import asianYouthNovi from '@/assets/community/asian-youth-novi.webp';
import kalayaanPh from '@/assets/community/kalayaan-ph-independence.webp';
import paaralangTrunkAsset from '@/assets/community/paaralang-trunk-or-treat-v2.png.asset.json';
import cannedFoodDrive from '@/assets/community/canned-food-drive.webp';
import toysForTots from '@/assets/community/toys-for-tots.webp';
import msuPass from '@/assets/community/msu-pass.webp';
import colorfulCollection from '@/assets/community/colorful-collection.webp';
import noviLibraryAsset from '@/assets/community/novi-public-library-v2.png.asset.json';
import communityHeroAsset from '@/assets/community/community-partners-hero.png.asset.json';

const paaralangTrunk = paaralangTrunkAsset.url;
const noviLibrary = noviLibraryAsset.url;

interface Partner {
  name: string;
  tag: string;
  blurb: string;
  image: string;
}

const PLACEHOLDER = '/placeholder.svg';

const dearAsianYouth: Partner = {
  name: 'Dear Asian Youth Novi',
  tag: 'Tabling',
  blurb:
    'We joined Dear Asian Youth Novi and the Asian Youth Advocates at the Novi Community Fest — tabling, handing out giveaways, and celebrating AAPI representation alongside our neighbors.',
  image: asianYouthNovi,
};
const kalayaan: Partner = {
  name: 'Kalayaan PH Independence Festival',
  tag: 'Tabling · Giveaways',
  blurb:
    'We tabled at the Kalayaan Philippine Independence Day Festival, running kids\u2019 games and giveaways to celebrate Filipino culture with the community.',
  image: kalayaanPh,
};
const paaralangTrunkOrTreat: Partner = {
  name: 'Paaralang-Pilipino — Trunk or Treat',
  tag: 'Tabling · Costume Prizes',
  blurb:
    'Halloween Trunk or Treat with Paaralang-Pilipino — costume contest prizes, kawaii plushies, and a whole lot of candy for the kids.',
  image: paaralangTrunk,
};
const cannedFood: Partner = {
  name: 'Canned Food Drive',
  tag: 'Service Project',
  blurb:
    'In partnership with Paaralang-Pilipino, we collected and donated canned goods to families in need across the metro Detroit area.',
  image: cannedFoodDrive,
};
const toysForTotsPartner: Partner = {
  name: 'Toys for Tots',
  tag: 'Service Project',
  blurb:
    'Donating and sorting toys with Paaralang-Pilipino so every kid wakes up to something special during the holidays.',
  image: toysForTots,
};
const msuPassPartner: Partner = {
  name: 'MSU PASS',
  tag: 'Student Org Visits',
  blurb:
    'Michigan State University\u2019s Philippine American Student Society visits Klawsome with Paaralang-Pilipino — bridging college students with younger Filipino-American learners across all three locations.',
  image: msuPass,
};
const colorfulCollectionPartner: Partner = {
  name: 'Colorful Collection',
  tag: 'Literacy · Representation',
  blurb:
    'A University of Michigan student-created nonprofit advocating children\u2019s literacy and Asian representation. We team up with Colorful Collection and Paaralang-Pilipino to put more books with kids who see themselves on the page.',
  image: colorfulCollection,
};
const noviLibraryPartner: Partner = {
  name: 'Novi Public Library',
  tag: 'National Reading Month',
  blurb:
    'For National Reading Month we partnered with the Novi Public Library and Colorful Collection on a challenge bookmark and reading rewards — including free play at Klawsome!',
  image: noviLibrary,
};

const partnerGroups: { heading: string; items: Partner[] }[] = [
  {
    heading: 'Youth in Novi',
    items: [noviLibraryPartner, dearAsianYouth],
  },
  {
    heading: 'Filipino Groups of Michigan',
    items: [msuPassPartner, colorfulCollectionPartner, kalayaan, paaralangTrunkOrTreat],
  },
  {
    heading: 'Local Service Projects',
    items: [toysForTotsPartner, cannedFood],
  },
];

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
  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />

      <PageHero
        eyebrow="Community"
        title="Community Outreach"
        subtitle="Klawsome is proud to team up with local schools, student orgs, libraries, and nonprofits across metro Detroit. Here are some of the people we get to show up for."
        imageUrl={communityHeroAsset.url}
        jumpLinks={[
          { label: 'Our Partners', id: 'partners' },
          { label: 'Cross-Promote', id: 'cross-promote' },
          { label: 'Collaborate', id: 'collaborate' },
        ]}
      />

      {/* Partners 4-col grid */}
      <section id="partners" className="section-y section-x scroll-mt-32">
        <div className="ds-container">
          <h2 className="ds-h2 ds-stroke ds-stroke--navy uppercase mb-12 border-t border-foreground pt-6">Our Partners</h2>
          {partnerGroups.map((group) => (
            <div key={group.heading} className="mt-12 first:mt-0">
              <h3 className="font-heading font-bold uppercase tracking-wide text-2xl text-klawsome-navy mb-6">
                {group.heading}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {group.items.map((p) => (
                  <article
                    key={p.name}
                    className="flex flex-col bg-card rounded-kawaii border border-border overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="img-hover h-56 flex items-center justify-center bg-secondary/40">
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
                      <h4 className="font-heading font-bold text-lg text-klawsome-navy leading-tight">
                        {p.name}
                      </h4>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">{p.blurb}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-promo (from PDF) */}
      <section id="cross-promote" className="section-y section-x bg-secondary/40 scroll-mt-32">
        <div className="ds-container grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="ds-h2 ds-stroke ds-stroke--navy uppercase mb-6">Easy ways to cross-promote</h2>
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
            <h2 className="ds-h2 ds-stroke ds-stroke--navy uppercase mb-6">Want to go further?</h2>
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
        <div id="collaborate" className="ds-container mt-12 text-center scroll-mt-32">
          <Button
            asChild
            size="lg"
            className="rounded-full px-10 py-6 text-sm font-heading font-bold tracking-wider bg-primary hover:bg-primary/90 text-white uppercase"
          >
            <a href="mailto:team@klawsomenovi.com?subject=Collaborate%20with%20Klawsome">
              Collaborate With Us
            </a>
          </Button>
        </div>
      </section>

      <KawaiiFooter prevColor="secondary-soft" />
    </div>
  );
};

export default CommunityPartners;