import type { ShopifyProduct } from '@/lib/shopify';

const TEE_ROWS = [
  { size: 'S', chest: '34–36', length: '28' },
  { size: 'M', chest: '38–40', length: '29' },
  { size: 'L', chest: '42–44', length: '30' },
  { size: 'XL', chest: '46–48', length: '31' },
  { size: '2XL', chest: '50–52', length: '32' },
  { size: '3XL', chest: '54–56', length: '33' },
];

const APPAREL_ROWS = [
  { size: 'S', bust: '34–35', waist: '27–28', hip: '37–38' },
  { size: 'M', bust: '36–37', waist: '29–30', hip: '39–40' },
  { size: 'L', bust: '38–40', waist: '31–33', hip: '41–43' },
  { size: 'XL', bust: '41–43', waist: '34–36', hip: '44–46' },
  { size: 'XXL', bust: '44–46', waist: '37–39', hip: '47–49' },
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
        {tee ? 'Unisex Tee Size Chart (Gildan, inches)' : 'US Apparel Size Chart (inches)'}
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-base font-body">
          <thead>
            <tr className="text-left border-b-2 border-klawsome-navy/30">
              {tee ? (
                <>
                  <th className="py-1.5 pr-3 font-heading">Size</th>
                  <th className="py-1.5 pr-3 font-heading">Chest</th>
                  <th className="py-1.5 font-heading">Body length</th>
                </>
              ) : (
                <>
                  <th className="py-1.5 pr-3 font-heading">Size</th>
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
                    <td className="py-1.5 pr-3">{r.chest}</td>
                    <td className="py-1.5">{r.length}</td>
                  </tr>
                ))
              : APPAREL_ROWS.map((r) => (
                  <tr key={r.size} className="border-b border-klawsome-navy/15 last:border-0">
                    <td className="py-1.5 pr-3 font-bold">{r.size}</td>
                    <td className="py-1.5 pr-3">{r.bust}</td>
                    <td className="py-1.5 pr-3">{r.waist}</td>
                    <td className="py-1.5">{r.hip}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm text-klawsome-navy/70 font-body">
        Measure relaxed, under the arms across the fullest part of the chest. Garment may vary ±1″.
      </p>
    </div>
  );
};