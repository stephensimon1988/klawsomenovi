// Shopify variant registry for the booking wizard.
export const gid = (id: number | string) => `gid://shopify/ProductVariant/${id}`;

export type Pathway = 'private' | 'semi' | 'rental' | 'mobile';

export interface PathwayDef {
  id: Pathway;
  label: string;
  subtitle: string;
  price: string;
  duration: string;
  variantId: string;
  needsDelivery: boolean;
}

export const PATHWAYS: PathwayDef[] = [
  { id: 'private', label: 'Klawsome Private Party', subtitle: 'Exclusive space, your color + music, 325 tokens.', price: '$319', duration: '1 hour', variantId: gid(52297242738990), needsDelivery: false },
  { id: 'semi', label: 'Semi-Private Party', subtitle: 'Paris Baguette table + 325 tokens.', price: '$250', duration: '1 hour', variantId: gid(52297250636078), needsDelivery: false },
  { id: 'rental', label: 'Rent a Klaw Machine', subtitle: 'Klaw Mini for the day, or the full-size Klaw Classic in 4-hour blocks.', price: 'from $95', duration: 'whole day or 4-hour blocks', variantId: '', needsDelivery: true },
  { id: 'mobile', label: 'Book Klawsome Mobile', subtitle: 'Mobile claw machine arcade for your event. Weekday & weekend rates.', price: 'from $295', duration: '1 or 2 hours + extra hours', variantId: '', needsDelivery: true },
];

export interface PackageOption {
  id: string;
  label: string;
  price: string;
  priceCents: number;
  variantId: string;
  description?: string;
}

export const PATHWAY_BASE_CENTS: Record<Pathway, number> = {
  private: 31900,
  semi: 25000,
  rental: 0,
  mobile: 0,
};

/* ---------- Machine rentals: Klaw Mini vs Klaw Classic ---------- */

export type MachineId = 'mini' | 'classic';

export interface MachineRate { cents: number; variantId: string }

export interface MachineDef {
  id: MachineId;
  label: string;
  specs: string;
  description: string;
  /** How the base rate is sold. */
  unit: 'whole_day' | 'block';
  unitLabel: string;
  /** First unit price by day type. */
  first: Record<DayType, MachineRate>;
  /** Price for each additional 4-hour block (block machines only). */
  extraBlock?: Record<DayType, MachineRate>;
  maxExtraBlocks: number;
  /** Klaw Classic is delivered and set up by our team. */
  deliveryOnly: boolean;
  deliveryBaseCents: number;
  deliveryBaseVariantId: string;
  freeMiles: number;
  plushPack: { label: string; priceCents: number; variantId: string };
  notes: string[];
}

export const MACHINES: MachineDef[] = [
  {
    id: 'mini',
    label: 'Single Klaw Mini',
    specs: 'H30 × L16 × W16 in · prizes 3 in or less',
    description: 'One mini claw machine for the whole day. Pick it up yourself or have it delivered.',
    unit: 'whole_day',
    unitLabel: 'Whole day',
    first: {
      weekday: { cents: 9500, variantId: gid(52492252381486) },
      weekend: { cents: 14500, variantId: gid(52492252414254) },
    },
    maxExtraBlocks: 0,
    deliveryOnly: false,
    deliveryBaseCents: 2000,
    deliveryBaseVariantId: gid(52492252447022),
    freeMiles: 0,
    plushPack: { label: '20 plush of your choice', priceCents: 5000, variantId: gid(52492252479790) },
    notes: [
      'Customer agrees to pay up to $700 for substantial damage and $50 for aesthetic damage.',
    ],
  },
  {
    id: 'classic',
    label: 'Klaw Classic (full size)',
    specs: 'Full-size arcade cabinet · delivered and set up',
    description: 'Our full-size machine, priced per 4-hour block.',
    unit: 'block',
    unitLabel: '4-hour block',
    first: {
      weekday: { cents: 44500, variantId: gid(52492252512558) },
      weekend: { cents: 44500, variantId: gid(52492252512558) },
    },
    extraBlock: {
      weekday: { cents: 19500, variantId: gid(52492252545326) },
      weekend: { cents: 24500, variantId: gid(52492252578094) },
    },
    maxExtraBlocks: 5,
    deliveryOnly: true,
    deliveryBaseCents: 0,
    deliveryBaseVariantId: '',
    freeMiles: 10,
    plushPack: { label: '20 plush of your choice', priceCents: 8000, variantId: gid(52492252610862) },
    notes: [],
  },
];

