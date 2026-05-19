import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import PageHero from '@/components/PageHero';
import asianYouthNovi from '@/assets/community/asian-youth-novi.jpg';
import kalayaanPh from '@/assets/community/kalayaan-ph-independence.jpg';
import paaralangTrunk from '@/assets/community/paaralang-pilipino-halloween-trunk.jpg';
import cannedFoodDrive from '@/assets/community/canned-food-drive.jpg';
import toysForTots from '@/assets/community/toys-for-tots.jpg';
import msuPass from '@/assets/community/msu-pass.jpg';
import colorfulCollection from '@/assets/community/colorful-collection.jpg';
import noviLibrary from '@/assets/community/asian-youth-alliance.avif';

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
    image: toysForTots,
  },
  {
    name: 'MSU PASS',
    tag: 'Student Org Visits',
    blurb:
      'Michigan State University\u2019s Philippine American Student Society visits Klawsome with Paaralang-Pilipino — bridging college students with younger Filipino-American learners across all three locations.',
    image: msuPass,
  },
  {
    name: 'Colorful Collection',
    tag: 'Literacy · Representation',
    blurb:
      'A University of Michigan student-created nonprofit advocating children\u2019s literacy and Asian representation. We team up with Colorful Collection and Paaralang-Pilipino to put more books with kids who see themselves on the page.',
    image: colorfulCollection,
  },
  {
    name: 'Novi Public Library',
    tag: 'National Reading Month',
    blurb:
      'For National Reading Month we partnered with the Novi Public Library and Colorful Collection on a challenge bookmark and reading rewards — including free play at Klawsome!',
    image: noviLibrary,
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

      <KawaiiFooter />
    </div>
  );
};

export default CommunityPartners;