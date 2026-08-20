import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Loader2, ExternalLink, Check, Phone } from 'lucide-react';
import { toast } from 'sonner';
import {
  ADDONS,
  addonsFor,
  DELIVERY_SURCHARGE_VARIANT,
  FREE_DELIVERY_MILES,
  MOBILE_TIERS,
  dayTypeFor,
  fmtUSD,
  PATHWAYS,
  PATHWAY_BASE_CENTS,
  RENTAL_PACKAGES,
  type Pathway,
  type PackageOption,
  type AddOnDef,
  type MobileTierId,
  type MobileDuration,
  type DayType,
} from '@/lib/booking/catalog';
import { getMilesForZip, getServiceLevel, type ZipLookup } from '@/lib/booking/zipMiles';
import {
  createApprovalRequest,
  fetchApprovalStatus,
  getStoredApproval,
  storeApproval,
  subscribeApprovalStatus,
  type ApprovalRecord,
  type ApprovalStatus,
} from '@/lib/booking/approvals';
import { createBookingCart, deliveryLine, generateBookingRef, type CartLine } from '@/lib/booking/cart';
import rentalFamilyPlaying from '@/assets/rental-family-playing.webp';
import rentalReadyToBook from '@/assets/rental-ready-to-book.webp';
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
  mobileTier: MobileTierId | null;
  mobileHours: MobileDuration;
  mobileExtraHours: number;
  date: Date | null;
  time: string | null;
  addons: Record<string, { qty: number; character?: string }>;
  zip: string;
  isIndoors: boolean | null;
  over200: boolean | null;
  contact: {
    name: string; email: string; phone: string; partySize: string; adults: string; children: string;
    celebrantName: string; celebrantAge: string; favorites: string; notes: string;
  };
  checkoutUrl: string | null;
  bookingRef: string | null;
  safetyAccepted: boolean;
}

const emptyState = (): State => ({
  pathway: null,
  packageId: null,
  mobileTier: null,
  mobileHours: 1,
  mobileExtraHours: 0,
  date: null,
  time: null,
  addons: {},
  zip: '',
  isIndoors: null,
  over200: null,
  contact: { name: '', email: '', phone: '', partySize: '', adults: '', children: '', celebrantName: '', celebrantAge: '', favorites: '', notes: '' },
  checkoutUrl: null,
  bookingRef: null,
  safetyAccepted: false,
});

