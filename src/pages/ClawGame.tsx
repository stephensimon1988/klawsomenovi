import KawaiiNav from '@/components/KawaiiNav';
import ClawGameCTAs from '@/components/ClawGameCTAs';
import { Button } from '@/components/ui/button';
import { ExternalLink, Gamepad2, Sparkles } from 'lucide-react';

const GAME_URL = 'https://poki.com/en/g/lucky-claw-machine';

const ClawGame = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <KawaiiNav />
      <main className="flex-1 w-full flex items-center justify-center px-4 py-12 bg-gradient-to-br from-kawaii-pink/30 via-kawaii-lavender/30 to-kawaii-sky/30">
        <div className="max-w-2xl w-full bg-card rounded-3xl shadow-xl border-4 border-kawaii-pink p-8 md:p-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kawaii-pink/40 text-foreground font-heading text-sm">
            <Sparkles className="w-4 h-4" />
            Play & Win
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
            🎮 Klawsome Claw Game
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Click below to launch our claw game in a new tab. Snag a plushie and come back for your reward!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              asChild
              size="lg"
              className="bg-kawaii-pink hover:bg-kawaii-pink/90 text-foreground font-heading text-lg rounded-full px-8 py-6 shadow-lg"
            >
              <a href={GAME_URL} target="_blank" rel="noreferrer">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Play the Claw Game
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground pt-4">
            Opens in a new tab. Come back here for your 5% off code 💖
          </p>
        </div>
      </main>
      <ClawGameCTAs />
    </div>
  );
};

export default ClawGame;