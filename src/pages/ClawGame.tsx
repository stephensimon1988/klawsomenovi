import { useState } from 'react';
import KawaiiNav from '@/components/KawaiiNav';
import ClawGameCTAs from '@/components/ClawGameCTAs';

const GAME_URL = 'https://poki.com/en/g/lucky-claw-machine';

const ClawGame = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <KawaiiNav />
      <main className="relative flex-1 w-full bg-klawsome-navy">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 font-heading gap-3 pointer-events-none">
            <div className="w-10 h-10 rounded-full border-4 border-white/30 border-t-white animate-spin" />
            <p>Loading claw game…</p>
          </div>
        )}
        <iframe
          src={GAME_URL}
          title="Klawsome Claw Game"
          onLoad={() => setLoaded(true)}
          allow="autoplay; fullscreen; gamepad; clipboard-write"
          className="block w-full border-0"
          style={{ height: 'calc(100vh - 80px)' }}
        />
        <noscript>
          <p className="p-6 text-white">
            Game requires JavaScript. <a href={GAME_URL} className="underline">Open in new tab</a>.
          </p>
        </noscript>
        <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/60 z-10">
          Trouble loading? <a href={GAME_URL} target="_blank" rel="noreferrer" className="underline">Open game in a new tab</a>.
        </p>
      </main>
      <ClawGameCTAs />
    </div>
  );
};

export default ClawGame;