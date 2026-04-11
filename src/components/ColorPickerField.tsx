import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';

interface ColorPickerFieldProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const BRAND_COLORS = [
  { name: 'Navy', value: 'hsl(216, 50%, 28%)' },
  { name: 'Red', value: 'hsl(351, 76%, 62%)' },
  { name: 'Yellow', value: 'hsl(50, 84%, 70%)' },
  { name: 'Baby Blue', value: 'hsl(190, 75%, 91%)' },
  { name: 'Baby Pink', value: 'hsl(330, 70%, 92%)' },
  { name: 'White', value: '#ffffff' },
  { name: 'Off-White', value: '#f8f8f6' },
  { name: 'Light Grey', value: '#f0f0f0' },
  { name: 'Mid Grey', value: '#9ca3af' },
  { name: 'Dark', value: '#1a1a2e' },
  { name: 'Black', value: '#0a0a0a' },
  { name: 'None', value: '' },
];

const ColorPickerField = ({ value, onChange, label }: ColorPickerFieldProps) => {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="space-y-1.5">
      {label && <label className="text-white/60 text-xs font-heading">{label}</label>}
      <div className="flex flex-wrap gap-1.5">
        {BRAND_COLORS.map((c) => {
          const isSelected = value === c.value;
          const isEmpty = c.value === '';
          return (
            <button
              key={c.name}
              type="button"
              title={c.name}
              onClick={() => onChange(c.value)}
              className={`w-7 h-7 rounded-lg border-2 transition-all flex items-center justify-center ${
                isSelected ? 'border-klawsome-yellow scale-110 ring-1 ring-klawsome-yellow/50' : 'border-white/20 hover:border-white/40'
              } ${isEmpty ? 'bg-transparent' : ''}`}
              style={isEmpty ? { background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 10px 10px' } : { backgroundColor: c.value }}
            >
              {isSelected && <Check className="w-3.5 h-3.5" style={{ color: isLightColor(c.value) ? '#1a1a2e' : '#fff' }} />}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="w-7 h-7 rounded-lg border-2 border-dashed border-white/30 hover:border-white/50 text-white/50 text-xs font-bold flex items-center justify-center"
          title="Custom color"
        >
          #
        </button>
      </div>
      {showCustom && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#hex or hsl(...)"
          className="bg-white/10 border-white/20 text-white text-xs h-8 mt-1"
        />
      )}
    </div>
  );
};

/** Quick luminance check to decide check-mark color */
function isLightColor(color: string): boolean {
  if (!color) return true;
  // Parse hex
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150;
  }
  // Parse hsl
  const match = color.match(/hsl\(\s*[\d.]+\s*,\s*[\d.]+%?\s*,\s*([\d.]+)%?\s*\)/);
  if (match) return parseFloat(match[1]) > 55;
  return true;
}

export { isLightColor };
export default ColorPickerField;