export const machineById = (id: MachineId | null | undefined): MachineDef | null =>
  MACHINES.find((m) => m.id === id) ?? null;

export type PlushChoice = 'pack' | 'byo';
export type Fulfillment = 'pickup' | 'delivery';


/* ---------- Klawsome Mobile: tiered, weekday/weekend pricing ---------- */

export type MobileTierId = 'token' | 'unlimited' | 'reserve';
export type DayType = 'weekday' | 'weekend';
export type MobileDuration = 1 | 2;

interface MobileRate { cents: number; variantId: string }

export interface MobileTierDef {
  id: MobileTierId;
  label: string;
  description: string;
  tokensNote: Record<MobileDuration, string>;
  extraHourNote?: string;
  rates: Record<DayType, { 1: MobileRate; 2: MobileRate; extra: MobileRate }>;
}

export const MOBILE_TIERS: MobileTierDef[] = [
  {
    id: 'token',
    label: 'Token Pre-Buy',
    description: 'Pre-purchased tokens for your guests to play with.',
    tokensNote: { 1: '400 tokens included', 2: '600 tokens included' },
    extraHourNote: '100 tokens per additional hour',
    rates: {
      weekday: {
        1: { cents: 59500, variantId: gid(52373062975790) },
        2: { cents: 79500, variantId: gid(52373063041326) },
        extra: { cents: 19500, variantId: gid(52373063106862) },
      },
      weekend: {
        1: { cents: 72000, variantId: gid(52373063008558) },
        2: { cents: 92000, variantId: gid(52373063074094) },
        extra: { cents: 24500, variantId: gid(52373063139630) },
      },
    },
  },
  {
    id: 'unlimited',
    label: 'Unlimited Play',
    description: 'Unlimited play for the whole event — no token limit.',
    tokensNote: {
      1: 'Infinite play (30-token tray at a time)',
      2: 'Infinite play (30-token tray at a time)',
    },
    rates: {
      weekday: {
        1: { cents: 119000, variantId: gid(52373063172398) },
        2: { cents: 215000, variantId: gid(52373063237934) },
        extra: { cents: 95000, variantId: gid(52373063303470) },
      },
      weekend: {
        1: { cents: 124500, variantId: gid(52373063205166) },
        2: { cents: 245000, variantId: gid(52373063270702) },
        extra: { cents: 104500, variantId: gid(52373063336238) },
      },
    },
  },
  {
    id: 'reserve',
    label: 'Reserve Arcade',
    description: 'Reserve the arcade for your group — tokens purchased separately.',
    tokensNote: { 1: 'Tokens bought separately', 2: 'Tokens bought separately' },
    rates: {
      weekday: {
        1: { cents: 29500, variantId: gid(52373063369006) },
        2: { cents: 54500, variantId: gid(52373063434542) },
        extra: { cents: 19500, variantId: gid(52373063500078) },
      },
      weekend: {
        1: { cents: 39500, variantId: gid(52373063401774) },
        2: { cents: 64500, variantId: gid(52373063467310) },
        extra: { cents: 24500, variantId: gid(52373063532846) },
      },
    },
  },
];

export function dayTypeFor(date: Date | null | undefined): DayType {
  if (!date) return 'weekday';
  const d = date.getDay();
  return d === 0 || d === 6 ? 'weekend' : 'weekday';
}

export function mobileRate(tier: MobileTierDef, day: DayType, key: MobileDuration | 'extra'): MobileRate {
  return tier.rates[day][key];
}

export const fmtUSD = (cents: number) =>
  `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 })}`;

export interface AddOnDef {
  id: string;
  label: string;
  priceCents: number;
  price: string;
  variantId: string;
  variantsByCharacter?: Record<string, string>;
  description: string;
  scope: Pathway[];
  characters?: string[];
}

export const CHARACTER_OPTIONS = ['Pikachu', 'Hello Kitty', 'Kuromi', 'Bluey'] as const;

