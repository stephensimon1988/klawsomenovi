import { useState, type ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { JOB_DESCRIPTIONS } from '@/data/jobDescriptions';
import DOMPurify from 'isomorphic-dompurify';

interface Props {
  title: string;
  /** Optional fallback URL (e.g. PDF) shown if no structured content exists. */
  url?: string;
  /** Optional short blurb from the listing, used when no structured content exists. */
  fallbackDescription?: string;
  applyUrl?: string;
  trigger: ReactNode;
}

const JobDescriptionDialog = ({ title, url, fallbackDescription, applyUrl, trigger }: Props) => {
  const [open, setOpen] = useState(false);
  const detail = JOB_DESCRIPTIONS[title];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="p-0 gap-0 bg-white">
        <DialogHeader className="px-6 pt-6 pb-3 border-b shrink-0">
          <DialogTitle className="font-heading text-klawsome-navy text-2xl pr-8">{title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 text-klawsome-navy">
          {detail ? (
            <div className="space-y-6 font-body">
              {detail.meta.length > 0 && (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 bg-klawsome-navy/5 rounded-2xl p-4 text-sm">
                  {detail.meta.map((m) => (
                    <div key={m.label} className="flex flex-col">
                      <dt className="font-heading font-bold text-klawsome-navy/70 text-xs uppercase tracking-wide">{m.label}</dt>
                      <dd className="text-klawsome-navy">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <p className="leading-relaxed">{detail.summary}</p>

              {detail.sections.map((s) => (
                <section key={s.heading}>
                  <h3 className="font-heading font-bold text-lg mb-2">{s.heading}</h3>
                  {s.body && <p className="leading-relaxed">{s.body}</p>}
                  {s.items && (
                    <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
                      {s.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          ) : (
            <p 
              className="font-body leading-relaxed"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fallbackDescription || 'Full job description available on request.') }}
            />
          )}
        </div>

        <div className="px-6 py-3 border-t flex flex-wrap justify-end gap-2 shrink-0">
          {url && (
            <Button asChild variant="outline" size="sm" className="rounded-full font-heading">
              <a href={url} target="_blank" rel="noopener noreferrer">Open PDF</a>
            </Button>
          )}
          {applyUrl && (
            <Button asChild size="sm" className="rounded-full font-heading font-bold bg-primary hover:bg-primary/90 text-white">
              <a href={applyUrl}>Apply Here</a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDescriptionDialog;