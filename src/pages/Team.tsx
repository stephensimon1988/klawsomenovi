import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import PageHero from '@/components/PageHero';
import { usePageHero, useCmsTable } from '@/hooks/useCmsContent';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  favorite_plush: string;
  fun_facts: string;
  image_url: string;
  sort_order: number;
}

const Team = () => {
  const { data: hero } = usePageHero('team');
  const { data: members } = useCmsTable<TeamMember>('team_members');

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      <PageHero
        eyebrow={hero?.eyebrow || 'Team'}
        title={hero?.title || 'Meet the Team'}
        subtitle={hero?.subtitle}
        imageUrl={hero?.image_url || ''}
      />
      <section className="section-y section-x">
        <div className="ds-container">
          {(!members || members.length === 0) ? (
            <p className="text-center text-muted-foreground font-body">
              Team bios coming soon. Add team members in the admin dashboard.
            </p>
          ) : (
            <>
              <div className="max-w-2xl mb-16">
                <p className="ds-eyebrow">The Crew</p>
                <h2 className="ds-h2">Meet the humans behind the plushies</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {members.map((m) => (
                  <div key={m.id} className="group flex flex-col">
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-secondary/40 mb-6">
                      {m.image_url ? (
                        <img
                          src={m.image_url}
                          alt={m.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                    {m.role && <p className="ds-eyebrow mb-2">{m.role}</p>}
                    <h3 className="ds-h3 mb-3">{m.name}</h3>
                    {m.bio && (
                      <p className="ds-body mb-3 whitespace-pre-line">{m.bio}</p>
                    )}
                    {m.favorite_plush && (
                      <p className="text-sm font-body text-foreground/70">
                        <span className="font-bold">Favorite plush:</span> {m.favorite_plush}
                      </p>
                    )}
                    {m.fun_facts && (
                      <p className="text-sm font-body mt-2 text-foreground/60 whitespace-pre-line">
                        {m.fun_facts}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <KawaiiFooter />
    </div>
  );
};

export default Team;