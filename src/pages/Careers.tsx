import { Button } from '@/components/ui/button';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import { useCmsTable, type JobListing } from '@/hooks/useCmsContent';

const Careers = () => {
  const { data: allJobs } = useCmsTable<JobListing>('job_listings');

  const inStoreJobs = allJobs?.filter(j => j.category === 'in-store') || [];
  const hybridJobs = allJobs?.filter(j => j.category === 'hybrid') || [];
  const unpaidJobs = allJobs?.filter(j => j.category === 'unpaid') || [];

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />

      {/* Full-bleed hero */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/55fefb9f-eb8b-4185-a0bf-aec7b9e28a73/Klawsome_FriendsFamily-054-Edit.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 pb-20 pt-32">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white uppercase leading-[0.95] mb-6">
              CAREERS
            </h1>
            <p className="text-white/70 font-body text-lg max-w-xl">
              Join the Klawsome team and help create a fun, welcoming experience for everyone!
            </p>
            <img
              src="https://images.squarespace-cdn.com/content/679927505e618d391ae386e6/8c57b6f1-0c08-4d2f-bb04-e54051ae7f0b/Klawsome_Fox__CUT.png?content-type=image%2Fpng"
              alt="Klawsome Fox"
              className="w-28 mt-8"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* In-Store Jobs */}
      {inStoreJobs.length > 0 && (
        <section className="py-28 px-6 lg:px-12 bg-background">
          <div className="container mx-auto max-w-4xl">
            <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-4">Open Roles</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-12 leading-tight">In-Store Positions</h2>
            <div className="space-y-8">
              {inStoreJobs.map((job) => (
                <div key={job.id} className="rounded-2xl border border-border bg-background overflow-hidden md:flex hover:shadow-lg transition-shadow">
                  {job.image_url && (
                    <img src={job.image_url} alt={job.title} className="w-full md:w-72 h-56 md:h-auto object-cover flex-shrink-0" loading="lazy" />
                  )}
                  <div className="p-6 md:p-8 flex flex-col">
                    <h3 className="font-heading font-bold text-xl text-foreground mb-3">{job.title}</h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6 flex-1">{job.description}</p>
                    <div className="flex gap-3">
                      {job.job_desc_url && (
                        <Button asChild className="rounded-full font-heading font-bold bg-secondary text-foreground hover:bg-secondary/80">
                          <a href={job.job_desc_url} target="_blank" rel="noopener noreferrer">View Job Description</a>
                        </Button>
                      )}
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
        <section className="py-28 px-6 lg:px-12 bg-secondary/50">
          <div className="container mx-auto max-w-4xl">
            <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-4">Remote & Hybrid</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-12 leading-tight">Hybrid / Paid Jobs</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {hybridJobs.map((job) => (
                <div key={job.id} className="rounded-2xl border border-border bg-background p-6 text-center hover:shadow-lg transition-shadow">
                  <img
                    src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/8184018c-90f9-4412-a17e-7bdfbbdd62a9/klaw-penguin.png"
                    alt="" className="w-20 mx-auto mb-4" loading="lazy"
                  />
                  <h3 className="font-heading font-bold text-lg text-foreground mb-4">{job.title}</h3>
                  <div className="flex flex-col gap-2">
                    {job.job_desc_url && (
                      <Button asChild size="sm" className="rounded-full font-heading font-bold bg-secondary text-foreground hover:bg-secondary/80">
                        <a href={job.job_desc_url} target="_blank" rel="noopener noreferrer">Job Description</a>
                      </Button>
                    )}
                    {job.apply_url && (
                      <Button asChild size="sm" className="rounded-full font-heading font-bold bg-primary hover:bg-primary/90 text-white">
                        <a href={job.apply_url} target="_blank" rel="noopener noreferrer">Apply Here</a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Unpaid Opportunities */}
      {unpaidJobs.length > 0 && (
        <section className="py-28 px-6 lg:px-12 bg-background">
          <div className="container mx-auto max-w-4xl">
            <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-4">Volunteer</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-12 leading-tight">Hybrid / Unpaid Opportunities</h2>
            <div className="space-y-8">
              {unpaidJobs.map((job) => (
                <div key={job.id} className="rounded-2xl border border-border bg-background overflow-hidden md:flex hover:shadow-lg transition-shadow">
                  {job.image_url && (
                    <img src={job.image_url} alt={job.title} className="w-full md:w-56 h-48 md:h-auto object-cover flex-shrink-0" loading="lazy" />
                  )}
                  <div className="p-6 md:p-8 flex flex-col">
                    <h3 className="font-heading font-bold text-xl text-foreground mb-3">{job.title}</h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6 flex-1">{job.description}</p>
                    <div className="flex gap-3">
                      {job.job_desc_url && (
                        <Button asChild size="sm" className="rounded-full font-heading font-bold bg-secondary text-foreground hover:bg-secondary/80">
                          <a href={job.job_desc_url} target="_blank" rel="noopener noreferrer">View Job Description</a>
                        </Button>
                      )}
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
      )}

      <KawaiiFooter />
    </div>
  );
};

export default Careers;