export const ADDONS: AddOnDef[] = [
  { id: 'decor-private', label: 'Private Event Decorations', price: '$119', priceCents: 11900, variantId: gid(52297252798766), description: 'Tablecloths, plates/silverware/napkins, plus two balloon bouquets or a large arch.', scope: ['private'] },
  { id: 'balloon-small', label: 'Small Balloon Decoration', price: '$89', priceCents: 8900, variantId: gid(52297253814574), description: 'A cheerful balloon bouquet for your table.', scope: ['private'] },
  { id: 'decor-semi', label: 'Semi-Private Party Decorations', price: '$89', priceCents: 8900, variantId: gid(52297257287982), description: 'Tablecloth, plates/silverware/napkins, and a balloon bouquet on the table.', scope: ['semi'] },
  {
    id: 'birthday-pal',
    label: 'Birthday Pal Visit',
    price: '$89',
    priceCents: 8900,
    variantId: gid(52297270591790),
    variantsByCharacter: {
      Pikachu: gid(52297270591790),
      'Hello Kitty': gid(52297270624558),
      Kuromi: gid(52297270657326),
      Bluey: gid(52297270690094),
    },
    description: '30-minute costumed character meet-and-greet. Availability limited — reach out to confirm.',
    scope: ['private', 'semi'],
    characters: [...CHARACTER_OPTIONS],
  },
  { id: 'xl-plushie', label: 'XL Plushie', price: '$89', priceCents: 8900, variantId: gid(52297272557870), description: "An XL plushie of the celebrant's choice (19-plushie trade-in value or smaller).", scope: ['private', 'semi'] },
  { id: 'photographer', label: 'Event Photographer', price: '$79 / hr', priceCents: 7900, variantId: gid(52297274818862), description: 'On-staff photographer for one hour to capture the celebration.', scope: ['private', 'semi'] },
  { id: 'extra-hour', label: 'Extra Hour', price: '$145', priceCents: 14500, variantId: gid(52297302540590), description: 'Add another hour to your rental.', scope: [] },
  { id: 'plush-refill', label: 'Plushie Refill', price: '$200', priceCents: 20000, variantId: gid(52297306538286), description: 'Refill the machine with fresh plushies.', scope: ['rental', 'mobile'] },
  { id: 'extra-machine', label: 'Additional Machine', price: '$245', priceCents: 24500, variantId: gid(52297315746094), description: 'Add a second claw machine.', scope: ['rental'] },
];

export const DELIVERY_SURCHARGE_VARIANT = gid(52297332719918);
export const DELIVERY_PER_MILE_CENTS = 300;
export const FREE_DELIVERY_MILES = 20;

export interface DeliveryRule {
  baseCents: number;
  baseVariantId: string;
  freeMiles: number;
  perMileCents: number;
}

/** Delivery pricing depends on what's being delivered. */
export function deliveryRuleFor(pathway: Pathway | null, machine: MachineDef | null): DeliveryRule {
  if (pathway === 'rental' && machine) {
    return {
      baseCents: machine.deliveryBaseCents,
      baseVariantId: machine.deliveryBaseVariantId,
      freeMiles: machine.freeMiles,
      perMileCents: DELIVERY_PER_MILE_CENTS,
    };
  }
  return {
    baseCents: 0,
    baseVariantId: '',
    freeMiles: FREE_DELIVERY_MILES,
    perMileCents: DELIVERY_PER_MILE_CENTS,
  };
}

export function deliveryCentsFor(rule: DeliveryRule, miles: number): number {
  const billable = Math.max(0, Math.ceil(miles - rule.freeMiles));
  return rule.baseCents + billable * rule.perMileCents;
}

// Any auto-quoted distance beyond this cap forces a "call to confirm" gate
// instead of proceeding to checkout. Tunable.
export const SERVICE_AREA_CAP_MILES = 60;
// Multiplier applied to straight-line ZIP-centroid distance to approximate
// driving miles. Tunable.
export const ROAD_FACTOR = 1.3;

export function addonsFor(pathway: Pathway): AddOnDef[] {
  return ADDONS.filter((a) => a.scope.includes(pathway));
}
