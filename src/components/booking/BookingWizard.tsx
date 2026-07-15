import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Loader2, ExternalLink, Check, Phone } from 'lucide-react';
import { toast } from 'sonner';
import {
  ADDONS,
  addonsFor,
  DELIVERY_SURCHARGE_VARIANT,
  FREE_DELIVERY_MILES,
  MOBILE_PACKAGES,
  PATHWAYS,
  PATHWAY_BASE_CENTS,
  RENTAL_PACKAGES,
  type Pathway,
  type PackageOption,
  type AddOnDef,
} from '@/lib/booking/catalog';
import { getMilesForZip, type ZipLookup } from '@/lib/booking/zipMiles';
import { createBookingCart, deliveryLine, generateBookingRef, type CartLine } from '@/lib/booking/cart';
import { generateSlots, isDateAvailable, useAvailability } from '@/hooks/useAvailability';
import { useCmsSingle, useCmsTable, type SiteSettings, type StoreHour } from '@/hooks/useCmsContent';

export type OpenBookingDetail = { pathway?: Pathway };

export const openBookingModal = (pathway?: Pathway) => {
  window.dispatchEvent(new CustomEvent<OpenBookingDetail>('open-booking', { detail: { pathway } }));
};

type Step = 'pathway' | 'package' | 'datetime' | 'addons' | 'delivery' | 'contact' | 'review' | 'done';

interface State {
  pathway: Pathway | null;
  packageId: string | null;
  date: Date | null;
  time: string | null;
  addons: Record<string, { qty: number; character?: string }>;
  zip: string;
  contact: {
    name: string; email: string; phone: string; partySize: string;
    celebrantName: string; celebrantAge: string; favorites: string; notes: string;
  };
  checkoutUrl: string | null;
  bookingRef: string | null;
}

const emptyState = (): State => ({
  pathway: null,
  packageId: null,
  date: null,
  time: null,
  addons: {},
  zip: '',
  contact: { name: '', email: '', phone: '', partySize: '', celebrantName: '', celebrantAge: '', favorites: '', notes: '' },
  checkoutUrl: null,
  bookingRef: null,
});

function packagesFor(pathway: Pathway | null): PackageOption[] {
  if (pathway === 'rental') return RENTAL_PACKAGES;
  if (pathway === 'mobile') return MOBILE_PACKAGES;
  return [];
}

