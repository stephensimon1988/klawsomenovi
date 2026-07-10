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
  { id: 'rental', label: 'Rent a Klaw Machine', subtitle: 'We bring the arcade to you.', price: 'from $445', duration: '1 or 2 hours', variantId: '', needsDelivery: true },
  { id: 'mobile', label: 'Book Klawsome Mobile', subtitle: 'Mobile claw machine arcade for your event.', price: 'from $445', duration: '1hr / 2hr / all-day', variantId: '', needsDelivery: true },
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

export const RENTAL_PACKAGES: PackageOption[] = [
  { id: 'rent-1hr', label: '1-Hour Party Package', price: '$445', priceCents: 44500, variantId: gid(52297295561006), description: '40 plushies included OR your supplied product (5–10 in, 0–5 lb).' },
  { id: 'rent-2hr', label: '2-Hour Extended Party', price: '$645', priceCents: 64500, variantId: gid(52297298411822), description: '40 regular-size plushies (based on availability) OR your product.' },
];

export const MOBILE_PACKAGES: PackageOption[] = [
  { id: 'mobile-1hr', label: '1 Hour', price: '$445', priceCents: 44500, variantId: gid(52297329475886) },
  { id: 'mobile-2hr', label: '2 Hours', price: '$645', priceCents: 64500, variantId: gid(52297329508654) },
  { id: 'mobile-day', label: 'All Day (Unlimited)', price: '$1495', priceCents: 149500, variantId: gid(52297329541422) },
];

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
  { id: 'extra-hour', label: 'Extra Hour', price: '$145', priceCents: 14500, variantId: gid(52297302540590), description: 'Add another hour to your rental.', scope: ['rental', 'mobile'] },
  { id: 'plush-refill', label: 'Plushie Refill', price: '$200', priceCents: 20000, variantId: gid(52297306538286), description: 'Refill the machine with fresh plushies.', scope: ['rental', 'mobile'] },
  { id: 'extra-machine', label: 'Additional Machine', price: '$245', priceCents: 24500, variantId: gid(52297315746094), description: 'Add a second claw machine.', scope: ['rental'] },
];

export const DELIVERY_SURCHARGE_VARIANT = gid(52297332719918);
export const DELIVERY_PER_MILE_CENTS = 300;
export const FREE_DELIVERY_MILES = 20;

export function addonsFor(pathway: Pathway): AddOnDef[] {
  return ADDONS.filter((a) => a.scope.includes(pathway));
}
