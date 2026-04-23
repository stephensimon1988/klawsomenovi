/**
 * DividerAudit — dev-only homepage audit overlay.
 *
 * Walks the DOM in document order, treats every <section> and every
 * <div data-kawaii-divider> as a "band", and reports:
 *   - same-color stacking between adjacent bands (no visual separation)
 *   - divider transitions whose `from`/`to` don't match the resolved
 *     background color of the section above/below
 *
 * Toggle with the floating "Audit Dividers" button (bottom-right) or with
 * the keyboard shortcut Shift+D. Only shown in dev or when ?audit=1 is in
 * the URL.
 */
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

type Band = {
  el: HTMLElement;
  kind: 'section' | 'divider';
  label: string;
  topColor: string; // resolved rgb
  bottomColor: string;
  variant?: string;
  from?: string;
  to?: string;
};

type Issue = {
  type: 'same-color' | 'divider-mismatch';
  message: string;
  bands: Band[];
};

const KAWAII_TOKENS = ['white', 'baby-blue', 'baby-pink', 'red', 'navy'] as const;
type TokenKey = (typeof KAWAII_TOKENS)[number];

function resolveTokenColors(): Record<TokenKey, string> {
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  document.body.appendChild(probe);
  const out = {} as Record<TokenKey, string>;
  for (const t of KAWAII_TOKENS) {
    probe.style.backgroundColor = `hsl(var(--klawsome-${t}))`;
    out[t] = getComputedStyle(probe).backgroundColor;
  }
  document.body.removeChild(probe);
  return out;
}

function rgbDistance(a: string, b: string) {
  const pa = a.match(/\d+/g)?.map(Number) ?? [];
  const pb = b.match(/\d+/g)?.map(Number) ?? [];
  if (pa.length < 3 || pb.length < 3) return Infinity;
  return Math.sqrt(
    (pa[0] - pb[0]) ** 2 + (pa[1] - pb[1]) ** 2 + (pa[2] - pb[2]) ** 2,
  );
}

function nearestToken(rgb: string, map: Record<TokenKey, string>): TokenKey | 'unknown' {
  let best: TokenKey | 'unknown' = 'unknown';
  let bestD = 30; // tolerance
  for (const t of KAWAII_TOKENS) {
    const d = rgbDistance(rgb, map[t]);
    if (d < bestD) {
      bestD = d;
      best = t;
    }
  }
  return best;
}

function collectBands(root: HTMLElement, tokens: Record<TokenKey, string>): Band[] {
  const nodes = Array.from(
    root.querySelectorAll<HTMLElement>('section, [data-kawaii-divider]'),
  );
  return nodes.map((el) => {
    const isDivider = el.hasAttribute('data-kawaii-divider');
    if (isDivider) {
      const from = el.getAttribute('data-divider-from') ?? '';
      const to = el.getAttribute('data-divider-to') ?? '';
      const variant = el.getAttribute('data-divider-variant') ?? '';
      return {
        el,
        kind: 'divider' as const,
        label: `divider:${variant} ${from}→${to}`,
        topColor: tokens[from as TokenKey] ?? getComputedStyle(el).backgroundColor,
        bottomColor: tokens[to as TokenKey] ?? getComputedStyle(el).backgroundColor,
        variant,
        from,
        to,
      };
    }
    const bg = getComputedStyle(el).backgroundColor;
    const id = el.id || el.getAttribute('aria-label') || el.tagName.toLowerCase();
    return {
      el,
      kind: 'section' as const,
      label: `section#${id}`,
      topColor: bg,
      bottomColor: bg,
    };
  });
}

