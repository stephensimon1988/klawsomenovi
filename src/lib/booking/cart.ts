import { formatCheckoutUrl, storefrontApiRequest } from '@/lib/shopify';
import { DELIVERY_SURCHARGE_VARIANT, type DeliveryRule } from './catalog';

export interface CartAttribute { key: string; value: string }
export interface CartLine {
  merchandiseId: string;
  quantity: number;
  attributes?: CartAttribute[];
}

const CART_CREATE = `mutation cartCreate($input: CartInput!) {
  cartCreate(input: $input) {
    cart { id checkoutUrl cost { subtotalAmount { amount currencyCode } } }
    userErrors { field message }
  }
}`;

export async function createBookingCart(params: {
  lines: CartLine[];
  attributes: CartAttribute[];
  buyerIdentity?: { email?: string; phone?: string };
}): Promise<{ cartId: string; checkoutUrl: string; subtotalCents: number | null } | { error: string }> {
  const input: Record<string, unknown> = {
    lines: params.lines,
    attributes: params.attributes,
    note: `Booking ${params.attributes.find((a) => a.key === 'booking_ref')?.value ?? ''}`.trim(),
  };
  if (params.buyerIdentity) input.buyerIdentity = params.buyerIdentity;

  const data = await storefrontApiRequest(CART_CREATE, { input });
  if (!data) return { error: 'Shopify request failed' };
  const errs = data?.data?.cartCreate?.userErrors || [];
  if (errs.length) return { error: errs.map((e: { message: string }) => e.message).join(', ') };
  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return { error: 'No checkout URL returned' };
  const amount = cart?.cost?.subtotalAmount?.amount;
  return {
    cartId: cart.id,
    checkoutUrl: formatCheckoutUrl(cart.checkoutUrl),
    subtotalCents: amount != null ? Math.round(Number(amount) * 100) : null,
  };
}

/** Delivery lines for a quoted distance: an optional base fee plus per-mile surcharge. */
export function deliveryLines(miles: number, rule: DeliveryRule): CartLine[] {
  const lines: CartLine[] = [];
  if (rule.baseCents > 0 && rule.baseVariantId) {
    lines.push({ merchandiseId: rule.baseVariantId, quantity: 1 });
  }
  const billable = Math.max(0, Math.ceil(miles - rule.freeMiles));
  if (billable > 0) {
    lines.push({
      merchandiseId: rule.perMileVariantId || DELIVERY_SURCHARGE_VARIANT,
      quantity: billable,
    });
  }
  return lines;
}


export function generateBookingRef(): string {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(2, 12);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KLW-${stamp}-${rand}`;
}
