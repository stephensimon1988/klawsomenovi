import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus, Ruler, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LottieAccent from '@/components/LottieAccent';
import { useCartStore } from '@/stores/cartStore';
import type { ShopifyProduct } from '@/lib/shopify';
import { toast } from 'sonner';
import { SizeChart, productNeedsSizeChart } from './SizeChart';

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    // Treat block-level closes and <br> as paragraph breaks
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\/\s*(p|div|li|h[1-6]|ul|ol|blockquote)\s*>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');
}

function autoParagraph(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  // Honor existing paragraph breaks first
  const byBreaks = trimmed.split(/\n\s*\n+/).map((s) => s.trim()).filter(Boolean);
  const out: string[] = [];
  for (const chunk of byBreaks) {
    if (chunk.length <= 280) {
      out.push(chunk);
      continue;
    }
    // Split into sentences, group every 2
    const sentences = chunk.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? [chunk];
    for (let i = 0; i < sentences.length; i += 2) {
      out.push(sentences.slice(i, i + 2).join('').trim());
    }
  }
  return out;
}

interface Props {
  product: ShopifyProduct;
  open: boolean;
  onClose: () => void;
  initialVariantId?: string;
}

const STAR_POSITIONS = [
  { top: '6%', left: '4%', size: 70, delay: 0 },
  { top: '12%', right: '8%', size: 90, delay: 0.6 },
  { top: '60%', left: '2%', size: 60, delay: 1.2 },
  { bottom: '8%', left: '15%', size: 80, delay: 0.3 },
  { bottom: '12%', right: '6%', size: 100, delay: 0.9 },
  { top: '40%', right: '3%', size: 55, delay: 1.5 },
  { top: '78%', right: '22%', size: 65, delay: 0.4 },
  { top: '25%', left: '40%', size: 50, delay: 1.1 },
];

