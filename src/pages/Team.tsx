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
              <div className="flex items-baseline gap-6 mb-16">
                <span className="font-heading font-bold text-2xl text-primary tabular-nums">
                  {String(members.length).padStart(2, '0')}
                </span>
                <span className="flex-1 h-px bg-foreground/15" />
                <p className="ds-eyebrow !mb-0">The Crew</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {members.map((m, idx) => (
                  <div key={m.id} className="group flex flex-col">
                    <div className="relative overflow-hidden rounded-3xl bg-secondary/40 mb-6">
                      {m.image_url ? (
                        <img
                          src={m.image_url}
                          alt={m.name}
                          loading="lazy"
                          className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full aspect-[4/5]" />
                      )}
                      <span className="absolute top-4 left-4 font-heading font-bold tabular-nums text-white text-sm bg-foreground/70 backdrop-blur rounded-full px-3 py-1">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold uppercase text-3xl leading-[1.05] mb-1">
                      {m.name}
                    </h3>
                    {m.role && (
                      <p className="text-xs text-primary font-heading font-bold uppercase tracking-[0.2em] mb-4">
                        {m.role}
                      </p>
                    )}
                    {m.bio && (
                      <p className="text-base font-body text-foreground/75 mb-3 whitespace-pre-line leading-relaxed">
                        {m.bio}
                      </p>
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