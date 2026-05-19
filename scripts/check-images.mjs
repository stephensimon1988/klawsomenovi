#!/usr/bin/env node
/**
 * Build-time image reference checker & auto-fixer.
 *
 * Scans the repo for image URLs/paths, fetches each one, and when a URL
 * returns a non-OK status it tries a small set of well-known variants
 * (extension swap, %2F → /, http → https, supabase png↔webp sibling, etc.).
 * If a variant works, the source file is rewritten in place. Anything
 * that still cannot be resolved is reported and the script exits non-zero
 * (unless --no-fail is passed).
 *
 * Usage:
 *   node scripts/check-images.mjs                # check + auto-fix
 *   node scripts/check-images.mjs --dry          # check only, no writes
 *   node scripts/check-images.mjs --no-fail      # never exit non-zero
 */
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, extname, resolve, relative } from 'node:path';

const ROOT = resolve(process.cwd());
const DRY = process.argv.includes('--dry');
const NO_FAIL = process.argv.includes('--no-fail');

const SCAN_DIRS = ['src', 'public', 'index.html'];
const TEXT_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.css', '.md']);
const IMG_EXT = /\.(webp|png|jpe?g|gif|svg|avif)(\?[^\s'")]*)?/i;
const URL_RE = /(https?:\/\/[^\s'"`)<>]+?\.(?:webp|png|jpe?g|gif|svg|avif)(?:\?[^\s'"`)<>]*)?)/gi;
// also catch site-root paths like "/images/foo.webp"
const ROOT_PATH_RE = /["'`(](\/[a-zA-Z0-9_\-./%]+\.(?:webp|png|jpe?g|gif|svg|avif))["'`)]/g;

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  const st = statSync(dir);
  if (st.isFile()) { out.push(dir); return out; }
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    walk(join(dir, name), out);
  }
  return out;
}

// Collect (url, file, line) tuples
function collectReferences() {
  const refs = new Map(); // url -> [{file, isLocal}]
  const files = SCAN_DIRS.flatMap((d) => walk(resolve(ROOT, d)));
  for (const f of files) {
    const ext = extname(f).toLowerCase();
    if (!TEXT_EXT.has(ext)) continue;
    let src;
    try { src = readFileSync(f, 'utf8'); } catch { continue; }
    let m;
    URL_RE.lastIndex = 0;
    while ((m = URL_RE.exec(src))) {
      const u = m[1];
      if (!refs.has(u)) refs.set(u, []);
      refs.get(u).push({ file: f, isLocal: false });
    }
    ROOT_PATH_RE.lastIndex = 0;
    while ((m = ROOT_PATH_RE.exec(src))) {
      const u = m[1];
      if (!refs.has(u)) refs.set(u, []);
      refs.get(u).push({ file: f, isLocal: true });
    }
  }
  return refs;
}

async function fetchStatus(url) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (compatible; KlawsomeImageChecker/1.0)',
    Accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
  };
  try {
    // Use GET with Range to be cheap but compatible (HEAD is often blocked)
    const res = await fetch(url, { method: 'GET', headers: { ...headers, Range: 'bytes=0-0' } });
    return res.status;
  } catch {
    return 0;
  }
}

function checkLocal(p) {
  const fp = resolve(ROOT, 'public', p.replace(/^\//, ''));
  return existsSync(fp);
}

function* variants(url) {
  // 1. swap extension webp <-> png and add/remove query string
  const base = url.split('?')[0];
  const others = ['.webp', '.png', '.jpg', '.jpeg'];
  const cur = (base.match(/\.(webp|png|jpe?g)$/i) || [''])[0].toLowerCase();
  for (const e of others) {
    if (e === cur) continue;
    yield base.replace(/\.(webp|png|jpe?g)$/i, e);
  }
  // 2. %2F → /
  if (url.includes('%2F')) yield url.replaceAll('%2F', '/');
  // 3. strip query string
  if (url.includes('?')) yield base;
  // 4. http → https
  if (url.startsWith('http://')) yield 'https://' + url.slice(7);
}

async function findWorkingVariant(url) {
  for (const v of variants(url)) {
    const s = await fetchStatus(v);
    if (s >= 200 && s < 400) return v;
  }
  return null;
}

function replaceInFiles(oldUrl, newUrl, files) {
  const written = new Set();
  for (const { file } of files) {
    if (written.has(file)) continue;
    const src = readFileSync(file, 'utf8');
    if (!src.includes(oldUrl)) continue;
    const next = src.split(oldUrl).join(newUrl);
    if (next !== src) {
      writeFileSync(file, next);
      written.add(file);
    }
  }
  return [...written];
}

async function main() {
  const refs = collectReferences();
  console.log(`🔎 Scanned ${refs.size} unique image references`);

  const broken = [];
  const fixed = [];
  const unfixable = [];
  let i = 0;

  const entries = [...refs.entries()];
  // simple concurrency pool
  const POOL = 8;
  await Promise.all(
    Array.from({ length: POOL }, async () => {
      while (i < entries.length) {
        const [url, where] = entries[i++];
        const local = where[0].isLocal;
        let ok;
        if (local) ok = checkLocal(url);
        else {
          const s = await fetchStatus(url);
          ok = s >= 200 && s < 400;
        }
        if (ok) continue;
        broken.push(url);
        if (local) {
          unfixable.push({ url, where });
          continue;
        }
        const replacement = await findWorkingVariant(url);
        if (replacement) {
          if (!DRY) replaceInFiles(url, replacement, where);
          fixed.push({ url, replacement, files: where.map((w) => relative(ROOT, w.file)) });
        } else {
          unfixable.push({ url, where: where.map((w) => relative(ROOT, w.file)) });
        }
      }
    }),
  );

  console.log(`\n✅ OK: ${refs.size - broken.length}`);
  console.log(`🛠  Fixed${DRY ? ' (dry-run)' : ''}: ${fixed.length}`);
  for (const f of fixed) console.log(`   - ${f.url}\n     → ${f.replacement}\n     in ${f.files.join(', ')}`);
  console.log(`❌ Unfixable: ${unfixable.length}`);
  for (const u of unfixable) {
    const files = Array.isArray(u.where) ? u.where : u.where.map((w) => relative(ROOT, w.file));
    console.log(`   - ${u.url}\n     in ${Array.isArray(files) ? files.join(', ') : files}`);
  }

  if (unfixable.length && !NO_FAIL) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(NO_FAIL ? 0 : 2); });