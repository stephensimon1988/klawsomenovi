import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import { useCmsSingle, type HomepageContent } from '@/hooks/useCmsContent';
import PageHero from '@/components/PageHero';

const OurStory = () => {
  const { data: content } = useCmsSingle<HomepageContent>('homepage_content');

  const title = content?.story_title || 'Our Story';
  const body = content?.story_body || '';
  const image = content?.story_image_url || 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg';

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />

      <PageHero
        eyebrow="About Us"
        title={title}
        imageUrl={image}
      />

      {/* Intro */}
      <section className="section-y section-x">
        <div className="ds-container-narrow">
          <p className="ds-lead text-foreground text-2xl md:text-3xl">
            {body}
          </p>
        </div>
      </section>

      {/* Where it all began */}
      <section className="section-y section-x bg-secondary/40">
        <div className="ds-container-narrow">
          <p className="ds-eyebrow">Origin</p>
          <h2 className="ds-h2 uppercase mb-10">Where it all began.</h2>
          <div className="space-y-6 ds-lead">
            <p>The idea for Klawsome was sparked by the owners' children's love for claw machines during a visit to their Lola in Las Vegas. Owners Agnes and Michal saw the joy and excitement it brought them, and wanted to share that same experience with the local community.</p>
            <p>While visiting Las Vegas in 2023, the Filipowskis stumbled upon the first claw machine arcade to open in the area, in a strip mall near Agnes' mother's home. They were hooked after winning a bag full of Sanrio and other kawaii-style plushies. Since then, they've sought out clawcades in Vegas, Toronto, and other cities across the U.S.</p>
          </div>
        </div>
      </section>

      {/* Family & Culture */}
      <section className="section-y section-x">
        <div className="ds-container-narrow">
          <p className="ds-eyebrow">Family & Culture</p>
          <h2 className="ds-h2 uppercase mb-10">Bringing our family into the brand.</h2>
          <div className="space-y-6 ds-lead">
            <p>Michal and Agnes lived in Korea for three years, where their older two daughters were born. They traveled throughout Southeast Asia and continue to seek out clawcades within Asian neighborhoods. Their children have been integral every step of the way — from designing the logo (each animal represents a child's personality) to picking the name (spelling with a K to mimic the Filipino alphabet) to selecting the plushies they know their friends will love.</p>
            <p>As a Filipino-American woman, Agnes is passionate about sharing a piece of Asian culture with the community — notice the elements of the Filipino flag woven into the logo. Klawsome is more than just an arcade; it's a place for <em>kapwa</em> — connection and community in Tagalog — where couples, friends, and families create lasting memories.</p>
            <p>Everyone comes away as a winner.</p>
          </div>
        </div>
      </section>

      <KawaiiFooter />
    </div>
  );
};

export default OurStory;
