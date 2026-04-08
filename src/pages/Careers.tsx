import { Button } from '@/components/ui/button';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';

const inStoreJobs = [
  {
    title: 'Assistant Store Manager',
    image: 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/f02582ee-95a6-4fb9-bf08-3ac93e6b9861/PXL_20250822_201918587.jpg',
    description: 'The Assistant Manager (AM) is responsible for the successful day-to-day performance of the store under the guidance of the General Manager (GM), with accountability for performing/training store associates on operation duties, delivering exceptional customer service, achieving store financial targets, and performing all GM responsibilities in the absence of the GM.',
    jobDescUrl: 'https://www.klawsomenovi.com/s/Assistant-Store-Manager-Klawsome-5te9.pdf',
    applyUrl: 'https://forms.gle/m2XQHFELi3cmVGCw6',
  },
  {
    title: 'Store Associate',
    image: 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/057fb62e-a01f-49c9-a963-255ce0091234/KlawsomeCrewSelfieWall.jpg',
    description: 'The store associate AKA "Fun Facilitator" at Klawsome! creates a lively, welcoming environment for customers. This role focuses on delivering excellent customer service, ensuring smooth game operations, plushie restocking, keeping the facility clean and organized. Enthusiasm and a passion for customer interaction are essential.',
    jobDescUrl: 'https://www.klawsomenovi.com/s/Fun-Facilitator-Store-Associate-Klawsome.pdf',
    applyUrl: 'https://forms.gle/m2XQHFELi3cmVGCw6',
  },
];

const hybridJobs = [
  {
    title: 'General Manager',
    jobDescUrl: 'https://docs.google.com/document/d/1irhqnFe2z0909RRO5Tzf5BF7dSBlWDXqhqFXCiFWiVg/edit?usp=sharing',
  },
  {
    title: 'Purchasing Specialist',
    jobDescUrl: 'https://docs.google.com/document/d/1P3KExCIMFUp6RDz6hsGqHzASvwDZQB-hasbVLZKaLO0/edit?usp=sharing',
  },
  {
    title: 'Events Assistant Manager',
    jobDescUrl: 'https://drive.google.com/file/d/1zs_LLaoP9-HKMVvFbSSADklTxXrWLiyy/view?usp=sharing',
  },
];

const unpaidJobs = [
  {
    title: 'Internship',
    description: 'Involves mentoring within a specific field of our expertise (e.g. business, journalism, education). Projects fit your background/experience. In-person and remote working opportunities with part-time hours. Lasts two to three months. Ends with a letter of recommendation.',
    jobDescUrl: 'https://drive.google.com/file/d/1Z4OJY0PJtaH8ejFIUIJPkQtNS1BwhD_o/view?usp=sharing',
    image: 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/d00baf82-bf76-4d17-a38e-b6ca3ab39d6f/PXL_20250610_212808314.MP.jpg',
  },
  {
    title: 'Corporate Development Fellow (Founder\'s Office)',
    description: 'Responsible for collecting and analyzing data such as financial and market research. This role helps with expanding our franchise beyond a single location by finding ideal areas for expansion and helping create a story that convinces business owners to partner with Klawsome!',
    jobDescUrl: 'https://www.klawsomenovi.com/s/Corporate-Development-Fellow-Founders-Office.pdf',
    image: 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/466192b1-eb36-4dcf-82c7-8a6564bf0ce1/klaw-win.png',
  },
];

const Careers = () => {
  return (
    <div className="min-h-screen bg-klawsome-navy">
      <KawaiiNav />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 text-center">
        <img
          src="https://images.squarespace-cdn.com/content/679927505e618d391ae386e6/8c57b6f1-0c08-4d2f-bb04-e54051ae7f0b/Klawsome_Fox__CUT.png?content-type=image%2Fpng"
          alt="Klawsome Fox"
          className="w-32 mx-auto mb-6"
        />
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">
          <span className="kawaii-text-gradient">Careers</span>
        </h1>
        <p className="text-white/60 font-body text-lg max-w-xl mx-auto">
          Join the Klawsome team and help create a fun, welcoming experience for everyone!
        </p>
      </section>

      {/* In-Store Jobs */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-10 text-center">In-Store Positions</h2>
          <div className="space-y-10">
            {inStoreJobs.map((job) => (
              <div key={job.title} className="bg-white/10 backdrop-blur-sm rounded-kawaii border border-white/20 overflow-hidden md:flex">
                <img
                  src={job.image}
                  alt={job.title}
                  className="w-full md:w-72 h-56 md:h-auto object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div className="p-6 md:p-8 flex flex-col">
                  <h3 className="font-heading font-bold text-xl text-white mb-3">{job.title}</h3>
                  <p className="text-white/70 font-body text-sm leading-relaxed mb-6 flex-1">{job.description}</p>
                  <div className="flex gap-3">
                    <Button asChild className="rounded-full font-heading font-bold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90">
                      <a href={job.jobDescUrl} target="_blank" rel="noopener noreferrer">View Job Description</a>
                    </Button>
                    <Button asChild className="rounded-full font-heading font-bold bg-primary hover:bg-primary/90 text-white">
                      <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">Apply Here</a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hybrid / Paid Jobs */}
      <section className="py-16 px-4 bg-primary">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-10 text-center">Hybrid / Paid Jobs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {hybridJobs.map((job) => (
              <div key={job.title} className="bg-white/15 rounded-kawaii border border-white/20 p-6 text-center">
                <img
                  src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/8184018c-90f9-4412-a17e-7bdfbbdd62a9/klaw-penguin.png"
                  alt=""
                  className="w-20 mx-auto mb-4"
                  loading="lazy"
                />
                <h3 className="font-heading font-bold text-lg text-white mb-4">{job.title}</h3>
                <div className="flex flex-col gap-2">
                  <Button asChild size="sm" className="rounded-full font-heading font-bold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90">
                    <a href={job.jobDescUrl} target="_blank" rel="noopener noreferrer">Job Description</a>
                  </Button>
                  <Button asChild size="sm" className="rounded-full font-heading font-bold bg-white/20 text-white hover:bg-white/30">
                    <a href="https://forms.gle/m2XQHFELi3cmVGCw6" target="_blank" rel="noopener noreferrer">Apply Here</a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hybrid / Unpaid Jobs */}
      <section className="py-16 px-4 bg-klawsome-navy">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-10 text-center">Hybrid / Unpaid Opportunities</h2>
          <div className="space-y-8">
            {unpaidJobs.map((job) => (
              <div key={job.title} className="bg-white/10 backdrop-blur-sm rounded-kawaii border border-white/20 overflow-hidden md:flex">
                <img
                  src={job.image}
                  alt={job.title}
                  className="w-full md:w-56 h-48 md:h-auto object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div className="p-6 md:p-8 flex flex-col">
                  <h3 className="font-heading font-bold text-xl text-white mb-3">{job.title}</h3>
                  <p className="text-white/70 font-body text-sm leading-relaxed mb-6 flex-1">{job.description}</p>
                  <div className="flex gap-3">
                    <Button asChild size="sm" className="rounded-full font-heading font-bold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90">
                      <a href={job.jobDescUrl} target="_blank" rel="noopener noreferrer">View Job Description</a>
                    </Button>
                    <Button asChild size="sm" className="rounded-full font-heading font-bold bg-primary hover:bg-primary/90 text-white">
                      <a href="https://forms.gle/m2XQHFELi3cmVGCw6" target="_blank" rel="noopener noreferrer">Apply Here</a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <KawaiiFooter />
    </div>
  );
};

export default Careers;