export const QuickAddModal = ({ product, open, onClose, initialVariantId }: Props) => {
  const node = product.node;
  const images = node.images.edges.map((e) => e.node);
  const variants = node.variants.edges.map((e) => e.node);

  const seedVariant =
    (initialVariantId && variants.find((v) => v.id === initialVariantId)) ||
    variants.find((v) => v.availableForSale) ||
    variants[0];
  const initialOptions = useMemo(() => {
    const map: Record<string, string> = {};
    seedVariant?.selectedOptions.forEach((o) => (map[o.name] = o.value));
    return map;
  }, [seedVariant]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(initialOptions);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [showSize, setShowSize] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const lastSyncedVariantId = useRef<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedOptions(initialOptions);
      setImgIdx(0);
      setQty(1);
      setShowSize(false);
      lastSyncedVariantId.current = null;
    }
  }, [open, initialOptions]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', handler);
    };
  }, [open, onClose]);

  const matchedVariant = useMemo(() => {
    return variants.find((v) =>
      v.selectedOptions.every((o) => selectedOptions[o.name] === o.value),
    );
  }, [variants, selectedOptions]);

  // Sync gallery image to matched variant's image ONLY when the variant actually changes
  // (i.e. user picked a different option pill). Manual thumbnail clicks should stick.
  useEffect(() => {
    const variantId = matchedVariant?.id ?? null;
    if (variantId === lastSyncedVariantId.current) return;
    lastSyncedVariantId.current = variantId;
    const variantImgUrl = matchedVariant?.image?.url;
    if (!variantImgUrl) return;
    if (images[imgIdx]?.url === variantImgUrl) return;
    const idx = images.findIndex((i) => i.url === variantImgUrl);
    if (idx >= 0 && idx !== imgIdx) setImgIdx(idx);
  }, [matchedVariant, images]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const price = matchedVariant?.price ?? variants[0]?.price;
  const available = matchedVariant?.availableForSale ?? false;
  const needsSizeChart = productNeedsSizeChart(node);

  const isGiftCardProduct =
    node.productType.toLowerCase() === 'gift cards' ||
    `${node.title} ${node.tags.join(' ')} ${node.productType}`.toLowerCase().includes('gift card');

  const handleAdd = async () => {
    if (!matchedVariant) {
      toast.error('Pick a variant first', { position: 'top-center' });
      return;
    }
    await addItem({
      product,
      variantId: matchedVariant.id,
      variantTitle: matchedVariant.title,
      price: matchedVariant.price,
      quantity: qty,
      selectedOptions: matchedVariant.selectedOptions,
    });
    toast.success(`Added ${qty} × ${node.title} to cart!`, { position: 'top-center' });
  };

  const nextImg = () => setImgIdx((i) => (i + 1) % Math.max(images.length, 1));
  const prevImg = () => setImgIdx((i) => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));

  // When a gallery image is selected, also switch to the variant that uses that image (if any)
  const selectImage = (i: number) => {
    setImgIdx(i);
    const url = images[i]?.url;
    if (!url) return;
    const matching = variants.find((v) => v.image?.url === url);
    if (matching) {
      const next: Record<string, string> = { ...selectedOptions };
      matching.selectedOptions.forEach((o) => (next[o.name] = o.value));
      setSelectedOptions(next);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${node.title} quick add`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-klawsome-navy/70 backdrop-blur-xl" />

      {/* Sprinkled animated stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STAR_POSITIONS.map((p, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              top: p.top,
              left: p.left,
              right: p.right,
              bottom: p.bottom,
              animationDelay: `${p.delay}s`,
              animationDuration: '3s',
            }}
          >
            <LottieAccent type={i % 2 === 0 ? 'star' : 'sparkle'} size={p.size} />
          </div>
        ))}
      </div>

      {/* Modal panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-kawaii bg-klawsome-baby-blue/85 backdrop-blur-2xl border-2 border-white/60 shadow-2xl animate-scale-in"
      >
        {/* Sprinkled stars inside modal */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-kawaii">
          {STAR_POSITIONS.slice(0, 6).map((p, i) => (
            <div
              key={`inner-${i}`}
              className="absolute opacity-70"
              style={{
                top: p.top,
                left: p.left,
                right: p.right,
                bottom: p.bottom,
              }}
            >
              <LottieAccent type={i % 2 === 0 ? 'star' : 'sparkle'} size={Math.round(p.size * 0.7)} />
            </div>
          ))}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-klawsome-navy hover:bg-klawsome-navy/90 border-2 border-white flex items-center justify-center text-white transition-colors shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 md:p-8">
          {/* Gallery */}
          <div className="lg:row-span-2">
            {/* Single hero + thumbnail grid (all viewports) */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/40 border-2 border-white/70">
              {images[imgIdx] ? (
                <img
                  src={images[imgIdx].url}
                  alt={images[imgIdx].altText || node.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🎁</div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-klawsome-navy/90 hover:bg-klawsome-navy text-white backdrop-blur flex items-center justify-center"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImg}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-klawsome-navy/90 hover:bg-klawsome-navy text-white backdrop-blur flex items-center justify-center"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 md:grid-cols-6 gap-2">
                {images.map((img, i) => {
                  const active = i === imgIdx;
                  return (
                    <button
                      key={i}
                      onClick={() => selectImage(i)}
                      className={`aspect-square w-full rounded-xl overflow-hidden border-[3px] transition-all duration-200 ${
                        active
                          ? 'border-klawsome-navy ring-2 ring-klawsome-yellow ring-offset-2 ring-offset-klawsome-baby-blue opacity-100 scale-105 shadow-md'
                          : 'border-white/50 opacity-60 hover:opacity-100 hover:border-white'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Purchase block — sits right under the gallery on tablet/mobile */}
          <div className="text-klawsome-navy flex flex-col order-2 lg:order-none">
            <h2 className="font-heading font-bold text-4xl md:text-5xl leading-tight">{node.title}</h2>
            <p className="mt-3 font-heading font-bold text-4xl text-klawsome-navy">
              {price ? `$${parseFloat(price.amount).toFixed(2)}` : '—'}
            </p>

            {/* Option pickers */}
            <div className="mt-6 space-y-5">
              {node.options.map((opt) => {
                if (opt.values.length <= 1 && opt.values[0]?.toLowerCase() === 'default title') return null;
                return (
                  <div key={opt.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-heading font-bold text-xl text-klawsome-navy">
                        {opt.name}: <span className="text-klawsome-navy/80 font-body font-normal">{selectedOptions[opt.name]}</span>
                      </span>
                      {opt.name.toLowerCase() === 'size' && needsSizeChart && (
                        <button
                          onClick={() => setShowSize((s) => !s)}
                          className="text-base font-heading font-bold text-klawsome-navy hover:underline flex items-center gap-1"
                        >
                          <Ruler className="w-4 h-4" /> Size chart
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map((val) => {
                        const active = selectedOptions[opt.name] === val;
                        return (
                          <button
                            key={val}
                            onClick={() =>
                              setSelectedOptions((prev) => ({ ...prev, [opt.name]: val }))
                            }
                            className={`px-4 py-2 rounded-full text-base font-heading font-bold border-2 transition ${
                              active
                                ? 'bg-klawsome-navy text-white border-klawsome-navy'
                                : 'bg-white/70 text-klawsome-navy border-white hover:bg-white'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                    {opt.name.toLowerCase() === 'size' && showSize && needsSizeChart && (
                      <SizeChart node={node} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quantity + Add */}
            <div className="mt-7 flex items-center gap-3">
              <div className="flex items-center bg-white/70 border-2 border-white rounded-full">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-12 h-12 flex items-center justify-center text-klawsome-navy hover:bg-white rounded-l-full"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-heading font-bold text-xl text-klawsome-navy">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-12 h-12 flex items-center justify-center text-klawsome-navy hover:bg-white rounded-r-full"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <Button size="cta"
                onClick={handleAdd}
                disabled={!matchedVariant || !available || isLoading}
                className="flex-1 bg-klawsome-navy hover:bg-klawsome-navy/90 text-white font-heading font-bold"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : !available ? (
                  'Sold out'
                ) : (
                  'Add to cart'
                )}
              </Button>
            </div>
          </div>

          {/* Description — bottom on tablet/mobile, right column below purchase on desktop */}
          {isGiftCardProduct ? (
            <div className="order-3 lg:order-none text-klawsome-navy">
              <h3 className="font-heading font-bold text-xl mb-3">Gift Card Guide</h3>
              <div className="text-lg text-klawsome-navy/90 font-body">
                <p className="mb-3">🎮 $30 – Great for a casual visit or one child</p>
                <p className="mb-3">👫 $50 – A special outing for one child with a generous plushy amount</p>
                <p className="mb-3">🎉 $100 – Best for families or a big solo birthday occasion</p>
                <p className="mb-0">🎁 $250 – Great for super fans, birthdays, or gifting</p>
              </div>
            </div>
          ) : node.descriptionHtml || node.description ? (
            <div className="order-3 lg:order-none text-klawsome-navy">
              <div className="text-lg text-klawsome-navy/90 font-body">
                {autoParagraph(
                  node.descriptionHtml ? htmlToText(node.descriptionHtml) : node.description,
                ).map((p, i) => (
                  <p key={i} className="mb-3 last:mb-0">{p}</p>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};