function packagesFor(pathway: Pathway | null): PackageOption[] {
  if (pathway === 'rental') return RENTAL_PACKAGES;
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

  const dayType: DayType = dayTypeFor(state.date);
  const mobileTier = useMemo(
    () => MOBILE_TIERS.find((t) => t.id === state.mobileTier) || null,
    [state.mobileTier],
  );
  const mobileBaseCents = mobileTier ? mobileTier.rates[dayType][state.mobileHours].cents : 0;
  const mobileExtraCents = mobileTier ? mobileTier.rates[dayType].extra.cents * state.mobileExtraHours : 0;

  const needsDelivery = pathway === 'rental' || pathway === 'mobile';
  const [zipInfo, setZipInfo] = useState<ZipLookup | null>(null);
  const [zipResolving, setZipResolving] = useState(false);
  const [approval, setApproval] = useState<ApprovalRecord | null>(null);

  // Indoors or 200+ guests = automatic exception to the ZIP safety screen.
  const exceptionOk = state.isIndoors === true || state.over200 === true;
  const approvalUnlocked = approval?.status === 'approved' && approval.zip === state.zip.trim();
  const bypassSafety = exceptionOk || approvalUnlocked;

  // Restore any approval already recorded for this ZIP on this device.
  useEffect(() => {
    const clean = state.zip.trim();
    if (!needsDelivery || clean.length < 5) { setApproval(null); return; }
    setApproval(getStoredApproval(clean));
  }, [state.zip, needsDelivery]);

  // Live-track the pending request: unlocks the wizard the moment staff approves.
  useEffect(() => {
    const code = approval?.code;
    if (!code) return;
    let cancelled = false;
    const apply = (st: ApprovalStatus) => {
      setApproval((prev) => {
        if (!prev || prev.code !== code || prev.status === st) return prev;
        const next = { ...prev, status: st };
        storeApproval(next);
        return next;
      });
    };
    fetchApprovalStatus(code).then((st) => { if (!cancelled && st) apply(st); });
    const unsub = subscribeApprovalStatus(code, apply);
    const poll = window.setInterval(() => {
      fetchApprovalStatus(code).then((st) => { if (!cancelled && st) apply(st); });
    }, 15000);
    return () => { cancelled = true; unsub(); window.clearInterval(poll); };
  }, [approval?.code]);

  useEffect(() => {
    if (!needsDelivery) { setZipInfo(null); return; }
    const clean = state.zip.trim();
    if (clean.length < 5) { setZipInfo(null); return; }
    let cancelled = false;
    setZipResolving(true);
    getMilesForZip(clean, { bypassSafety }).then((r) => {
      if (cancelled) return;
      setZipInfo(r);
      setZipResolving(false);
    });
    return () => { cancelled = true; };
  }, [state.zip, needsDelivery, bypassSafety]);

  const submitApproval = async (notes: string) => {
    const clean = state.zip.trim();
    const svc = await getServiceLevel(clean);
    const rec = await createApprovalRequest({
      zip: clean,
      city: svc.city,
      zipLevel: svc.level,
      eventType: pathway ?? 'mobile',
      contactName: state.contact.name,
      contactPhone: state.contact.phone,
      contactEmail: state.contact.email,
      requestedDate: state.date ? state.date.toISOString().slice(0, 10) : null,
      partySize: state.contact.partySize ? Number(state.contact.partySize) : null,
      isIndoors: state.isIndoors === true,
      over200: state.over200 === true,
      notes,
    });
    setApproval(rec);
    return rec;
  };

  const deliveryCents = zipInfo?.known
    ? Math.max(0, Math.ceil(zipInfo.miles - FREE_DELIVERY_MILES)) * 300
    : 0;
  const zipBlocked = needsDelivery && state.zip.trim().length === 5 && zipInfo && !zipInfo.known;

  const availableAddons = pathway ? addonsFor(pathway) : [];

  const totalCents = useMemo(() => {
    let sum = 0;
    if (pathway && pathway !== 'rental' && pathway !== 'mobile') sum += PATHWAY_BASE_CENTS[pathway];
    if (selectedPackage) sum += selectedPackage.priceCents;
    if (pathway === 'mobile') sum += mobileBaseCents + mobileExtraCents;
    for (const [id, sel] of Object.entries(state.addons)) {
      const def = ADDONS.find((a) => a.id === id);
      if (def) sum += def.priceCents * (sel.qty || 0);
    }
    sum += deliveryCents;
    return sum;
  }, [pathway, selectedPackage, state.addons, deliveryCents, mobileBaseCents, mobileExtraCents]);

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
      } else if (pathway === 'mobile' && mobileTier) {
        lines.push({
          merchandiseId: mobileTier.rates[dayType][state.mobileHours].variantId,
          quantity: 1,
          attributes: lineAttrs,
        });
        if (state.mobileExtraHours > 0) {
          lines.push({
            merchandiseId: mobileTier.rates[dayType].extra.variantId,
            quantity: state.mobileExtraHours,
            attributes: lineAttrs,
          });
        }
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
        { key: 'adults', value: state.contact.adults },
        { key: 'children', value: state.contact.children },
        { key: 'celebrant_name', value: state.contact.celebrantName },
        { key: 'celebrant_age', value: state.contact.celebrantAge },
        { key: 'favorites', value: state.contact.favorites },
        { key: 'notes', value: state.contact.notes },
        { key: 'contact_name', value: state.contact.name },
        { key: 'contact_email', value: state.contact.email },
        { key: 'contact_phone', value: state.contact.phone },
        { key: 'zip', value: state.zip },
        { key: 'miles', value: zipInfo?.known ? String(zipInfo.miles) : '' },
        { key: 'tier', value: pathway === 'mobile' && mobileTier ? mobileTier.label : '' },
        { key: 'day_type', value: pathway === 'mobile' ? dayType : '' },
        { key: 'duration_hours', value: pathway === 'mobile' ? String(state.mobileHours + state.mobileExtraHours) : '' },
        { key: 'extra_hours', value: pathway === 'mobile' && state.mobileExtraHours ? String(state.mobileExtraHours) : '' },
        { key: 'safety_policy_accepted', value: state.safetyAccepted ? new Date().toISOString() : '' },
        { key: 'indoors', value: needsDelivery && state.isIndoors !== null ? (state.isIndoors ? 'yes' : 'no') : '' },
        { key: 'over_200_guests', value: needsDelivery && state.over200 !== null ? (state.over200 ? 'yes' : 'no') : '' },
        { key: 'zip_approval_code', value: approvalUnlocked && approval ? approval.code : '' },
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
      // Persist a pending booking record via service-role edge function so the
      // admin calendar shows the booking immediately. Status updates to
      // confirmed when the Shopify order sync runs.
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase.functions.invoke('create-pending-booking', {
          body: {
            booking_ref: ref,
            event_type: pathway,
            start_at: startAt.toISOString(),
            duration_minutes: pathway === 'mobile' ? (state.mobileHours + state.mobileExtraHours) * 60 : 60,
            contact_name: state.contact.name,
            contact_email: state.contact.email,
            contact_phone: state.contact.phone,
            party_size: state.contact.partySize || String((Number(state.contact.adults) || 0) + (Number(state.contact.children) || 0)),
            celebrant_name: state.contact.celebrantName,
            celebrant_age: state.contact.celebrantAge,
            favorites: state.contact.favorites,
            notes: state.contact.notes,
            zip: state.zip,
            miles: zipInfo?.known ? zipInfo.miles : null,
            addons: state.addons,
            shopify_cart_id: result.checkoutUrl,
            total_cents: totalCents,
            safety_policy_accepted_at: state.safetyAccepted ? new Date().toISOString() : null,
          },
        });
      } catch (err) {
        console.warn('pending booking insert failed', err);
      }
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
      <DialogContent className="p-0 gap-0 booking-dialog">
        <DialogHeader className="px-6 pt-5 pb-3 border-b shrink-0">
          <DialogTitle className="font-heading">Book with Klawsome</DialogTitle>
          <StepBar step={step} pathway={pathway} />
        </DialogHeader>
        <div className="px-6 py-6 flex-1 overflow-y-auto text-base w-full [&>*]:w-full [&>*]:max-w-[1400px] [&>*]:mx-auto">
          {step === 'pathway' && (
            <PathwayStep onPick={(p) => { setState((s) => ({ ...s, pathway: p })); setStep(nextAfterPathway(p)); }} />
          )}
          {step === 'package' && pathway && (
            pathway === 'mobile' ? (
              <MobileTierStep
                dayType={dayType}
                date={state.date}
                tierId={state.mobileTier}
                hours={state.mobileHours}
                extraHours={state.mobileExtraHours}
                onChange={(patch) => setState((s) => ({ ...s, ...patch }))}
              />
            ) : (
              <PackageStep pathway={pathway} packages={pkgs} selectedId={state.packageId} onSelect={(id) => setState((s) => ({ ...s, packageId: id }))} />
            )
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
            <DeliveryStep
              zip={state.zip}
              onZipChange={(z) => setState((s) => ({ ...s, zip: z }))}
              zipInfo={zipInfo}
              resolving={zipResolving}
              isIndoors={state.isIndoors}
              over200={state.over200}
              onGateChange={(k, v) => setState((s) => ({ ...s, [k]: v }))}
              approval={approval}
              onRequestApproval={submitApproval}
              contactDefaults={state.contact}
              onContactChange={(c) => setState((s) => ({ ...s, contact: { ...s.contact, ...c } }))}
            />
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
              dayType={dayType}
              mobileBaseCents={mobileBaseCents}
              mobileExtraCents={mobileExtraCents}
              safetyAccepted={state.safetyAccepted}
              onSafetyChange={(v) => setState((s) => ({ ...s, safetyAccepted: v }))}
            />
          )}
          {step === 'done' && (
            <DoneStep bookingRef={state.bookingRef} checkoutUrl={state.checkoutUrl} />
          )}
        </div>
        {step !== 'done' && step !== 'pathway' && (
          <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/30 shrink-0">
            <Button variant="ghost" onClick={goBack} disabled={submitting || (step === stepOrder(pathway)[1] && !!initialPathway)}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <div className="text-sm text-muted-foreground hidden sm:block">
              {totalCents > 0 && `Estimated total: $${(totalCents / 100).toFixed(2)}`}
              {zipBlocked && <span className="ml-3 text-destructive">We'll quote delivery for this ZIP.</span>}
            </div>
            {step === 'review' ? (
              <Button onClick={submit} disabled={submitting || !canNext} className="bg-primary text-primary-foreground">
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
  const needsDelivery = pathway === 'rental' || pathway === 'mobile';
  const base: Step[] = ['pathway'];
  if (pathway === 'rental') base.push('package');
  base.push('datetime');
  // Mobile pricing depends on the date (weekday vs weekend), so tiers come after.
  if (pathway === 'mobile') base.push('package');
  base.push('addons');
  if (needsDelivery) base.push('delivery');
  base.push('contact', 'review', 'done');
  return base;
}

function nextAfterPathway(p: Pathway): Step {
  return p === 'rental' ? 'package' : 'datetime';
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
    case 'package': return s.pathway === 'mobile' ? !!s.mobileTier : !!pkg;
    case 'datetime': return !!s.date && !!s.time;
    case 'addons': return true;
    case 'delivery': return s.isIndoors !== null && s.over200 !== null && !!zipInfo?.known;
    case 'contact': {
      const c = s.contact;
      if (!(c.name.trim() && /.+@.+\..+/.test(c.email) && c.phone.trim())) return false;
      if (s.pathway === 'private' || s.pathway === 'semi') {
        const a = Number(c.adults);
        const k = Number(c.children);
        if (!Number.isFinite(a) || a < 1 || a > 12) return false;
        if (!Number.isFinite(k) || k < 0 || k > 12) return false;
      }
      return true;
    }
    case 'review': return !!s.safetyAccepted;
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

/* ---------- Card imagery (3:2 landscape, cropped to fill) ---------- */

const PATHWAY_IMAGES: Record<Pathway, { src: string; alt: string }> = {
  private: { src: '/gallery/private-party-kids-turtle-plush-machine.webp', alt: 'Kids playing a plushie claw machine during a private Klawsome party' },
  semi: { src: '/gallery/private-party-ice-cream-cone-plush-machine.webp', alt: 'Party guests at the ice cream plush claw machine in the Klawsome arcade' },
  rental: { src: rentalFamilyPlaying, alt: 'Family playing a rented Klawsome claw machine at their venue' },
  mobile: { src: '/gallery/novi-community-fest-13.webp', alt: 'Klawsome Mobile claw machine arcade set up at a community event' },
};

const PACKAGE_IMAGES: Record<string, { src: string; alt: string }> = {
  'rent-1hr': { src: rentalFamilyPlaying, alt: 'Guests playing a rented Klawsome claw machine' },
  'rent-2hr': { src: rentalReadyToBook, alt: 'Klawsome claw machine ready for an extended party rental' },
};

const MOBILE_TIER_IMAGES: Record<MobileTierId, { src: string; alt: string }> = {
  token: { src: '/gallery/novi-community-fest-24.webp', alt: 'Guests using tokens at the Klawsome Mobile arcade' },
  unlimited: { src: '/gallery/novi-community-fest-26.webp', alt: 'Kids playing nonstop at the Klawsome Mobile arcade' },
  reserve: { src: '/gallery/msu-pass-07.webp', alt: 'Klawsome Mobile arcade reserved for a group event' },
};

const CardImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="w-full aspect-[3/2] overflow-hidden bg-muted">
    <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover" />
  </div>
);

function PathwayStep({ onPick }: { onPick: (p: Pathway) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground font-body mb-2">What are you booking?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PATHWAYS.map((p) => (
          <button
            key={p.id}
            onClick={() => onPick(p.id)}
            className="text-left rounded-2xl border border-border bg-card overflow-hidden flex flex-col hover:border-primary hover:shadow-md transition-all"
          >
            <CardImage {...PATHWAY_IMAGES[p.id]} />
            <div className="p-5">
              <p className="font-heading font-bold text-lg text-foreground">{p.label}</p>
              <p className="text-sm text-muted-foreground font-body mt-1">{p.subtitle}</p>
              <p className="text-sm mt-3"><span className="font-heading font-bold text-primary">{p.price}</span> <span className="text-muted-foreground">· {p.duration}</span></p>
            </div>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {packages.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={cn(
              'text-left rounded-2xl border overflow-hidden flex flex-col transition-all',
              selectedId === p.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-card hover:border-primary/50',
            )}
          >
            {PACKAGE_IMAGES[p.id] && <CardImage {...PACKAGE_IMAGES[p.id]} />}
            <div className="p-5 flex items-start justify-between gap-3">
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

function MobileTierStep({
  dayType, date, tierId, hours, extraHours, onChange,
}: {
  dayType: DayType;
  date: Date | null;
  tierId: MobileTierId | null;
  hours: MobileDuration;
  extraHours: number;
  onChange: (patch: Partial<State>) => void;
}) {
  const selected = MOBILE_TIERS.find((t) => t.id === tierId) || null;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted-foreground font-body">Pick your Klawsome Mobile package.</p>
        <span className="text-xs font-heading font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
          {dayType === 'weekend' ? 'Weekend pricing' : 'Weekday pricing'}
          {date ? ` · ${date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}` : ''}
        </span>
      </div>

      <div className="flex gap-2">
        {([1, 2] as MobileDuration[]).map((h) => (
          <button
            key={h}
            onClick={() => onChange({ mobileHours: h })}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-heading font-bold border transition',
              hours === h ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:border-primary/50',
            )}
          >
            {h} {h === 1 ? 'Hour' : 'Hours'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {MOBILE_TIERS.map((t) => {
          const rate = t.rates[dayType][hours];
          const active = tierId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange({ mobileTier: t.id })}
              className={cn(
                'text-left rounded-2xl border p-5 transition-all',
                active ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-card hover:border-primary/50',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-heading font-bold text-lg text-foreground">{t.label}</p>
                  <p className="text-sm text-muted-foreground font-body mt-1">{t.description}</p>
                  <p className="text-sm text-foreground font-body mt-1">{t.tokensNote[hours]}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-heading font-bold text-2xl text-primary">{fmtUSD(rate.cents)}</p>
                  <p className="text-xs text-muted-foreground">+{fmtUSD(t.rates[dayType].extra.cents)} / extra hr</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-heading font-bold text-foreground">Additional hours</p>
            <p className="text-sm text-muted-foreground font-body">
              {fmtUSD(selected.rates[dayType].extra.cents)} per extra hour
              {selected.extraHourNote ? ` · ${selected.extraHourNote}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onChange({ mobileExtraHours: Math.max(0, extraHours - 1) })} className="w-8 h-8 rounded-full border border-border">−</button>
            <span className="w-6 text-center">{extraHours}</span>
            <button onClick={() => onChange({ mobileExtraHours: Math.min(8, extraHours + 1) })} className="w-8 h-8 rounded-full border border-border">+</button>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground font-body">
        Weekday rates apply Mon–Fri; weekend rates apply Sat–Sun. Free delivery within 20 miles; $3/mile beyond 20.
      </p>
      <p className="text-xs italic text-muted-foreground font-body">*Plushie selection subject to stock.</p>
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
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground font-body">Add extras to your booking. Skip if you're all set.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
      </div>
      {addons.length === 0 && <p className="text-sm text-muted-foreground">No add-ons available for this pathway.</p>}
    </div>
  );
}

function GateToggle({
  label, value, onChange,
}: { label: string; value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        {[true, false].map((opt) => (
          <Button
            key={String(opt)}
            type="button"
            size="sm"
            variant={value === opt ? 'default' : 'outline'}
            className="rounded-full min-w-[84px]"
            onClick={() => onChange(opt)}
          >
            {opt ? 'Yes' : 'No'}
          </Button>
        ))}
      </div>
    </div>
  );
}

function DeliveryStep({
  zip, onZipChange, zipInfo, resolving,
  isIndoors, over200, onGateChange,
  approval, onRequestApproval, contactDefaults, onContactChange,
}: {
  zip: string; onZipChange: (z: string) => void; zipInfo: ZipLookup | null; resolving: boolean;
  isIndoors: boolean | null; over200: boolean | null;
  onGateChange: (key: 'isIndoors' | 'over200', value: boolean) => void;
  approval: ApprovalRecord | null;
  onRequestApproval: (notes: string) => Promise<ApprovalRecord>;
  contactDefaults: { name: string; email: string; phone: string };
  onContactChange: (c: Partial<{ name: string; email: string; phone: string }>) => void;
}) {
  const { data: settings } = useCmsSingle<SiteSettings>('site_settings');
  const { data: storeHours } = useCmsTable<StoreHour>('store_hours');
  const phone = (settings?.phone || '').trim();
  const telHref = phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : '';
  const hoursNote = todaysHoursNote(storeHours);
  const gatesAnswered = isIndoors !== null && over200 !== null;

  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const restricted =
    zipInfo && zipInfo.known === false && (zipInfo.reason === 'blocked' || zipInfo.reason === 'review')
      ? zipInfo
      : null;
  const showCall =
    zipInfo && zipInfo.known === false &&
    (zipInfo.reason === 'out_of_range' || zipInfo.reason === 'not_found')
      ? zipInfo
      : null;

  const approvalForZip = approval && approval.zip === zip.trim() ? approval : null;

  const submit = async () => {
    if (!contactDefaults.name.trim() || contactDefaults.phone.replace(/\D/g, '').length < 10) {
      toast.error('Please add your name and a phone number we can call back.');
      return;
    }
    setSubmitting(true);
    try {
      await onRequestApproval(notes);
      toast.success('Request sent! Give us a call and we\u2019ll approve it while you\u2019re on the line.');
      setShowForm(false);
    } catch (e: any) {
      toast.error(e?.message || 'Could not send the request. Please call us instead.');
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground font-body">Where are we delivering? Free within 20 miles; $3/mile beyond that.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <GateToggle
              label="Is your event fully indoors?"
              value={isIndoors}
              onChange={(v) => onGateChange('isIndoors', v)}
            />
            <GateToggle
              label="Will attendance be over 200 people?"
              value={over200}
              onChange={(v) => onGateChange('over200', v)}
            />
          </div>

          {!gatesAnswered && (
            <p className="text-sm text-muted-foreground">Answer both questions above to continue.</p>
          )}

          {gatesAnswered && (
            <div className="space-y-2 max-w-xs">
              <Label htmlFor="zip">Delivery ZIP code</Label>
              <Input id="zip" value={zip} onChange={(e) => onZipChange(e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="e.g. 48377" inputMode="numeric" maxLength={5} />
            </div>
          )}
        </div>

        <div className="space-y-4">
          {gatesAnswered && resolving && zip.length === 5 && !zipInfo && (
            <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking distance…</p>
          )}
          {gatesAnswered && zipInfo && zipInfo.known && (
            <div className="rounded-xl bg-muted/40 border border-border p-4 text-sm font-body">
              <p className="font-heading font-bold text-foreground">~{zipInfo.miles} miles from Klawsome</p>
              {zipInfo.miles <= FREE_DELIVERY_MILES ? (
                <p className="text-primary mt-1">Free delivery ✓</p>
              ) : (
                <p className="text-foreground mt-1">Delivery surcharge: ${(Math.ceil(zipInfo.miles - FREE_DELIVERY_MILES) * 3).toFixed(2)} ({Math.ceil(zipInfo.miles - FREE_DELIVERY_MILES)} extra miles × $3)</p>
              )}
              {approvalForZip?.status === 'approved' && (
                <p className="text-primary mt-1">Confirmed by our team ✓ (request #{approvalForZip.code})</p>
              )}
            </div>
          )}

          {gatesAnswered && restricted && (
            <div className="rounded-xl bg-muted/40 border border-border p-4 text-sm space-y-3">
              <p className="font-heading font-bold text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" /> Let's confirm this booking over the phone.
              </p>
              {hoursNote && <p className="text-muted-foreground text-xs">{hoursNote}</p>}
              {phone && (
                <Button asChild size="sm" className="rounded-full">
                  <a href={telHref}><Phone className="w-4 h-4 mr-2" />Call {phone}</a>
                </Button>
              )}

              {approvalForZip?.status === 'pending' ? (
                <div className="rounded-lg bg-background/60 border border-border p-3 space-y-1">
                  <p className="font-heading font-bold text-foreground flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Waiting on confirmation — request #{approvalForZip.code}
                  </p>
                  <p className="text-muted-foreground text-xs">Call us and mention your request number.</p>
                </div>
              ) : approvalForZip?.status === 'denied' ? (
                <div className="rounded-lg bg-background/60 border border-border p-3 space-y-1">
                  <p className="font-heading font-bold text-foreground">Request #{approvalForZip.code} isn't confirmed</p>
                  <p className="text-muted-foreground text-xs">Please give us a call.</p>
                </div>
              ) : showForm ? (
                <div className="rounded-lg bg-background/60 border border-border p-3 space-y-3">
                  <p className="font-heading font-bold text-foreground">Request a callback</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="ap-name">Your name</Label>
                    <Input id="ap-name" value={contactDefaults.name} onChange={(e) => onContactChange({ name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ap-phone">Phone</Label>
                    <Input id="ap-phone" value={contactDefaults.phone} onChange={(e) => onContactChange({ phone: e.target.value })} inputMode="tel" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="ap-email">Email (optional)</Label>
                    <Input id="ap-email" value={contactDefaults.email} onChange={(e) => onContactChange({ email: e.target.value })} inputMode="email" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="ap-notes">Notes (optional)</Label>
                    <Textarea id="ap-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
                  </div>
                  </div>
                  <Button size="sm" className="rounded-full" disabled={submitting} onClick={submit}>
                    {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Send request
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => setShowForm(true)}>
                  Request a callback
                </Button>
              )}
            </div>
          )}

          {gatesAnswered && showCall && (
            <div className="rounded-xl bg-muted/40 border border-border p-4 text-sm space-y-3">
              <p className="font-heading font-bold text-foreground">Please call us to confirm delivery for this ZIP before checking out.</p>
              {hoursNote && <p className="text-muted-foreground text-xs">{hoursNote}</p>}
              {phone && (
                <Button asChild size="sm" className="rounded-full">
                  <a href={telHref}><Phone className="w-4 h-4 mr-2" />Call {phone}</a>
                </Button>
              )}
            </div>
          )}

          {gatesAnswered && zipInfo && zipInfo.known === false && zipInfo.reason === 'invalid' && zip.length === 5 && (
            <p className="text-sm text-destructive">Please enter a valid 5-digit US ZIP code.</p>
          )}
        </div>
      </div>
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
  const setCount = (k: 'adults' | 'children', v: string) => {
    const digits = v.replace(/\D/g, '');
    const n = digits === '' ? '' : String(Math.min(12, Number(digits)));
    const next = { ...contact, [k]: n };
    const a = Number(next.adults) || 0;
    const c2 = Number(next.children) || 0;
    next.partySize = a || c2 ? `${a} adults, ${c2} children` : '';
    onChange(next);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {isBirthday && (
        <div className="md:col-span-2 rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <p className="font-heading font-bold text-foreground mb-2">How many adults and children are allowed?</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground font-body">
            <li>As Klawsome has limited space, a maximum of <strong>12 adults</strong> are allowed along with a <strong>separate</strong> maximum of <strong>12 children</strong> (up to 24 guests total, counted separately).</li>
            <li>Klawsome keeps a limit on guests to ensure a fun and comfortable experience for everyone.</li>
          </ul>
        </div>
      )}
      <div className="md:col-span-2"><Label>Your name *</Label><Input value={contact.name} onChange={(e) => set('name', e.target.value)} /></div>
      <div><Label>Email *</Label><Input type="email" value={contact.email} onChange={(e) => set('email', e.target.value)} /></div>
      <div><Label>Phone *</Label><Input type="tel" value={contact.phone} onChange={(e) => set('phone', e.target.value)} /></div>
      {isBirthday ? (
        <>
          <div><Label>Adults * (max 12)</Label><Input inputMode="numeric" max={12} value={contact.adults} onChange={(e) => setCount('adults', e.target.value)} /></div>
          <div><Label>Children (max 12)</Label><Input inputMode="numeric" max={12} value={contact.children} onChange={(e) => setCount('children', e.target.value)} /></div>
        </>
      ) : (
        <div><Label>Party size</Label><Input inputMode="numeric" value={contact.partySize} onChange={(e) => set('partySize', e.target.value.replace(/\D/g, ''))} /></div>
      )}
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
  pathway, selectedPackage, state, zipInfo, deliveryCents, totalCents, dayType, mobileBaseCents, mobileExtraCents,
  safetyAccepted, onSafetyChange,
}: {
  pathway: Pathway; selectedPackage: PackageOption | null; state: State;
  zipInfo: ZipLookup | null; deliveryCents: number; totalCents: number;
  dayType: DayType; mobileBaseCents: number; mobileExtraCents: number;
  safetyAccepted: boolean; onSafetyChange: (v: boolean) => void;
}) {
  const p = PATHWAYS.find((x) => x.id === pathway)!;
  const tier = MOBILE_TIERS.find((t) => t.id === state.mobileTier) || null;
  const startAt = state.date && state.time ? combineDateTime(state.date, state.time) : null;
  const addonEntries = Object.entries(state.addons).map(([id, sel]) => {
    const def = ADDONS.find((a) => a.id === id)!;
    return { def, sel };
  });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <div className="rounded-2xl border border-border p-4 bg-card">
        <p className="text-xs uppercase font-heading font-bold text-muted-foreground">Booking</p>
        <p className="font-heading font-bold text-lg mt-1">
          {p.label}
          {selectedPackage ? ` — ${selectedPackage.label}` : ''}
          {pathway === 'mobile' && tier ? ` — ${tier.label}` : ''}
        </p>
        {pathway === 'mobile' && tier && (
          <p className="text-sm text-muted-foreground mt-1">
            {state.mobileHours + state.mobileExtraHours} hour{state.mobileHours + state.mobileExtraHours === 1 ? '' : 's'} · {dayType === 'weekend' ? 'Weekend' : 'Weekday'} rate
          </p>
        )}
        {startAt && <p className="text-sm text-muted-foreground mt-1">{startAt.toLocaleString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>}
      </div>
      <div className="rounded-2xl border border-border p-4 bg-card">
        <p className="text-xs uppercase font-heading font-bold text-muted-foreground mb-2">Line items</p>
        <div className="space-y-1.5 text-sm">
          {pathway !== 'rental' && pathway !== 'mobile' && (
            <Row label={p.label} amount={PATHWAY_BASE_CENTS[pathway]} />
          )}
          {selectedPackage && <Row label={selectedPackage.label} amount={selectedPackage.priceCents} />}
          {pathway === 'mobile' && tier && (
            <Row label={`${tier.label} — ${state.mobileHours} hr (${dayType === 'weekend' ? 'weekend' : 'weekday'})`} amount={mobileBaseCents} />
          )}
          {pathway === 'mobile' && tier && state.mobileExtraHours > 0 && (
            <Row label={`Additional hours × ${state.mobileExtraHours}`} amount={mobileExtraCents} />
          )}
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
      </div>
      <div className="rounded-2xl border border-border p-4 bg-muted/30">
        <label htmlFor="safety-policy" className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            id="safety-policy"
            checked={safetyAccepted}
            onCheckedChange={(v) => onSafetyChange(v === true)}
            className="mt-1"
          />
          <span className="text-sm font-body leading-relaxed">
            <strong className="font-heading">Service Area &amp; Safety Policy:</strong>{' '}
            Klawsome Mobile reserves the right to decline or modify an event based on operational,
            logistical, or safety considerations. Factors may include the specific event location,
            parking and loading conditions, security arrangements, operating hours, accessibility,
            ability to safely park and secure the trailer, and other conditions that could reasonably
            affect the safety of our employees, equipment, or guests. We don't operate in locations
            where we cannot reasonably protect our employees and equipment.
          </span>
        </label>
        {!safetyAccepted && (
          <p className="text-xs text-destructive mt-2 ml-8">Please check the box to continue to payment.</p>
        )}
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
