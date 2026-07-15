import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Loader2, Shuffle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { CATEGORIES, PRODUCTS_QUERY, SORT_TABS, shopifySortVars, storefrontApiRequest, } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';
import { QuickAddModal } from './QuickAddModal';
function isGiftCard(n) {
    const hay = `${n.title} ${n.tags.join(' ')} ${n.productType}`.toLowerCase();
    return n.productType.toLowerCase() === 'gift cards' || hay.includes('gift card');
}
// /store is for physical goods + gift cards only. Filter out any party /
// event / booking products (packages, add-ons, deposits, etc.).
function isPartyProduct(n) {
    const hay = `${n.title} ${n.tags.join(' ')} ${n.productType} ${n.vendor}`.toLowerCase();
    if (hay.includes('gift card'))
        return false;
    return [
        'party',
        'birthday',
        'event',
        'booking',
        'reservation',
        'private rental',
        'semi-private',
        'package',
        'deposit',
        'add-on',
        'add on',
    ].some((w) => hay.includes(w));
}
async function fetchProducts(sort) {
    const { sortKey, reverse } = shopifySortVars(sort);
    const data = await storefrontApiRequest(PRODUCTS_QUERY, {
        first: 50,
        sortKey,
        reverse,
    });
    if (!data)
        return [];
    const edges = data?.data?.products?.edges || [];
    return groupEeveelutions(edges.filter((p) => !isPartyProduct(p.node)));
}
// Canonical Eeveelution order so Vaporeon always sits next to its siblings,
// regardless of which sort tab is active.
const EEVEE_ORDER = ['eevee', 'vaporeon', 'jolteon', 'flareon', 'espeon', 'umbreon', 'leafeon', 'glaceon', 'sylveon'];
const EEVEE_RE = /eevee|vaporeon|jolteon|flareon|espeon|umbreon|leafeon|glaceon|sylveon/i;
const PRINTED_3D_RE = /3d printed/i;
function eeveeRank(p) {
    const hay = `${p.node.title} ${p.node.tags.join(' ')}`.toLowerCase();
    for (let i = 0; i < EEVEE_ORDER.length; i++) {
        if (hay.includes(EEVEE_ORDER[i]))
            return i;
    }
    return 999;
}
function isEevee(p) {
    return EEVEE_RE.test(`${p.node.title} ${p.node.tags.join(' ')}`);
}
function is3dPrintedEevee(p) {
    return isEevee(p) && PRINTED_3D_RE.test(`${p.node.title} ${p.node.tags.join(' ')}`);
}
function groupEeveelutions(edges) {
    const firstIdx = edges.findIndex(isEevee);
    if (firstIdx === -1)
        return edges;
    const threeDeeEevees = edges.filter(is3dPrintedEevee).sort((a, b) => eeveeRank(a) - eeveeRank(b));
    const non3dEevees = edges
        .filter((p) => isEevee(p) && !is3dPrintedEevee(p))
        .sort((a, b) => eeveeRank(a) - eeveeRank(b));
    const rest = edges.filter((p) => !isEevee(p));
    // Keep non-3D Eeveelutions grouped at their natural position, but move the
    // 3D printed Eeveelutions to the very end of the list.
    return [...rest.slice(0, firstIdx), ...non3dEevees, ...rest.slice(firstIdx), ...threeDeeEevees];
}
const TAB_ACCENTS = {
    'most-popular': 'hsl(var(--primary))',
    newest: 'hsl(var(--klawsome-yellow))',
    'price-low': 'hsl(var(--klawsome-baby-blue))',
    'price-high': 'hsl(var(--klawsome-baby-pink))',
};
export const Storefront = () => {
    const [sort, setSort] = useState('most-popular');
    const [categoryId, setCategoryId] = useState(null);
    const [interacted, setInteracted] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const autoOpenHandle = searchParams.get('product');
    const { data: products = [], isLoading, error } = useQuery({
        queryKey: ['shopify-storefront', sort],
        queryFn: () => fetchProducts(sort),
    });
    // Determine which categories actually contain products (hide empty ones)
    const populatedCategories = useMemo(() => {
        return CATEGORIES.filter((c) => products.some((p) => c.match(p.node)));
    }, [products]);
    const filtered = useMemo(() => {
        let list = products;
        if (categoryId) {
            const cat = CATEGORIES.find((c) => c.id === categoryId);
            if (cat)
                list = products.filter((p) => cat.match(p.node));
        }
        // Pin gift cards only on the initial default view (no interactions yet).
        if (!interacted && !categoryId && sort === 'most-popular') {
            const gc = list.filter((p) => isGiftCard(p.node));
            const rest = list.filter((p) => !isGiftCard(p.node));
            return [...gc, ...rest];
        }
        return list;
    }, [products, categoryId, interacted, sort]);
    const activeCategoryLabel = categoryId
        ? CATEGORIES.find((c) => c.id === categoryId)?.label
        : 'All Products';
    // Scroll the auto-open product into view once products are loaded
    useEffect(() => {
        if (!autoOpenHandle || !products.length)
            return;
        const match = products.find((p) => p.node.handle === autoOpenHandle);
        if (!match)
            return;
        const el = document.getElementById(`product-${match.node.id}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [autoOpenHandle, products]);
    const clearAutoOpen = () => {
        if (!autoOpenHandle)
            return;
        const next = new URLSearchParams(searchParams);
        next.delete('product');
        setSearchParams(next, { replace: true });
    };
    const surpriseMe = () => {
        if (!filtered.length)
            return;
        const random = filtered[Math.floor(Math.random() * filtered.length)];
        const el = document.getElementById(`product-${random.node.id}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el?.animate([
            { transform: 'scale(1)', boxShadow: '0 0 0 0 hsl(var(--primary) / 0.6)' },
            { transform: 'scale(1.03)', boxShadow: '0 0 0 12px hsl(var(--primary) / 0)' },
            { transform: 'scale(1)' },
        ], { duration: 900, easing: 'ease-out' });
    };
    return (<section className="bg-background">
      {/* Sub-menu / tab strip */}
      <div className="sticky top-20 z-30 bg-background border-b border-border">
        <div className="ds-container section-x">
          <div className="flex items-stretch gap-0 overflow-x-auto">
            {SORT_TABS.map((tab) => {
            const active = sort === tab.id;
            return (<button key={tab.id} onClick={() => { setInteracted(true); setSort(tab.id); }} className={`relative px-5 py-4 font-heading font-bold text-sm whitespace-nowrap transition-colors ${active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`} style={{ backgroundColor: active ? `${TAB_ACCENTS[tab.id]}` : undefined, color: active ? 'hsl(var(--primary-foreground))' : undefined }}>
                  {tab.label}
                  <span className="absolute left-0 right-0 bottom-0 h-1" style={{ backgroundColor: TAB_ACCENTS[tab.id] }}/>
                </button>);
        })}

            <div className="ml-auto flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-5 py-4 font-heading font-bold text-sm text-foreground hover:bg-secondary/60 transition-colors">
                    <ShoppingBag className="w-4 h-4"/>
                    Categories
                    <ChevronDown className="w-4 h-4"/>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                  <DropdownMenuItem onClick={() => { setInteracted(true); setCategoryId(null); }} className={`font-heading font-bold ${!categoryId ? 'bg-secondary/60' : ''}`}>
                    ✨ All Products
                  </DropdownMenuItem>
                  {populatedCategories.map((c) => (<DropdownMenuItem key={c.id} onClick={() => { setInteracted(true); setCategoryId(c.id); }} className={`font-heading font-bold ${categoryId === c.id ? 'bg-secondary/60' : ''}`}>
                      <span className="mr-2">{c.emoji}</span> {c.label}
                    </DropdownMenuItem>))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Action bar: Surprise Me + active category indicator */}
      <div className="ds-container section-x py-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <Button onClick={() => { setInteracted(true); surpriseMe(); }} className="rounded-full bg-klawsome-baby-blue hover:bg-klawsome-baby-blue/80 text-foreground font-heading font-bold px-6">
            <Shuffle className="w-4 h-4 mr-2"/>
            Surprise Me!
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-body">Showing</span>
            <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm">
              {activeCategoryLabel} · {filtered.length}
            </span>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="ds-container section-x pb-20">
        {isLoading && (<div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary"/>
          </div>)}
        {error && (<div className="text-center py-10 text-muted-foreground font-body">
            Couldn't load products. Try again later! 💫
          </div>)}
        {!isLoading && filtered.length === 0 && (<div className="text-center py-20 text-muted-foreground font-body">
            No products found in this category yet 🌸
          </div>)}
        {filtered.length > 0 && (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (<ProductCard key={p.node.id} product={p} autoOpen={autoOpenHandle === p.node.handle} onAutoOpenHandled={clearAutoOpen}/>))}
          </div>)}
      </div>
    </section>);
};
const ProductCard = ({ product, autoOpen = false, onAutoOpenHandled, }) => {
    const n = product.node;
    const images = n.images.edges.map((e) => e.node);
    const variants = n.variants.edges.map((e) => e.node);
    // Initial variant = first available (matches modal behavior)
    const firstAvailable = variants.find((v) => v.availableForSale) ?? variants[0];
    const [selectedVariantId, setSelectedVariantId] = useState(firstAvailable?.id);
    const [imgIdx, setImgIdx] = useState(() => {
        const url = firstAvailable?.image?.url;
        const i = url ? images.findIndex((im) => im.url === url) : -1;
        return i >= 0 ? i : 0;
    });
    const variant = variants.find((v) => v.id === selectedVariantId) ?? firstAvailable;
    const img = images[imgIdx];
    // Show a thumbnail strip only when there's something meaningful to pick between.
    const hasMultiple = variants.length > 1 || images.length > 1;
    // True when the product has selectable variations (ignoring Shopify's implicit
    // single "Default Title" variant). When true, Add to cart must open the modal
    // so the user explicitly picks options before adding.
    const hasVariations = variants.length > 1 ||
        n.options.some((o) => o.values.length > 1 || (o.values[0]?.toLowerCase() !== 'default title' && o.values.length > 1));
    const addItem = useCartStore((s) => s.addItem);
    const isLoading = useCartStore((s) => s.isLoading);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (autoOpen) {
            setOpen(true);
            onAutoOpenHandled?.();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoOpen]);
    const handleAdd = async (e) => {
        e.stopPropagation();
        if (!variant)
            return;
        if (isGiftCard(n)) {
            window.open('https://app.squareup.com/gift/ML1R35ZH9VKRW/order', '_blank', 'noopener,noreferrer');
            return;
        }
        if (hasVariations) {
            setOpen(true);
            return;
        }
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
    const selectThumb = (i, e) => {
        e.stopPropagation();
        setImgIdx(i);
        const url = images[i]?.url;
        if (!url)
            return;
        const matching = variants.find((v) => v.image?.url === url);
        if (matching)
            setSelectedVariantId(matching.id);
    };
    const openModal = () => {
        if (isGiftCard(n)) {
            window.open('https://app.squareup.com/gift/ML1R35ZH9VKRW/order', '_blank', 'noopener,noreferrer');
            return;
        }
        setOpen(true);
    };
    // Pick a kawaii tag color based on first matching category
    const cat = CATEGORIES.find((c) => c.match(n));
    return (<>
    <div id={`product-${n.id}`} className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <button type="button" onClick={openModal} aria-label={`View details for ${n.title}`} className="img-hover aspect-square bg-secondary/40 block w-full text-left focus:outline-none focus:ring-2 focus:ring-primary cursor-zoom-in">
        {img ? (<img src={img.url} alt={img.altText || n.title} className="w-full h-full object-cover" loading="lazy"/>) : (<div className="w-full h-full flex items-center justify-center text-5xl">🎁</div>)}
      </button>
      {hasMultiple && images.length > 1 && (<div className="px-3 pt-3 flex flex-wrap gap-1.5">
          {images.map((im, i) => {
                const active = i === imgIdx;
                return (<button key={i} type="button" onClick={(e) => selectThumb(i, e)} aria-label={`Show variation ${i + 1}`} className={`w-11 h-11 rounded-lg overflow-hidden border-2 transition ${active
                        ? 'border-klawsome-navy ring-2 ring-klawsome-yellow ring-offset-1'
                        : 'border-border opacity-70 hover:opacity-100 hover:border-foreground'}`}>
                <img src={im.url} alt="" className="w-full h-full object-cover"/>
              </button>);
            })}
        </div>)}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-base text-foreground line-clamp-2 min-h-[2.75rem]">
          {n.title}
        </h3>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="font-heading font-bold text-lg text-primary">
            {isGiftCard(n) && n.priceRange.maxVariantPrice?.amount
            ? `$${parseFloat(n.priceRange.minVariantPrice.amount).toFixed(0)} - $${parseFloat(n.priceRange.maxVariantPrice.amount).toFixed(0)}`
            : `$${parseFloat(variant?.price.amount ?? n.priceRange.minVariantPrice.amount).toFixed(2)}`}
          </span>
          <Button size="sm" disabled={!variant || isLoading || !variant.availableForSale} onClick={handleAdd} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-bold text-xs">
            {variant?.availableForSale === false ? 'Sold out' : 'Add to cart'}
          </Button>
        </div>
      </div>
    </div>
    <QuickAddModal product={product} open={open} onClose={() => setOpen(false)} initialVariantId={selectedVariantId}/>
    </>);
};
