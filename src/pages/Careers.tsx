import { Button } from '@/components/ui/button';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import KawaiiDivider from '@/components/KawaiiDivider';
import { useCmsTable, usePageHero, type JobListing } from '@/hooks/useCmsContent';
import PageHero from '@/components/PageHero';
import JobDescriptionDialog from '@/components/JobDescriptionDialog';

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
        imageUrl={hero?.image_url || 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg'}
        height="md"
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
                    <img src={job.image_url} alt={job.title} className="w-full aspect-square object-cover" loading="lazy" />
                  )}
                  <div className="p-6 md:p-8 flex flex-col">
                    <h3 className="font-heading font-bold text-xl text-white mb-3">{job.title}</h3>
                    <p 
                      className="text-white/70 font-body text-sm leading-relaxed mb-6 flex-1"
                      dangerouslySetInnerHTML={{ __html: job.description }}
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
          <KawaiiDivider variant="scallop" from="navy" to="red" stroke="yellow" height={90} />
        )}
        <section id="hybrid-paid" className="section-y section-x bg-primary">
          <div className="ds-container max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-10 text-center">Hybrid / Paid Jobs</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {hybridJobs.map((job) => (
                <div key={job.id} className="bg-white/15 rounded-kawaii border border-white/20 p-6 text-center">
                  <img
                    src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/8184018c-90f9-4412-a17e-7bdfbbdd62a9/klaw-penguin.png"
                    alt="" className="w-20 mx-auto mb-4" loading="lazy"
                  />
                  <h3 className="font-heading font-bold text-lg text-white mb-4">{job.title}</h3>
                  <div className="flex flex-col gap-2">
                    <JobDescriptionDialog
                      title={job.title}
                      url={job.job_desc_url}
                      applyUrl={job.apply_url}
                      fallbackDescription={job.description}
                      trigger={
                        <Button size="sm" className="rounded-full font-heading font-bold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90">
                          Job Description
                        </Button>
                      }
                    />
                    {job.apply_url && (
                      <Button asChild size="sm" className="rounded-full font-heading font-bold bg-white/20 text-white hover:bg-white/30">
                        <a href={job.apply_url} target="_blank" rel="noopener noreferrer">Apply Here</a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        </>
      )}

      {/* Unpaid Opportunities */}
      {unpaidJobs.length > 0 && (
        <>
        <KawaiiDivider variant="cloud" from={hybridJobs.length > 0 ? 'red' : 'navy'} to="navy" stroke="baby-pink" height={90} />
        <section id="unpaid-opps" className="section-y section-x bg-klawsome-navy">
          <div className="ds-container max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-10 text-center">Hybrid / Unpaid Opportunities</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {unpaidJobs.map((job) => (
                <div key={job.id} className="bg-white/10 backdrop-blur-sm rounded-kawaii border border-white/20 overflow-hidden flex flex-col">
                  {job.image_url && (
                    <img src={job.image_url} alt={job.title} className="w-full aspect-square object-cover" loading="lazy" />
                  )}
                  <div className="p-6 md:p-8 flex flex-col">
                    <h3 className="font-heading font-bold text-xl text-white mb-3">{job.title}</h3>
                    <p 
                      className="text-white/70 font-body text-sm leading-relaxed mb-6 flex-1"
                      dangerouslySetInnerHTML={{ __html: job.description }}
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
            : hybridJobs.length > 0
              ? 'red'
              : 'navy'
        }
      />
    </div>
  );
};

export default Careers;