function audit(bands: Band[], tokens: Record<TokenKey, string>): Issue[] {
  const issues: Issue[] = [];
  for (let i = 0; i < bands.length - 1; i++) {
    const a = bands[i];
    const b = bands[i + 1];

    // Skip sections whose bg is transparent (no visible color contribution)
    const aBottom = a.bottomColor;
    const bTop = b.topColor;
    if (
      aBottom.includes('rgba(0, 0, 0, 0)') ||
      bTop.includes('rgba(0, 0, 0, 0)')
    ) {
      continue;
    }

    if (rgbDistance(aBottom, bTop) < 6) {
      issues.push({
        type: 'same-color',
        message: `${a.label} and ${b.label} share color (${nearestToken(aBottom, tokens)})`,
        bands: [a, b],
      });
    }

    // Divider-mismatch checks: if a divider sits between two sections,
    // its `from` should match section above and `to` should match section below.
    if (a.kind === 'section' && b.kind === 'divider') {
      const expected = nearestToken(a.bottomColor, tokens);
      if (expected !== 'unknown' && b.from && b.from !== expected) {
        issues.push({
          type: 'divider-mismatch',
          message: `${b.label} top is "${b.from}" but section above is "${expected}"`,
          bands: [a, b],
        });
      }
    }
    if (a.kind === 'divider' && b.kind === 'section') {
      const expected = nearestToken(b.topColor, tokens);
      if (expected !== 'unknown' && a.to && a.to !== expected) {
        issues.push({
          type: 'divider-mismatch',
          message: `${a.label} bottom is "${a.to}" but section below is "${expected}"`,
          bands: [a, b],
        });
      }
    }
  }
  return issues;
}

const DividerAudit = () => {
  const enabled = useMemo(() => {
    if (typeof window === 'undefined') return false;
    if (import.meta.env.DEV) return true;
    return new URLSearchParams(window.location.search).has('audit');
  }, []);

  const [open, setOpen] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [bandCount, setBandCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'D' || e.key === 'd')) setOpen((o) => !o);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);

  useEffect(() => {
    if (!open) {
      // clear any markers
      document
        .querySelectorAll<HTMLElement>('[data-audit-marker]')
        .forEach((n) => n.removeAttribute('data-audit-marker'));
      return;
    }
    const tokens = resolveTokenColors();
    const bands = collectBands(document.body, tokens);
    setBandCount(bands.length);
    const found = audit(bands, tokens);
    setIssues(found);
    found.forEach((iss, idx) => {
      iss.bands.forEach((b) => {
        b.el.setAttribute('data-audit-marker', iss.type);
        b.el.setAttribute('data-audit-index', String(idx + 1));
      });
    });
  }, [open]);

  if (!enabled) return null;

  return (
    <>
      {/* Highlight styles */}
      <style>{`
        [data-audit-marker="same-color"] {
          outline: 4px dashed hsl(0 90% 55%) !important;
          outline-offset: -4px;
          position: relative;
        }
        [data-audit-marker="divider-mismatch"] {
          outline: 4px dashed hsl(40 100% 50%) !important;
          outline-offset: -4px;
        }
        [data-audit-marker]::before {
          content: "⚠ #" attr(data-audit-index);
          position: absolute;
          top: 8px;
          left: 8px;
          z-index: 9999;
          background: hsl(0 0% 0% / 0.85);
          color: white;
          font-family: monospace;
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 4px;
          pointer-events: none;
        }
      `}</style>

      <div className="fixed bottom-4 right-4 z-[10000] flex flex-col items-end gap-2">
        {open && (
          <div className="w-[360px] max-h-[60vh] overflow-auto rounded-lg border border-border bg-background/95 backdrop-blur p-4 shadow-2xl text-sm">
            <div className="flex items-center justify-between mb-2">
              <strong className="font-mono">Divider Audit</strong>
              <span className="text-xs text-muted-foreground">
                {bandCount} bands · {issues.length} issues
              </span>
            </div>
            {issues.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                ✅ No same-color stacking or divider mismatches detected.
              </p>
            ) : (
              <ol className="space-y-2">
                {issues.map((iss, i) => (
                  <li
                    key={i}
                    className="text-xs leading-snug cursor-pointer hover:bg-muted rounded p-2"
                    onClick={() =>
                      iss.bands[0].el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2 align-middle"
                      style={{
                        background:
                          iss.type === 'same-color'
                            ? 'hsl(0 90% 55%)'
                            : 'hsl(40 100% 50%)',
                      }}
                    />
                    <span className="font-mono">#{i + 1}</span> {iss.message}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
        <Button
          size="sm"
          variant={open ? 'default' : 'outline'}
          onClick={() => setOpen((o) => !o)}
          className="font-mono shadow-lg"
        >
          {open ? 'Close Audit' : 'Audit Dividers'}
        </Button>
      </div>
    </>
  );
};

export default DividerAudit;