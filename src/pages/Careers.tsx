import { Button } from '@/components/ui/button';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import KawaiiDivider from '@/components/KawaiiDivider';
import { useCmsTable, usePageHero, type JobListing } from '@/hooks/useCmsContent';
import PageHero from '@/components/PageHero';
import JobDescriptionDialog from '@/components/JobDescriptionDialog';
import { GraduationCap, Crown, PartyPopper, ShoppingCart, TrendingUp, Sparkles, type LucideIcon } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';

const ROLE_META: Record<string, { icon: LucideIcon; tagline: string }> = {
  'Summer Intern': {
    icon: GraduationCap,
    tagline: 'A 2–3 month mentorship in your field — part-time, hybrid, ends with a recommendation letter.',
  },
  'General Manager': {
    icon: Crown,
    tagline: 'Lead day-to-day operations, coach the team, and own the in-store experience.',
  },
  'Events Assistant Manager': {
    icon: PartyPopper,
    tagline: 'Help plan and run birthdays, group parties, and special events from start to finish.',
  },
  'Purchasing Specialist': {
    icon: ShoppingCart,
    tagline: 'Source the cutest plushies and keep every claw machine perfectly stocked.',
  },
  'Corporate Development Fellow': {
    icon: TrendingUp,
    tagline: 'Research markets and shape the story that grows Klawsome beyond a single location.',
  },
};

const getRoleMeta = (title: string) =>
  ROLE_META[title] || { icon: Sparkles, tagline: 'Join the Klawsome team and help create joyful moments.' };

