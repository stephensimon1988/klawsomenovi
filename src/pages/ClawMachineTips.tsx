import { Check, X, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import KawaiiDivider from '@/components/KawaiiDivider';
import PageHero from '@/components/PageHero';
import { openBookingModal } from '@/components/BookNowDialog';
import heroImage from '@/assets/rental-family-playing.webp';

const ClawMachineTips = () => {
  const bestPicks = [
    'Near the chute',
    'Sitting loosely',
    'Not tightly packed',
    'Lying sideways',
  ];
  const avoidPicks = ['Buried plush', 'Tight clusters'];

  const pushTips = [
    'Push plush toward the chute',
    'Use the claw edges to nudge',
    'Try repositioning moves',
    'Make progress on every grab',
  ];

  const watchTips = [
    'Loose plush that just shifted',
    'Recent wins on a machine',
    'Patterns in claw strength',
  ];

  const proTips = [
    'Go for plush near the prize door',
    'Aim slightly behind the plush',
    'Try repositioning before grabbing',
    'Stay patient — skill improves wins',
  ];

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />

      <PageHero
        eyebrow="Klaw School"
        title="Tips to Win Claw Machines"
        subtitle="The claw doesn't grab the same strength every time — but smart positioning greatly increases your chances of winning."
        imageUrl={heroImage}
        jumpLinks={[
          { label: 'Basics', id: 'tips-basics' },
          { label: 'Right Plush', id: 'tips-targets' },
          { label: 'Push It', id: 'tips-push' },
          { label: 'Watch First', id: 'tips-watch' },
          { label: 'Beginner', id: 'tips-beginner' },
          { label: 'Pro Tips', id: 'tips-pro' },
        ]}
      />

      {/* Section 1 — Basics */}
      <section id="tips-basics" className="section-y section-x">
        <div className="ds-container-narrow">
          <p className="ds-eyebrow">Strategy Basics</p>
          <h2 className="ds-h2 ds-stroke ds-stroke--red uppercase mb-10">It's Skill, Not Just Luck</h2>
          <div className="space-y-6 ds-lead">
            <p>
              The most common mistake is aiming for the top of a plush — the claw needs something
              to grip. Look for toys that are stacked on top of others or sitting "alone," so the
              claws can wrap around the prize.
            </p>
            <p>
              Move the claw directly over a <strong>gap between toys</strong>, not the toy itself —
              that gap gives the prongs something to close around. Once you've found your spot,
              commit to the drop instead of second-guessing at the last second.
            </p>
            <p>
              Go for <strong>smaller prizes</strong>. They're lighter and easier to carry, and a
              win is a win. Plays <strong>near the chute</strong> are almost always the better
              choice. And don't forget <strong>depth</strong> — look from the side of the machine
              (or a few steps away) to make sure your claw is far enough back.
            </p>
          </div>
        </div>
      </section>

      <KawaiiDivider variant="wave" from="white" to="secondary-soft" stroke="baby-pink" height={90} />

      {/* Section 2 — Aim for the Right Plush */}
      <section id="tips-targets" className="section-y section-x bg-secondary/40">
        <div className="ds-container">
          <div className="text-center mb-12">
            <p className="ds-eyebrow">Aim Smart</p>
            <h2 className="ds-h2 ds-stroke ds-stroke--yellow uppercase">Choose the Right Plush</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-kawaii p-8 shadow-sm border border-foreground/5">
              <h3 className="font-heading font-bold text-2xl mb-6 text-foreground">Best to Grab</h3>
              <ul className="space-y-4">
                {bestPicks.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </span>
                    <span className="font-body text-lg text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-kawaii p-8 shadow-sm border border-foreground/5">
              <h3 className="font-heading font-bold text-2xl mb-6 text-foreground">Avoid</h3>
              <ul className="space-y-4">
                {avoidPicks.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-4 h-4 text-foreground/60" strokeWidth={3} />
                    </span>
                    <span className="font-body text-lg text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <KawaiiDivider variant="scallop" from="secondary-soft" to="white" stroke="baby-blue" height={90} />

      {/* Section 3 — Push, Don't Just Grab */}
      <section id="tips-push" className="section-y section-x">
        <div className="ds-container-narrow">
          <p className="ds-eyebrow">Technique</p>
          <h2 className="ds-h2 ds-stroke ds-stroke--red uppercase mb-8">Push — Don't Just Grab</h2>
          <p className="ds-lead mb-8">
            Even when the claw can't lift a plush outright, you can still make progress. Every
            grab is a chance to nudge your target closer to the chute.
          </p>
          <ul className="space-y-3">
            {pushTips.map((tip) => (
              <li key={tip} className="flex items-start gap-3 font-body text-lg text-foreground">
                <span className="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <KawaiiDivider variant="cloud" from="white" to="secondary-soft" stroke="baby-pink" height={90} />

      {/* Section 4 — Watch Before You Play */}
      <section id="tips-watch" className="section-y section-x bg-secondary/40">
        <div className="ds-container-narrow">
          <p className="ds-eyebrow">Observe</p>
          <h2 className="ds-h2 ds-stroke ds-stroke--yellow uppercase mb-8">Watch Before You Play</h2>
          <p className="ds-lead mb-8">
            Spend a minute watching other players before you drop a token. You'll learn a lot from
            the machine without spending a thing.
          </p>
          <ul className="space-y-3">
            {watchTips.map((tip) => (
              <li key={tip} className="flex items-start gap-3 font-body text-lg text-foreground">
                <span className="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <KawaiiDivider variant="bumps" from="secondary-soft" to="white" stroke="baby-blue" height={90} />

      {/* Section 5 — Beginner Machines */}
      <section id="tips-beginner" className="section-y section-x">
        <div className="ds-container-narrow text-center">
          <p className="ds-eyebrow">Start Here</p>
          <h2 className="ds-h2 ds-stroke ds-stroke--red uppercase mb-8">Begin With Beginner Machines</h2>
          <p className="ds-lead mb-8">
            New to the claw life? At Klawsome, look for our <strong>Play Till You Win</strong>{' '}
            machines — they're the friendliest way to learn the ropes and walk out with a plush.
          </p>
          <Button asChild size="hero">
            <a href="/store">See Our Machines</a>
          </Button>
        </div>
      </section>

      <KawaiiDivider variant="petals" from="white" to="baby-pink" stroke="white" height={90} />

      {/* Section 6 — Pro Tips (boxed) */}
      <section id="tips-pro" className="section-y section-x bg-[hsl(var(--klawsome-baby-pink))]">
        <div className="ds-container-narrow">
          <div className="text-center mb-10">
            <p className="ds-eyebrow">Pro Tips</p>
            <h2 className="ds-h2 ds-stroke ds-stroke--yellow uppercase">Level Up Your Game</h2>
          </div>

          <div className="bg-white rounded-kawaii p-8 md:p-12 shadow-lg border-2 border-primary/20">
            <ul className="space-y-5">
              {proTips.map((tip) => (
                <li key={tip} className="flex items-start gap-4">
                  <Flame className="w-6 h-6 text-primary flex-shrink-0 mt-1" strokeWidth={2.5} />
                  <span className="font-body text-lg md:text-xl text-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center mt-10">
            <Button onClick={openBookingModal} size="hero" className="bg-primary text-white hover:bg-primary/90">
              Come Try Your Skills
            </Button>
          </div>
        </div>
      </section>

      <KawaiiFooter prevColor={'baby-pink' as any} />
    </div>
  );
};

export default ClawMachineTips;