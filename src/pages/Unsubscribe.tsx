import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type Status = 'loading' | 'ready' | 'already' | 'invalid' | 'success' | 'submitting' | 'error';

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } }
        );
        const data = await res.json();
        if (!res.ok) {
          setStatus('invalid');
          return;
        }
        if (data.valid === false && data.reason === 'already_unsubscribed') {
          setStatus('already');
          return;
        }
        if (data.valid) {
          setStatus('ready');
          return;
        }
        setStatus('invalid');
      } catch {
        setStatus('invalid');
      }
    })();
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setStatus('submitting');
    const { data, error } = await supabase.functions.invoke('handle-email-unsubscribe', {
      body: { token },
    });
    if (error) {
      setStatus('error');
      return;
    }
    if (data?.success || data?.reason === 'already_unsubscribed') {
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full bg-white border-2 border-klawsome-navy rounded-3xl p-8 text-center shadow-lg">
        <h1 className="font-heading text-2xl text-klawsome-navy mb-3">Email preferences</h1>
        {status === 'loading' && <p className="font-body text-foreground/70">Checking your link…</p>}
        {status === 'invalid' && (
          <p className="font-body text-foreground/70">
            This unsubscribe link is invalid or has expired.
          </p>
        )}
        {status === 'already' && (
          <p className="font-body text-foreground/70">You're already unsubscribed. 🦊</p>
        )}
        {status === 'ready' && (
          <>
            <p className="font-body text-foreground/70 mb-6">
              Click below to confirm you'd like to unsubscribe from Klawsome emails.
            </p>
            <Button size="cta"
              onClick={handleConfirm}
              className="bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold"
            >
              Confirm Unsubscribe
            </Button>
          </>
        )}
        {status === 'submitting' && <p className="font-body text-foreground/70">Updating your preferences…</p>}
        {status === 'success' && (
          <p className="font-body text-foreground/70">You've been unsubscribed. We'll miss you! 🦊</p>
        )}
        {status === 'error' && (
          <p className="font-body text-foreground/70">
            Something went wrong. Please try again later.
          </p>
        )}
      </div>
    </main>
  );
};

export default Unsubscribe;