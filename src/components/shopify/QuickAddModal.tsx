import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus, Ruler, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LottieAccent from '@/components/LottieAccent';
import { useCartStore } from '@/stores/cartStore';
import type { ShopifyProduct } from '@/lib/shopify';
import { toast } from 'sonner';
import { SizeChart, productNeedsSizeChart } from './SizeChart';

interface Props {
  product: ShopifyProduct;
  open: boolean;
  onClose: () => void;
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

export const QuickAddModal = ({ product, open, onClose }: Props) => {
  const node = product.node;
  const images = node.images.edges.map((e) => e.node);
  const variants = node.variants.edges.map((e) => e.node);

  const firstAvailable = variants.find((v) => v.availableForSale) ?? variants[0];
  const initialOptions = useMemo(() => {
    const map: Record<string, string> = {};
    firstAvailable?.selectedOptions.forEach((o) => (map[o.name] = o.value));
    return map;
  }, [firstAvailable]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(initialOptions);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [showSize, setShowSize] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    if (open) {
      setSelectedOptions(initialOptions);
      setImgIdx(0);
      setQty(1);
      setShowSize(false);
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

  if (!open) return null;

  const price = matchedVariant?.price ?? variants[0]?.price;
  const available = matchedVariant?.availableForSale ?? false;
  const needsSizeChart = productNeedsSizeChart(node);

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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${node.title} quick add`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-klawsome-navy/85 backdrop-blur-xl" />

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
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-kawaii bg-white/15 backdrop-blur-2xl border border-white/25 shadow-2xl animate-scale-in"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-md flex items-center justify-center text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/10 border border-white/20">
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
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur flex items-center justify-center text-foreground"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImg}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur flex items-center justify-center text-foreground"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                      i === imgIdx ? 'border-klawsome-yellow' : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="text-white flex flex-col">
            <h2 className="font-heading font-bold text-2xl md:text-3xl">{node.title}</h2>
            <p className="mt-2 font-heading font-bold text-2xl text-klawsome-yellow">
              {price ? `$${parseFloat(price.amount).toFixed(2)}` : '—'}
            </p>

            {node.description && (
              <p className="mt-4 text-sm text-white/85 font-body whitespace-pre-line max-h-40 overflow-y-auto pr-2">
                {node.description}
              </p>
            )}

            {/* Option pickers */}
            <div className="mt-5 space-y-4">
              {node.options.map((opt) => {
                if (opt.values.length <= 1 && opt.values[0]?.toLowerCase() === 'default title') return null;
                return (
                  <div key={opt.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-heading font-bold text-sm">
                        {opt.name}: <span className="text-white/80 font-body font-normal">{selectedOptions[opt.name]}</span>
                      </span>
                      {opt.name.toLowerCase() === 'size' && needsSizeChart && (
                        <button
                          onClick={() => setShowSize((s) => !s)}
                          className="text-xs font-heading font-bold text-klawsome-yellow hover:underline flex items-center gap-1"
                        >
                          <Ruler className="w-3 h-3" /> Size chart
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
                            className={`px-3 py-1.5 rounded-full text-xs font-heading font-bold border transition ${
                              active
                                ? 'bg-klawsome-yellow text-foreground border-klawsome-yellow'
                                : 'bg-white/15 text-white border-white/30 hover:bg-white/25'
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
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center bg-white/15 border border-white/30 rounded-full">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/15 rounded-l-full"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-heading font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/15 rounded-r-full"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button
                onClick={handleAdd}
                disabled={!matchedVariant || !available || isLoading}
                className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-bold"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : !available ? (
                  'Sold out'
                ) : (
                  'Add to cart'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};