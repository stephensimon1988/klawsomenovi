import type { ShopifyProduct } from '@/lib/shopify';

const TEE_ROWS = [
  { size: 'S',   us: 'US XS',  chest: '32–34', length: '25.5' },
  { size: 'M',   us: 'US S',   chest: '34–36', length: '26.5' },
  { size: 'L',   us: 'US M',   chest: '36–38', length: '27.5' },
  { size: 'XL',  us: 'US L',   chest: '38–40', length: '28.5' },
  { size: '2XL', us: 'US XL',  chest: '40–42', length: '29.5' },
  { size: '3XL', us: 'US 2XL', chest: '42–44', length: '30.5' },
];

const APPAREL_ROWS = [
  { size: 'S',   us: 'US XS',  bust: '32–33', waist: '25–26', hip: '35–36' },
  { size: 'M',   us: 'US S',   bust: '34–35', waist: '27–28', hip: '37–38' },
  { size: 'L',   us: 'US M',   bust: '36–37', waist: '29–30', hip: '39–40' },
  { size: 'XL',  us: 'US L',   bust: '38–40', waist: '31–33', hip: '41–43' },
  { size: '2XL', us: 'US XL',  bust: '41–43', waist: '34–36', hip: '44–46' },
  { size: '3XL', us: 'US 2XL', bust: '44–46', waist: '37–39', hip: '47–49' },
];

export function productNeedsSizeChart(node: ShopifyProduct['node']): boolean {
  const hasSize = node.options.some((o) => o.name.toLowerCase() === 'size');
  if (!hasSize) return false;
  const hay = `${node.title} ${node.productType} ${node.tags.join(' ')}`.toLowerCase();
  return /apparel|shirt|tee|t-shirt|hoodie|sweat|clothing/.test(hay);
}

function isTee(node: ShopifyProduct['node']): boolean {
  const hay = `${node.title} ${node.tags.join(' ')}`.toLowerCase();
  return /\btee\b|t-shirt|tshirt/.test(hay);
}

export const SizeChart = ({ node }: { node: ShopifyProduct['node'] }) => {
  const tee = isTee(node);
  return (
    <div className="mt-3 rounded-2xl bg-white/70 backdrop-blur-xl border-2 border-white p-4 text-klawsome-navy">
      <h4 className="font-heading font-bold text-lg mb-2">
        {tee ? 'Unisex Tee Size Chart — Asian sizing (inches)' : 'Apparel Size Chart — Asian sizing (inches)'}
      </h4>
      <div className="mb-3 rounded-xl bg-klawsome-yellow/40 border-2 border-klawsome-yellow px-3 py-2 text-sm font-body text-klawsome-navy">
        ⚠️ <span className="font-bold">These shirts use Asian sizing</span> and run 1–2 sizes smaller than US sizes. We recommend sizing up — if you normally wear a US Medium, order a Large or XL.
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-base font-body">
          <thead>
            <tr className="text-left border-b-2 border-klawsome-navy/30">
              {tee ? (
                <>
                  <th className="py-1.5 pr-3 font-heading">Tag size</th>
                  <th className="py-1.5 pr-3 font-heading">US equivalent</th>
                  <th className="py-1.5 pr-3 font-heading">Chest</th>
                  <th className="py-1.5 font-heading">Body length</th>
                </>
              ) : (
                <>
                  <th className="py-1.5 pr-3 font-heading">Tag size</th>
                  <th className="py-1.5 pr-3 font-heading">US equivalent</th>
                  <th className="py-1.5 pr-3 font-heading">Bust</th>
                  <th className="py-1.5 pr-3 font-heading">Waist</th>
                  <th className="py-1.5 font-heading">Hip</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {tee
              ? TEE_ROWS.map((r) => (
                  <tr key={r.size} className="border-b border-klawsome-navy/15 last:border-0">
                    <td className="py-1.5 pr-3 font-bold">{r.size}</td>
                    <td className="py-1.5 pr-3 font-bold text-klawsome-navy/80">{r.us}</td>
                    <td className="py-1.5 pr-3">{r.chest}</td>
                    <td className="py-1.5">{r.length}</td>
                  </tr>
                ))
              : APPAREL_ROWS.map((r) => (
                  <tr key={r.size} className="border-b border-klawsome-navy/15 last:border-0">
                    <td className="py-1.5 pr-3 font-bold">{r.size}</td>
                    <td className="py-1.5 pr-3 font-bold text-klawsome-navy/80">{r.us}</td>
                    <td className="py-1.5 pr-3">{r.bust}</td>
                    <td className="py-1.5 pr-3">{r.waist}</td>
                    <td className="py-1.5">{r.hip}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm text-klawsome-navy/70 font-body">
        Measurements are the garment's finished dimensions, not body measurements. Measure a shirt you already own flat across the chest, then pick the row that matches — or size up if you're between sizes. Tolerance ±1″.
      </p>
    </div>
  );
};