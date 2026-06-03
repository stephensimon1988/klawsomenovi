import { useEffect } from 'react';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';

const GAME_URL = 'https://html-classic.itch.zone/html/14041243/index.html';
const ITCH_URL = 'https://ninneko.itch.io/claw-machine-3d-2';

const ClawsomeVideoGame = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Klawsome Secret Game';

    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);

    return () => {
      document.title = prevTitle;
      document.head.removeChild(robots);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      <main className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-[1100px] text-center">
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-klawsome-navy mb-3">
            Welcome to the Secret Klawcade 🎮
          </h1>
          <p className="font-body text-foreground/70 mb-8">
            Shhh... you found our hidden claw game.
          </p>

          <div className="relative w-full rounded-2xl overflow-hidden border border-border shadow-lg bg-black" style={{ aspectRatio: '16 / 9' }}>
            <iframe
              src={GAME_URL}
              title="Klawsome Secret Claw Game"
              className="absolute inset-0 w-full h-full"
              allow="fullscreen; autoplay; gamepad; pointer-lock"
              allowFullScreen
            />
          </div>

          <p className="mt-6 text-sm text-foreground/60 font-body">
            Game won't load?{' '}
            <a
              href={ITCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-klawsome-red hover:text-klawsome-navy"
            >
              Play it on itch.io
            </a>
            .
          </p>
        </div>
      </main>
      <KawaiiFooter />
    </div>
  );
};

export default ClawsomeVideoGame;