function BookingWizardDialog() {
  const [open, setOpen] = useState(false);
  const [initialPathway, setInitialPathway] = useState<Pathway | null>(null);
  const [state, setState] = useState<State>(emptyState);
  const [step, setStep] = useState<Step>('pathway');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<OpenBookingDetail>).detail || {};
      const s = emptyState();
      if (detail.pathway) {
        s.pathway = detail.pathway;
        setInitialPathway(detail.pathway);
      } else {
        setInitialPathway(null);
      }
      setState(s);
      setStep(detail.pathway ? nextAfterPathway(detail.pathway) : 'pathway');
      setOpen(true);
    };
    window.addEventListener('open-booking', handler);
    return () => window.removeEventListener('open-booking', handler);
  }, []);

  const pathway = state.pathway;
  const { availability, blackouts } = useAvailability(pathway);
  const pkgs = packagesFor(pathway);

  const selectedPackage = useMemo(() => pkgs.find((p) => p.id === state.packageId) || null, [pkgs, state.packageId]);

  const needsDelivery = pathway === 'rental' || pathway === 'mobile';
  const [zipInfo, setZipInfo] = useState<ZipLookup | null>(null);
  const [zipResolving, setZipResolving] = useState(false);
  useEffect(() => {
    if (!needsDelivery) { setZipInfo(null); return; }
    const clean = state.zip.trim();
    if (clean.length < 5) { setZipInfo(null); return; }
    let cancelled = false;
    setZipResolving(true);
    getMilesForZip(clean).then((r) => {
      if (cancelled) return;
      setZipInfo(r);
      setZipResolving(false);
    });
    return () => { cancelled = true; };
  }, [state.zip, needsDelivery]);

  const deliveryCents = zipInfo?.known
    ? Math.max(0, Math.ceil(zipInfo.miles - FREE_DELIVERY_MILES)) * 300
    : 0;
  const zipBlocked = needsDelivery && state.zip.trim().length === 5 && zipInfo && !zipInfo.known;

  const availableAddons = pathway ? addonsFor(pathway) : [];

  const totalCents = useMemo(() => {
    let sum = 0;
    if (pathway && pathway !== 'rental' && pathway !== 'mobile') sum += PATHWAY_BASE_CENTS[pathway];
    if (selectedPackage) sum += selectedPackage.priceCents;
    for (const [id, sel] of Object.entries(state.addons)) {
      const def = ADDONS.find((a) => a.id === id);
      if (def) sum += def.priceCents * (sel.qty || 0);
    }
    sum += deliveryCents;
    return sum;
  }, [pathway, selectedPackage, state.addons, deliveryCents]);

  const canNext = validateStep(step, state, selectedPackage, availability, blackouts, zipInfo);

  const goNext = () => {
    const order = stepOrder(pathway);
    const idx = order.indexOf(step);
    if (idx < 0 || idx >= order.length - 1) return;
    setStep(order[idx + 1]);
  };
  const goBack = () => {
    const order = stepOrder(pathway);
    const idx = order.indexOf(step);
    if (idx <= 0) return;
    // If pathway was pre-set from a page CTA, keep them out of pathway picker
    if (idx === 1 && initialPathway) return;
    setStep(order[idx - 1]);
  };

  const submit = async () => {
    if (!pathway) return;
    setSubmitting(true);
    try {
      const ref = generateBookingRef();
      const startAt = combineDateTime(state.date!, state.time!);
      const lines: CartLine[] = [];
      const lineAttrs = [
        { key: 'booking_ref', value: ref },
        { key: 'start_at', value: startAt.toISOString() },
      ];
      // main line
      if (pathway === 'private' || pathway === 'semi') {
        const p = PATHWAYS.find((x) => x.id === pathway)!;
        lines.push({ merchandiseId: p.variantId, quantity: 1, attributes: lineAttrs });
      } else if (selectedPackage) {
        lines.push({ merchandiseId: selectedPackage.variantId, quantity: 1, attributes: lineAttrs });
      }
      // add-ons
      for (const [id, sel] of Object.entries(state.addons)) {
        if (!sel.qty) continue;
        const def = ADDONS.find((a) => a.id === id);
        if (!def) continue;
        const variantId = sel.character && def.variantsByCharacter ? def.variantsByCharacter[sel.character] : def.variantId;
        const attrs = [...lineAttrs];
        if (sel.character) attrs.push({ key: 'character', value: sel.character });
        lines.push({ merchandiseId: variantId, quantity: sel.qty, attributes: attrs });
      }
      // delivery
      if (pathway === 'rental' || pathway === 'mobile') {
        const dl = deliveryLine(zipInfo?.known ? zipInfo.miles : 0);
        if (dl) lines.push({ ...dl, attributes: [{ key: 'booking_ref', value: ref }, { key: 'zip', value: state.zip }] });
      }
      const attributes = [
        { key: 'booking_ref', value: ref },
        { key: 'event_type', value: pathway },
        { key: 'start_at', value: startAt.toISOString() },
        { key: 'party_size', value: state.contact.partySize },
        { key: 'celebrant_name', value: state.contact.celebrantName },
        { key: 'celebrant_age', value: state.contact.celebrantAge },
        { key: 'favorites', value: state.contact.favorites },
        { key: 'notes', value: state.contact.notes },
        { key: 'contact_name', value: state.contact.name },
        { key: 'contact_email', value: state.contact.email },
        { key: 'contact_phone', value: state.contact.phone },
        { key: 'zip', value: state.zip },
        { key: 'miles', value: zipInfo?.known ? String(zipInfo.miles) : '' },
      ].filter((a) => a.value && a.value.length > 0);

      const result = await createBookingCart({
        lines,
        attributes,
        buyerIdentity: { email: state.contact.email, phone: state.contact.phone },
      });
      if ('error' in result) {
        toast.error('Could not start checkout', { description: result.error });
        return;
      }
      // Persist a pending booking record (best-effort — RLS blocks anon writes,
      // so we skip this from the browser; the Shopify order webhook will
      // create the confirmed record post-payment.)
      setState((s) => ({ ...s, checkoutUrl: result.checkoutUrl, bookingRef: ref }));
      setStep('done');
      window.open(result.checkoutUrl, '_blank');
    } catch (e) {
      console.error(e);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl w-[95vw] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-3 border-b">
          <DialogTitle className="font-heading">Book with Klawsome</DialogTitle>
          <StepBar step={step} pathway={pathway} />
        </DialogHeader>
        <div className="px-6 py-6 max-h-[75vh] overflow-y-auto">
          {step === 'pathway' && (
            <PathwayStep onPick={(p) => { setState((s) => ({ ...s, pathway: p })); setStep(nextAfterPathway(p)); }} />
          )}
          {step === 'package' && pathway && (
            <PackageStep pathway={pathway} packages={pkgs} selectedId={state.packageId} onSelect={(id) => setState((s) => ({ ...s, packageId: id }))} />
          )}
          {step === 'datetime' && pathway && (
            <DateTimeStep
              date={state.date}
              time={state.time}
              onChange={(date, time) => setState((s) => ({ ...s, date, time }))}
              hours={availability?.hours}
              blackouts={blackouts}
              slotMinutes={availability?.slot_minutes ?? 60}
              leadHours={availability?.lead_time_hours ?? 48}
            />
          )}
          {step === 'addons' && pathway && (
            <AddonsStep addons={availableAddons} selected={state.addons} onChange={(a) => setState((s) => ({ ...s, addons: a }))} />
          )}
          {step === 'delivery' && (
            <DeliveryStep zip={state.zip} onZipChange={(z) => setState((s) => ({ ...s, zip: z }))} zipInfo={zipInfo} resolving={zipResolving} />
          )}
          {step === 'contact' && (
            <ContactStep contact={state.contact} pathway={pathway!} onChange={(c) => setState((s) => ({ ...s, contact: c }))} />
          )}
          {step === 'review' && (
            <ReviewStep
              pathway={pathway!}
              selectedPackage={selectedPackage}
              state={state}
              zipInfo={zipInfo}
              deliveryCents={deliveryCents}
              totalCents={totalCents}
            />
          )}
          {step === 'done' && (
            <DoneStep bookingRef={state.bookingRef} checkoutUrl={state.checkoutUrl} />
          )}
        </div>
        {step !== 'done' && step !== 'pathway' && (
          <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/30">
            <Button variant="ghost" onClick={goBack} disabled={submitting || (step === stepOrder(pathway)[1] && !!initialPathway)}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <div className="text-sm text-muted-foreground hidden sm:block">
              {totalCents > 0 && `Estimated total: $${(totalCents / 100).toFixed(2)}`}
              {zipBlocked && <span className="ml-3 text-destructive">We'll quote delivery for this ZIP.</span>}
            </div>
            {step === 'review' ? (
              <Button onClick={submit} disabled={submitting} className="bg-primary text-primary-foreground">
                {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing…</> : <>Continue to Payment <ChevronRight className="ml-1 h-4 w-4" /></>}
              </Button>
            ) : (
              <Button onClick={goNext} disabled={!canNext} className="bg-primary text-primary-foreground">
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ---------- helpers ---------- */

function stepOrder(pathway: Pathway | null): Step[] {
  const needsPackage = pathway === 'rental' || pathway === 'mobile';
  const needsDelivery = pathway === 'rental' || pathway === 'mobile';
  const base: Step[] = ['pathway'];
  if (needsPackage) base.push('package');
  base.push('datetime', 'addons');
  if (needsDelivery) base.push('delivery');
  base.push('contact', 'review', 'done');
  return base;
}

function nextAfterPathway(p: Pathway): Step {
  return p === 'rental' || p === 'mobile' ? 'package' : 'datetime';
}

function combineDateTime(date: Date, time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

function validateStep(
  step: Step, s: State, pkg: PackageOption | null,
  availability: { slot_minutes: number; lead_time_hours: number } | null | undefined,
  _blackouts: Set<string> | undefined,
  zipInfo: ZipLookup | null,
): boolean {
  switch (step as string) {
    case 'pathway': return !!s.pathway;
    case 'package': return !!pkg;
    case 'datetime': return !!s.date && !!s.time;
    case 'addons': return true;
    case 'delivery': return !!zipInfo?.known;
    case 'contact': {
      const c = s.contact;
      return !!c.name.trim() && /.+@.+\..+/.test(c.email) && !!c.phone.trim();
    }
    case 'review': return true;
    default: return true;
  }
}

/* ---------- steps ---------- */

function StepBar({ step, pathway }: { step: Step; pathway: Pathway | null }) {
  const order = stepOrder(pathway).filter((s) => s !== 'done');
  const idx = Math.max(0, order.indexOf(step as Exclude<Step, 'done'>));
  return (
    <div className="flex gap-1 mt-2">
      {order.map((s, i) => (
        <div key={s} className={cn('h-1 flex-1 rounded-full', i <= idx ? 'bg-primary' : 'bg-muted')} />
      ))}
    </div>
  );
}

function PathwayStep({ onPick }: { onPick: (p: Pathway) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground font-body mb-2">What are you booking?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PATHWAYS.map((p) => (
          <button
            key={p.id}
            onClick={() => onPick(p.id)}
            className="text-left rounded-2xl border border-border bg-card p-5 hover:border-primary hover:shadow-md transition-all"
          >
            <p className="font-heading font-bold text-lg text-foreground">{p.label}</p>
            <p className="text-sm text-muted-foreground font-body mt-1">{p.subtitle}</p>
            <p className="text-sm mt-3"><span className="font-heading font-bold text-primary">{p.price}</span> <span className="text-muted-foreground">· {p.duration}</span></p>
          </button>
        ))}
      </div>
    </div>
  );
}

function PackageStep({ pathway, packages, selectedId, onSelect }: { pathway: Pathway; packages: PackageOption[]; selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground font-body mb-2">
        {pathway === 'rental' ? 'Pick your rental package.' : 'Pick your Klawsome Mobile duration.'}
      </p>
      <div className="grid grid-cols-1 gap-3">
        {packages.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={cn(
              'text-left rounded-2xl border p-5 transition-all',
              selectedId === p.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-card hover:border-primary/50',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading font-bold text-lg text-foreground">{p.label}</p>
                {p.description && <p className="text-sm text-muted-foreground font-body mt-1">{p.description}</p>}
              </div>
              <p className="font-heading font-bold text-2xl text-primary shrink-0">{p.price}</p>
            </div>
          </button>
        ))}
      </div>
      {pathway === 'rental' && (
        <p className="text-xs text-muted-foreground font-body mt-2">Free delivery within 20 miles; $3/mile beyond 20.</p>
      )}
      {(pathway === 'rental' || pathway === 'mobile') && (
        <p className="text-xs italic text-muted-foreground font-body mt-1">*Plushie selection subject to stock.</p>
      )}
    </div>
  );
}

function DateTimeStep({
  date, time, onChange, hours, blackouts, slotMinutes, leadHours,
}: {
  date: Date | null; time: string | null; onChange: (d: Date | null, t: string | null) => void;
  hours: Parameters<typeof isDateAvailable>[1]; blackouts: Set<string> | undefined; slotMinutes: number; leadHours: number;
}) {
  const slots = useMemo(() => date ? generateSlots(date, hours, slotMinutes, leadHours) : [], [date, hours, slotMinutes, leadHours]);
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground font-body">Pick a date and time. Unavailable dates are grayed out.</p>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="rounded-2xl border border-border p-2 bg-card">
          <Calendar
            mode="single"
            selected={date ?? undefined}
            onSelect={(d) => onChange(d ?? null, null)}
            disabled={(d) => !isDateAvailable(d, hours, blackouts, leadHours)}
            initialFocus
            className="pointer-events-auto"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-heading font-bold mb-3">
            {date ? `Times for ${date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}` : 'Select a date to see times'}
          </p>
          {date && slots.length === 0 && (
            <p className="text-sm text-muted-foreground">No open time slots on this date.</p>
          )}
          <div className="grid grid-cols-3 gap-2">
            {slots.map((slot) => (
              <button
                key={slot}
                onClick={() => onChange(date, slot)}
                className={cn(
                  'px-3 py-2 text-sm rounded-lg border transition',
                  time === slot ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:border-primary/50',
                )}
              >
                {formatTime12(slot)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hr = ((h + 11) % 12) + 1;
  return `${hr}:${String(m).padStart(2, '0')} ${suffix}`;
}

function AddonsStep({ addons, selected, onChange }: { addons: AddOnDef[]; selected: State['addons']; onChange: (a: State['addons']) => void }) {
  const toggle = (id: string) => {
    const next = { ...selected };
    if (next[id]) delete next[id];
    else next[id] = { qty: 1 };
    onChange(next);
  };
  const setChar = (id: string, character: string) => {
    onChange({ ...selected, [id]: { ...(selected[id] ?? { qty: 1 }), character } });
  };
  const setQty = (id: string, qty: number) => {
    const next = { ...selected };
    if (qty <= 0) delete next[id];
    else next[id] = { ...(next[id] ?? { qty: 1 }), qty };
    onChange(next);
  };
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground font-body">Add extras to your booking. Skip if you're all set.</p>
      {addons.map((a) => {
        const sel = selected[a.id];
        const active = !!sel;
        const supportsQty = a.id === 'extra-hour' || a.id === 'plush-refill' || a.id === 'extra-machine' || a.id === 'photographer';
        return (
          <div key={a.id} className={cn('rounded-2xl border p-4 transition', active ? 'border-primary bg-primary/5' : 'border-border bg-card')}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggle(a.id)}
                    className={cn('w-5 h-5 rounded border-2 flex items-center justify-center', active ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/40')}
                    aria-label={active ? 'Remove' : 'Add'}
                  >
                    {active && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <p className="font-heading font-bold text-foreground">{a.label}</p>
                  <span className="text-sm text-primary font-heading font-bold ml-auto">{a.price}</span>
                </div>
                <p className="text-sm text-muted-foreground font-body mt-2 pl-7">{a.description}</p>
                {active && a.characters && (
                  <div className="pl-7 mt-3 flex flex-wrap gap-2">
                    {a.characters.map((c) => (
                      <button
                        key={c}
                        onClick={() => setChar(a.id, c)}
                        className={cn('text-xs px-3 py-1.5 rounded-full font-heading font-bold', sel?.character === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/70')}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
                {active && supportsQty && (
                  <div className="pl-7 mt-3 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Qty</span>
                    <button onClick={() => setQty(a.id, (sel?.qty ?? 1) - 1)} className="w-7 h-7 rounded-full border border-border">−</button>
                    <span className="w-6 text-center text-sm">{sel?.qty ?? 1}</span>
                    <button onClick={() => setQty(a.id, (sel?.qty ?? 1) + 1)} className="w-7 h-7 rounded-full border border-border">+</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {addons.length === 0 && <p className="text-sm text-muted-foreground">No add-ons available for this pathway.</p>}
    </div>
  );
}

function DeliveryStep({
  zip, onZipChange, zipInfo, resolving,
}: {
  zip: string; onZipChange: (z: string) => void; zipInfo: ZipLookup | null; resolving: boolean;
}) {
  const { data: settings } = useCmsSingle<SiteSettings>('site_settings');
  const { data: storeHours } = useCmsTable<StoreHour>('store_hours');
  const phone = (settings?.phone || '').trim();
  const telHref = phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : '';
  const hoursNote = todaysHoursNote(storeHours);
  const showCall = zipInfo && !zipInfo.known && (zipInfo.reason === 'out_of_range' || zipInfo.reason === 'not_found');
  return (
    <div className="space-y-4 max-w-md">
      <p className="text-sm text-muted-foreground font-body">Where are we delivering? Free within 20 miles; $3/mile beyond that.</p>
      <div className="space-y-2">
        <Label htmlFor="zip">Delivery ZIP code</Label>
        <Input id="zip" value={zip} onChange={(e) => onZipChange(e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="e.g. 48377" inputMode="numeric" maxLength={5} />
      </div>
      {resolving && zip.length === 5 && !zipInfo && (
        <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking distance…</p>
      )}
      {zipInfo && zipInfo.known && (
        <div className="rounded-xl bg-muted/40 border border-border p-4 text-sm font-body">
          <p className="font-heading font-bold text-foreground">~{zipInfo.miles} miles from Klawsome</p>
          {zipInfo.miles <= FREE_DELIVERY_MILES ? (
            <p className="text-primary mt-1">Free delivery ✓</p>
          ) : (
            <p className="text-foreground mt-1">Delivery surcharge: ${(Math.ceil(zipInfo.miles - FREE_DELIVERY_MILES) * 3).toFixed(2)} ({Math.ceil(zipInfo.miles - FREE_DELIVERY_MILES)} extra miles × $3)</p>
          )}
        </div>
      )}
      {showCall && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-4 text-sm space-y-3">
          <p className="font-heading font-bold text-destructive">Let's confirm this one over the phone.</p>
          <p className="text-foreground">
            {zipInfo.reason === 'out_of_range' && typeof zipInfo.miles === 'number'
              ? <>This ZIP is about <strong>{zipInfo.miles} mi</strong> away — outside our standard auto-quote range.</>
              : <>We couldn't auto-quote delivery for this ZIP.</>}
            {' '}Please call us during business hours so we can confirm the exact distance and delivery total before you check out.
          </p>
          {hoursNote && <p className="text-muted-foreground text-xs">{hoursNote}</p>}
          {phone && (
            <Button asChild size="sm" className="rounded-full">
              <a href={telHref}><Phone className="w-4 h-4 mr-2" />Call {phone}</a>
            </Button>
          )}
        </div>
      )}
      {zipInfo && !zipInfo.known && zipInfo.reason === 'invalid' && zip.length === 5 && (
        <p className="text-sm text-destructive">Please enter a valid 5-digit US ZIP code.</p>
      )}
    </div>
  );
}

// Returns a short human note about today's hours, or null if we don't have data.
function todaysHoursNote(rows: StoreHour[] | undefined): string | null {
  if (!rows || rows.length === 0) return null;
  const dow = new Date().getDay(); // 0=Sun
  const today = rows.find((r) => Number(r.day_of_week) === dow);
  if (!today) return null;
  if (today.is_closed) {
    // find next open day
    for (let i = 1; i <= 7; i++) {
      const next = rows.find((r) => Number(r.day_of_week) === (dow + i) % 7);
      if (next && !next.is_closed) {
        return `We're closed today — call ${next.day_label} after ${fmtHM(next.open_time)}.`;
      }
    }
    return "We're closed today.";
  }
  return `Business hours today: ${fmtHM(today.open_time)}–${fmtHM(today.close_time)}.`;
}

function fmtHM(t: string | null | undefined): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  if (isNaN(h)) return t;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hr = ((h + 11) % 12) + 1;
  return m ? `${hr}:${String(m).padStart(2, '0')} ${suffix}` : `${hr} ${suffix}`;
}

function ContactStep({ contact, pathway, onChange }: { contact: State['contact']; pathway: Pathway; onChange: (c: State['contact']) => void }) {
  const isBirthday = pathway === 'private' || pathway === 'semi';
  const set = (k: keyof State['contact'], v: string) => onChange({ ...contact, [k]: v });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2"><Label>Your name *</Label><Input value={contact.name} onChange={(e) => set('name', e.target.value)} /></div>
      <div><Label>Email *</Label><Input type="email" value={contact.email} onChange={(e) => set('email', e.target.value)} /></div>
      <div><Label>Phone *</Label><Input type="tel" value={contact.phone} onChange={(e) => set('phone', e.target.value)} /></div>
      <div><Label>Party size</Label><Input inputMode="numeric" value={contact.partySize} onChange={(e) => set('partySize', e.target.value.replace(/\D/g, ''))} /></div>
      {isBirthday && (
        <>
          <div><Label>Celebrant's name</Label><Input value={contact.celebrantName} onChange={(e) => set('celebrantName', e.target.value)} /></div>
          <div><Label>Celebrant's age</Label><Input inputMode="numeric" value={contact.celebrantAge} onChange={(e) => set('celebrantAge', e.target.value.replace(/\D/g, ''))} /></div>
          <div className="md:col-span-2"><Label>Favorite color, theme, plushies</Label><Input value={contact.favorites} onChange={(e) => set('favorites', e.target.value)} placeholder="e.g. Pink, Sanrio, Cinnamoroll" /></div>
        </>
      )}
      <div className="md:col-span-2"><Label>Special needs or requests</Label><Textarea value={contact.notes} onChange={(e) => set('notes', e.target.value)} rows={3} /></div>
    </div>
  );
}

function ReviewStep({
  pathway, selectedPackage, state, zipInfo, deliveryCents, totalCents,
}: {
  pathway: Pathway; selectedPackage: PackageOption | null; state: State;
  zipInfo: ZipLookup | null; deliveryCents: number; totalCents: number;
}) {
  const p = PATHWAYS.find((x) => x.id === pathway)!;
  const startAt = state.date && state.time ? combineDateTime(state.date, state.time) : null;
  const addonEntries = Object.entries(state.addons).map(([id, sel]) => {
    const def = ADDONS.find((a) => a.id === id)!;
    return { def, sel };
  });
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border p-4 bg-card">
        <p className="text-xs uppercase font-heading font-bold text-muted-foreground">Booking</p>
        <p className="font-heading font-bold text-lg mt-1">{p.label}{selectedPackage ? ` — ${selectedPackage.label}` : ''}</p>
        {startAt && <p className="text-sm text-muted-foreground mt-1">{startAt.toLocaleString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>}
      </div>
      <div className="rounded-2xl border border-border p-4 bg-card">
        <p className="text-xs uppercase font-heading font-bold text-muted-foreground mb-2">Line items</p>
        <div className="space-y-1.5 text-sm">
          {pathway !== 'rental' && pathway !== 'mobile' && (
            <Row label={p.label} amount={PATHWAY_BASE_CENTS[pathway]} />
          )}
          {selectedPackage && <Row label={selectedPackage.label} amount={selectedPackage.priceCents} />}
          {addonEntries.map(({ def, sel }) => (
            <Row key={def.id} label={`${def.label}${sel.character ? ` — ${sel.character}` : ''}${sel.qty > 1 ? ` × ${sel.qty}` : ''}`} amount={def.priceCents * sel.qty} />
          ))}
          {deliveryCents > 0 && zipInfo?.known && (
            <Row label={`Delivery surcharge (${Math.ceil(zipInfo.miles - FREE_DELIVERY_MILES)} mi × $3)`} amount={deliveryCents} />
          )}
          {deliveryCents === 0 && (pathway === 'rental' || pathway === 'mobile') && zipInfo?.known && (
            <p className="text-primary text-sm">Free delivery ✓</p>
          )}
        </div>
        <div className="border-t border-border mt-3 pt-3 flex justify-between font-heading font-bold">
          <span>Total</span><span>${(totalCents / 100).toFixed(2)}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground font-body">You'll pay through Shopify's secure checkout. Your date and time are held while you complete payment; confirmation goes out once payment succeeds.</p>
    </div>
  );
}

function Row({ label, amount }: { label: string; amount: number }) {
  return <div className="flex justify-between"><span className="text-foreground">{label}</span><span className="text-muted-foreground">${(amount / 100).toFixed(2)}</span></div>;
}

function DoneStep({ bookingRef, checkoutUrl }: { bookingRef: string | null; checkoutUrl: string | null }) {
  return (
    <div className="text-center py-8">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Check className="w-7 h-7 text-primary" />
      </div>
      <p className="font-heading font-bold text-lg">Checkout opened in a new tab</p>
      <p className="text-sm text-muted-foreground font-body mt-2">Complete payment there to lock in your booking.</p>
      {bookingRef && <p className="text-xs text-muted-foreground mt-3">Reference: <span className="font-mono">{bookingRef}</span></p>}
      {checkoutUrl && (
        <Button asChild variant="outline" className="mt-4">
          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" /> Reopen checkout
          </a>
        </Button>
      )}
    </div>
  );
}

export default BookingWizardDialog;
