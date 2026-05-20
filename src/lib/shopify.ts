import { toast } from 'sonner';

export const SHOPIFY_API_VERSION = '2025-07';
export const SHOPIFY_STORE_PERMANENT_DOMAIN = 'u2riqy-et.myshopify.com';
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = '8b6c8354422d77257ea241cbd0748281';

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
  image?: { url: string; altText: string | null } | null;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType: string;
    tags: string[];
    vendor: string;
    createdAt: string;
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    images: { edges: Array<{ node: ShopifyImage }> };
    variants: { edges: Array<{ node: ShopifyVariant }> };
    options: Array<{ name: string; values: string[] }>;
  };
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error('Shopify: Payment required', {
      description: 'Shopify API access requires an active Shopify billing plan.',
    });
    return null;
  }

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  if (data.errors) throw new Error(`Shopify: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  return data;
}

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          productType
          tags
          vendor
          createdAt
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 50) { edges { node { url altText } } }
          variants(first: 100) {
            edges {
              node {
                id
                title
                price { amount currencyCode }
                availableForSale
                selectedOptions { name value }
                image { url altText }
              }
            }
          }
          options { name values }
        }
      }
    }
  }
`;

export function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set('channel', 'online_store');
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

/**
 * Heuristic categorization since store products are all type "Figurines".
 * Matches against title + tags + productType.
 */
export interface CategoryDef {
  id: string;
  label: string;
  emoji: string;
  match: (p: ShopifyProduct['node']) => boolean;
}

const has = (p: ShopifyProduct['node'], words: string[]) => {
  const hay = `${p.title} ${p.tags.join(' ')} ${p.productType} ${p.vendor}`.toLowerCase();
  return words.some((w) => hay.includes(w.toLowerCase()));
};

export const CATEGORIES: CategoryDef[] = [
  { id: 'figurines', label: 'Figurines', emoji: '🗿', match: (p) => has(p, ['figurine']) || p.productType.toLowerCase() === 'figurines' },
  { id: 'zodiac', label: 'Zodiac', emoji: '✨', match: (p) => has(p, ['zodiac', 'aries', 'taurus', 'gemini', 'leo', 'lunar']) },
  { id: 'pokemon', label: 'Pokémon Inspired', emoji: '⚡', match: (p) => has(p, ['pokemon', 'eevee', 'eeveelution', 'glaceon', 'jolteon', 'umbreon', 'flareon', 'flareon', 'fire fox']) },
  { id: 'plushies', label: 'Plushies', emoji: '🧸', match: (p) => has(p, ['plush', 'plushie']) },
  { id: 'collectibles', label: 'Collectibles', emoji: '💎', match: (p) => has(p, ['collectible', 'charm']) },
];

export type SortMode = 'most-popular' | 'newest' | 'price-low' | 'price-high';

export const SORT_TABS: { id: SortMode; label: string }[] = [
  { id: 'most-popular', label: 'Most Popular' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-low', label: 'Price: Low → High' },
  { id: 'price-high', label: 'Price: High → Low' },
];

export function shopifySortVars(mode: SortMode): { sortKey: string; reverse: boolean } {
  switch (mode) {
    case 'newest':
      return { sortKey: 'CREATED_AT', reverse: true };
    case 'price-low':
      return { sortKey: 'PRICE', reverse: false };
    case 'price-high':
      return { sortKey: 'PRICE', reverse: true };
    case 'most-popular':
    default:
      return { sortKey: 'BEST_SELLING', reverse: false };
  }
}