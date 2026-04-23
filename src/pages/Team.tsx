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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((m) => (
                <div key={m.id} className="rounded-2xl border border-border bg-background overflow-hidden">
                  {m.image_url && (
                    <img src={m.image_url} alt={m.name} loading="lazy" className="w-full aspect-square object-cover" />
                  )}
                  <div className="p-6">
                    <h3 className="ds-h3 mb-1">{m.name}</h3>
                    {m.role && <p className="text-sm text-primary font-heading font-bold mb-3">{m.role}</p>}
                    {m.bio && <p className="text-sm font-body text-foreground/80 mb-3 whitespace-pre-line">{m.bio}</p>}
                    {m.favorite_plush && (
                      <p className="text-sm font-body"><span className="font-bold">Favorite plush:</span> {m.favorite_plush}</p>
                    )}
                    {m.fun_facts && (
                      <p className="text-sm font-body mt-2 text-foreground/70 whitespace-pre-line">{m.fun_facts}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <KawaiiFooter />
    </div>
  );
};

export default Team;