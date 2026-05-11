import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Loader2, Shuffle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CATEGORIES,
  PRODUCTS_QUERY,
  SORT_TABS,
  shopifySortVars,
  storefrontApiRequest,
  type ShopifyProduct,
  type SortMode,
} from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { CartDrawer } from './CartDrawer';
import { toast } from 'sonner';

async function fetchProducts(sort: SortMode): Promise<ShopifyProduct[]> {
  const { sortKey, reverse } = shopifySortVars(sort);
  const data = await storefrontApiRequest(PRODUCTS_QUERY, {
    first: 50,
    sortKey,
    reverse,
  });
  if (!data) return [];
  return data?.data?.products?.edges || [];
}

const TAB_ACCENTS: Record<SortMode, string> = {
  'most-popular': 'hsl(var(--primary))',
  newest: 'hsl(var(--klawsome-yellow))',
  'price-low': 'hsl(var(--klawsome-baby-blue))',
  'price-high': 'hsl(var(--klawsome-baby-pink))',
};

export const Storefront = () => {
  const [sort, setSort] = useState<SortMode>('most-popular');
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['shopify-storefront', sort],
    queryFn: () => fetchProducts(sort),
  });

  // Determine which categories actually contain products (hide empty ones)
  const populatedCategories = useMemo(() => {
    return CATEGORIES.filter((c) => products.some((p) => c.match(p.node)));
  }, [products]);

  const filtered = useMemo(() => {
    if (!categoryId) return products;
    const cat = CATEGORIES.find((c) => c.id === categoryId);
    if (!cat) return products;
    return products.filter((p) => cat.match(p.node));
  }, [products, categoryId]);

  const activeCategoryLabel = categoryId
    ? CATEGORIES.find((c) => c.id === categoryId)?.label
    : 'All Products';

  const surpriseMe = () => {
    if (!filtered.length) return;
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const el = document.getElementById(`product-${random.node.id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el?.animate(
      [
        { transform: 'scale(1)', boxShadow: '0 0 0 0 hsl(var(--primary) / 0.6)' },
        { transform: 'scale(1.03)', boxShadow: '0 0 0 12px hsl(var(--primary) / 0)' },
        { transform: 'scale(1)' },
      ],
      { duration: 900, easing: 'ease-out' },
    );
  };

  return (
    <section className="bg-background">
      {/* Sub-menu / tab strip */}
      <div className="sticky top-20 z-30 bg-background border-b border-border">
        <div className="ds-container section-x">
          <div className="flex items-stretch gap-0 overflow-x-auto">
            {SORT_TABS.map((tab) => {
              const active = sort === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSort(tab.id)}
                  className={`relative px-5 py-4 font-heading font-bold text-sm whitespace-nowrap transition-colors ${
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  style={{ backgroundColor: active ? `${TAB_ACCENTS[tab.id]}` : undefined, color: active ? 'hsl(var(--primary-foreground))' : undefined }}
                >
                  {tab.label}
                  <span
                    className="absolute left-0 right-0 bottom-0 h-1"
                    style={{ backgroundColor: TAB_ACCENTS[tab.id] }}
                  />
                </button>
              );
            })}

            <div className="ml-auto flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-5 py-4 font-heading font-bold text-sm text-foreground hover:bg-secondary/60 transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                    Categories
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                  <DropdownMenuItem
                    onClick={() => setCategoryId(null)}
                    className={`font-heading font-bold ${!categoryId ? 'bg-secondary/60' : ''}`}
                  >
                    ✨ All Products
                  </DropdownMenuItem>
                  {populatedCategories.map((c) => (
                    <DropdownMenuItem
                      key={c.id}
                      onClick={() => setCategoryId(c.id)}
                      className={`font-heading font-bold ${categoryId === c.id ? 'bg-secondary/60' : ''}`}
                    >
                      <span className="mr-2">{c.emoji}</span> {c.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Action bar: Surprise Me + active category indicator */}
      <div className="ds-container section-x py-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <Button
            onClick={surpriseMe}
            className="rounded-full bg-klawsome-baby-blue hover:bg-klawsome-baby-blue/80 text-foreground font-heading font-bold px-6"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Surprise Me!
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-body">Showing</span>
            <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm">
              {activeCategoryLabel} · {filtered.length}
            </span>
            <CartDrawer />
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="ds-container section-x pb-20">
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        )}
        {error && (
          <div className="text-center py-10 text-muted-foreground font-body">
            Couldn't load products. Try again later! 💫
          </div>
        )}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground font-body">
            No products found in this category yet 🌸
          </div>
        )}
        {filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const ProductCard = ({ product }: { product: ShopifyProduct }) => {
  const n = product.node;
  const img = n.images.edges[0]?.node;
  const variant = n.variants.edges[0]?.node;
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success('Added to cart!', { position: 'top-center' });
  };

  // Pick a kawaii tag color based on first matching category
  const cat = CATEGORIES.find((c) => c.match(n));

  return (
    <div
      id={`product-${n.id}`}
      className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="aspect-square bg-secondary/40 overflow-hidden">
        {img ? (
          <img
            src={img.url}
            alt={img.altText || n.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🎁</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-muted-foreground font-body">#{n.id.slice(-4)}</p>
        <h3 className="font-heading font-bold text-base text-foreground mt-1 line-clamp-2 min-h-[2.75rem]">
          {n.title}
        </h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {cat && (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-klawsome-baby-blue text-foreground font-heading font-bold">
              {cat.emoji} {cat.label}
            </span>
          )}
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="font-heading font-bold text-lg text-primary">
            ${parseFloat(n.priceRange.minVariantPrice.amount).toFixed(2)}
          </span>
          <Button
            size="sm"
            disabled={!variant || isLoading || !variant.availableForSale}
            onClick={handleAdd}
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-bold text-xs"
          >
            {variant?.availableForSale === false ? 'Sold out' : 'Add to cart'}
          </Button>
        </div>
      </div>
    </div>
  );
};