const Careers = () => {
  const { data: allJobs } = useCmsTable<JobListing>('job_listings');
  const { data: hero } = usePageHero('careers');

  const inStoreJobs = allJobs?.filter(j => j.category === 'in-store') || [];
  const hybridJobs = allJobs?.filter(j => j.category === 'hybrid') || [];
  const unpaidJobs = allJobs?.filter(j => j.category === 'unpaid') || [];

  return (
    <div className="min-h-screen bg-klawsome-navy">
      <KawaiiNav />

      <PageHero
        eyebrow={hero?.eyebrow || 'Join Us'}
        title={hero?.title || 'Careers'}
        subtitle={hero?.subtitle || 'Join the Klawsome team and help create a fun, welcoming experience for everyone!'}
        imageUrl={hero?.image_url || 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.webp'}
        
        overlay="white"
        jumpLinks={[
          ...(inStoreJobs.length > 0 ? [{ label: 'In-Store', id: 'in-store' }] : []),
          ...(hybridJobs.length > 0 ? [{ label: 'Hybrid / Paid', id: 'hybrid-paid' }] : []),
          ...(unpaidJobs.length > 0 ? [{ label: 'Unpaid Opps', id: 'unpaid-opps' }] : []),
        ]}
      />

      {/* In-Store Jobs */}
      {inStoreJobs.length > 0 && (
        <section id="in-store" className="section-y section-x">
          <div className="ds-container max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-10 text-center">In-Store Positions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {inStoreJobs.map((job) => (
                <div key={job.id} className="bg-white/10 backdrop-blur-sm rounded-kawaii border border-white/20 overflow-hidden flex flex-col">
                  {job.image_url && (
                    <div className="img-hover">
                      <img src={job.image_url} alt={job.title} className="w-full aspect-square object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="p-6 md:p-8 flex flex-col">
                    <h3 className="font-heading font-bold text-xl text-white mb-3">{job.title}</h3>
                    <p 
                      className="text-white/70 font-body text-sm leading-relaxed mb-6 flex-1"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.description) }}
                    />
                    <div className="flex flex-wrap gap-3">
                      <JobDescriptionDialog
                        title={job.title}
                        url={job.job_desc_url}
                        applyUrl={job.apply_url}
                        fallbackDescription={job.description}
                        trigger={
                          <Button className="rounded-full font-heading font-bold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90">
                            View Job Description
                          </Button>
                        }
                      />
                      {job.apply_url && (
                        <Button asChild className="rounded-full font-heading font-bold bg-primary hover:bg-primary/90 text-white">
                          <a href={job.apply_url} target="_blank" rel="noopener noreferrer">Apply Here</a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hybrid / Paid Jobs */}
      {hybridJobs.length > 0 && (
        <>
        {inStoreJobs.length > 0 && (
          <KawaiiDivider variant="scallop" from="navy" to="baby-blue" stroke="white" height={90} />
        )}
        <section id="hybrid-paid" className="section-y section-x bg-klawsome-baby-blue">
          <div className="ds-container max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-klawsome-navy mb-10 text-center">Hybrid / Paid Jobs</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hybridJobs.map((job) => {
                const { icon: Icon, tagline } = getRoleMeta(job.title);
                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-kawaii border border-klawsome-navy/10 shadow-sm p-6 text-center flex flex-col items-center transition-transform hover:-translate-y-1"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-primary" strokeWidth={2} />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-klawsome-navy mb-2">{job.title}</h3>
                    <p className="text-klawsome-navy/70 font-body text-sm leading-relaxed mb-5 flex-1">
                      {tagline}
                    </p>
                    <div className="flex flex-col gap-2 w-full">
                      <JobDescriptionDialog
                        title={job.title}
                        url={job.job_desc_url}
                        applyUrl={job.apply_url}
                        fallbackDescription={job.description}
                        trigger={
                          <Button size="sm" className="w-full rounded-full font-heading font-bold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90">
                            Job Description
                          </Button>
                        }
                      />
                      {job.apply_url && (
                        <Button asChild size="sm" className="w-full rounded-full font-heading font-bold bg-primary hover:bg-primary/90 text-white">
                          <a href={job.apply_url} target="_blank" rel="noopener noreferrer">Apply Here</a>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        </>
      )}

      <KawaiiDivider variant="wave" from={hybridJobs.length > 0 ? 'baby-blue' : 'navy'} to="white" stroke="red" height={90} />
      <section className="section-y section-x bg-white">
        <div className="ds-container max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-klawsome-navy mb-6 text-center">
            Join the Klawsome Team: Build Joy, Community, and Memorable Experiences
          </h2>
          <p className="text-klawsome-navy/70 font-body text-center max-w-3xl mx-auto mb-4 leading-relaxed">
            At Klawsome, we believe an arcade can be more than entertainment — it can be a place of community, culture, and connection. As Michigan's first stand-alone claw machine arcade, Klawsome continues to grow rapidly, and we're looking for passionate, energetic individuals who want to help create an unforgettable environment for kids, families, and claw-machine lovers.
          </p>
          <p className="text-klawsome-navy/80 font-heading font-bold text-center text-lg mb-10">
            🌱 Why Work at Klawsome?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <div className="text-center md:text-left">
              <div className="text-3xl mb-3">💖</div>
              <h3 className="font-heading font-bold text-klawsome-navy mb-2">A Family-Owned Company with Heart</h3>
              <p className="text-klawsome-navy/70 font-body text-sm leading-relaxed">
                Klawsome's culture is rooted in family, community, and shared joy — values reinforced throughout their Origin Story.
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl mb-3">🌏</div>
              <h3 className="font-heading font-bold text-klawsome-navy mb-2">Inspired by Asian Arcade Culture</h3>
              <p className="text-klawsome-navy/70 font-body text-sm leading-relaxed">
                Employees join a brand that embraces kawaii culture, Asian arcade aesthetics, and cross-cultural creativity.
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl mb-3">🧸</div>
              <h3 className="font-heading font-bold text-klawsome-navy mb-2">A Fun, Energetic Environment</h3>
              <p className="text-klawsome-navy/70 font-body text-sm leading-relaxed">
                Team members spend their days surrounded by plushies, laughter, bright visuals, and families making memories.
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl mb-3">🎮</div>
              <h3 className="font-heading font-bold text-klawsome-navy mb-2">Meaningful Guest Interactions</h3>
              <p className="text-klawsome-navy/70 font-body text-sm leading-relaxed">
                Customer reviews highlight how Klawsome staff help ensure "everyone gets prizes" and create supportive experiences for kids.
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-heading font-bold text-klawsome-navy mb-2">Opportunities for Growth</h3>
              <p className="text-klawsome-navy/70 font-body text-sm leading-relaxed">
                Roles span operations, leadership, business development, merchandising, web development, and creative design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Unpaid Opportunities */}
      {unpaidJobs.length > 0 && (
        <>
        <KawaiiDivider variant="cloud" from="white" to="navy" stroke="white" height={90} />
        <section id="unpaid-opps" className="section-y section-x bg-klawsome-navy">
          <div className="ds-container max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-10 text-center">Hybrid / Unpaid Opportunities</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {unpaidJobs.map((job) => (
                <div key={job.id} className="bg-white/10 backdrop-blur-sm rounded-kawaii border border-white/20 overflow-hidden flex flex-col">
                  {job.image_url && (
                    <div className="img-hover">
                      <img src={job.image_url} alt={job.title} className="w-full aspect-square object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="p-6 md:p-8 flex flex-col">
                    <h3 className="font-heading font-bold text-xl text-white mb-3">{job.title}</h3>
                    <p 
                      className="text-white/70 font-body text-sm leading-relaxed mb-6 flex-1"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.description) }}
                    />
                    <div className="flex flex-wrap gap-3">
                      <JobDescriptionDialog
                        title={job.title}
                        url={job.job_desc_url}
                        applyUrl={job.apply_url}
                        fallbackDescription={job.description}
                        trigger={
                          <Button size="sm" className="rounded-full font-heading font-bold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90">
                            View Job Description
                          </Button>
                        }
                      />
                      {job.apply_url && (
                        <Button asChild size="sm" className="rounded-full font-heading font-bold bg-primary hover:bg-primary/90 text-white">
                          <a href={job.apply_url} target="_blank" rel="noopener noreferrer">Apply Here</a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        </>
      )}

      <KawaiiFooter
        prevColor={
          unpaidJobs.length > 0
            ? 'navy'
            : 'white'
        }
      />
    </div>
  );
};

export default Careers;
