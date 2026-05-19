import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import catImg from '@/assets/klawsome-cat-upscaled.webp';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  message: z.string().trim().min(1, 'Message is required').max(1000),
});

const FloatingContactWidget = () => {
  const [open, setOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? 'Invalid input');
      return;
    }
    setSubmitting(true);
    try {
      const id = crypto.randomUUID();
      const { error: insertError } = await supabase
        .from('contact_submissions')
        .insert([{
          id,
          name: result.data.name,
          email: result.data.email,
          message: result.data.message,
        }]);
      if (insertError) {
        console.error('Failed to save contact submission', insertError);
        toast.error("Couldn't send your message. Please try again.");
        return;
      }

      const submittedAt = new Date().toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      });
      const templateData = { ...result.data, submittedAt };
      const recipients = ['team@klawsomenovi.com', 'events@klawsomenovi.com'];
      await Promise.all(
        recipients.map((recipientEmail) =>
          supabase.functions.invoke('send-transactional-email', {
            body: {
              templateName: 'contact-form-notification',
              recipientEmail,
              idempotencyKey: `contact-${id}-${recipientEmail}`,
              templateData,
            },
          })
        )
      );

      toast.success("Thanks! We'll be in touch soon 🦊");
      setForm({ name: '', email: '', message: '' });
      setOpen(false);
    } catch (err) {
      console.error('Contact form error', err);
      toast.error("Couldn't send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 flex items-end gap-2 pointer-events-none max-w-[80vw] sm:max-w-none">
        {bubbleVisible && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.3 }}
            className="pointer-events-auto relative bg-white border-2 border-klawsome-navy rounded-2xl px-3 py-2 sm:px-6 sm:py-3 shadow-lg hover:scale-105 transition-transform font-heading font-bold text-klawsome-navy text-sm sm:text-xl leading-tight text-center"
            aria-label="Contact us"
          >
            <span className="block">We'd love to</span>
            <span className="block text-primary">hear from you!</span>
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); setBubbleVisible(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setBubbleVisible(false); } }}
              className="absolute -top-2 -left-2 bg-klawsome-navy text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-primary cursor-pointer"
              aria-label="Hide message"
            >
              <X className="w-3 h-3" />
            </span>
            {/* tail */}
            <span className="absolute right-[-8px] bottom-3 w-0 h-0 border-t-[8px] border-t-transparent border-l-[10px] border-l-white border-b-[8px] border-b-transparent" />
          </motion.button>
        )}
        <motion.button
          type="button"
          onClick={() => { setOpen(true); setBubbleVisible(true); }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
          whileHover={{ scale: 1.08, rotate: -4 }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto"
          aria-label="Open contact form"
        >
          <img
            src={catImg}
            alt="Klawsome cat mascot"
            className="h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)] w-[90px] sm:w-[150px]"
          />
        </motion.button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-white border-2 border-klawsome-navy rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-klawsome-navy text-2xl">Say hi to Klawsome! 🦊</DialogTitle>
            <DialogDescription className="font-body text-foreground/70">
              We'd love to hear from you. Drop us a note and we'll get back soon.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label htmlFor="fcw-name" className="font-heading text-klawsome-navy text-xs uppercase tracking-wider">Name</Label>
              <Input
                id="fcw-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={100}
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fcw-email" className="font-heading text-klawsome-navy text-xs uppercase tracking-wider">Email</Label>
              <Input
                id="fcw-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fcw-message" className="font-heading text-klawsome-navy text-xs uppercase tracking-wider">Message</Label>
              <Textarea
                id="fcw-message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={1000}
                rows={5}
                required
                className="rounded-xl"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold rounded-full py-6 text-base"
            >
              {submitting ? 'Sending…' : 'Send Message'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingContactWidget;