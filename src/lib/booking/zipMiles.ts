// Approximate driving distance in miles from Klawsome Novi (48377) to
// common Michigan ZIP codes within ~75 miles. Straight-line distance is
// used as a heuristic where driving isn't pre-computed; staff can quote
// any ZIP not in this list.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RAW: Record<string, number> = {
  // Novi + neighbors (0–8 mi)
  '48377': 0, '48375': 3, '48376': 3, '48374': 4,
  '48167': 6, '48168': 7, '48170': 9,
  '48331': 5, '48335': 7, '48336': 9, '48334': 10, '48322': 10, '48323': 11, '48324': 12,
  '48381': 7, '48382': 9, '48380': 12,
  '48390': 10, '48393': 12,
  // Farmington / West Bloomfield / Livonia (8–15 mi)
  '48154': 12, '48152': 14, '48150': 15, '48151': 15,
  '48178': 12,
  // Wixom / Walled Lake / Commerce
  '48165': 10, '48383': 14,
  // Southfield / Birmingham / Bloomfield Hills (14–22 mi)
  '48076': 16, '48075': 17, '48034': 18, '48033': 18, '48037': 18,
  '48009': 18, '48302': 15, '48301': 17, '48303': 17, '48304': 20, '48307': 22, '48306': 24, '48309': 20,
  // Ann Arbor / Ypsilanti (24–32 mi)
  '48103': 28, '48104': 30, '48105': 30, '48108': 32, '48197': 34, '48198': 32,
  // Ferndale / Royal Oak / Berkley (22–28 mi)
  '48067': 22, '48068': 22, '48069': 24, '48070': 26, '48071': 24, '48072': 24, '48073': 24, '48220': 26,
  // Detroit — downtown ~30
  '48226': 30, '48201': 32, '48202': 30, '48207': 33, '48208': 30, '48214': 34,
  '48221': 22, '48219': 22, '48228': 24, '48223': 20, '48235': 22, '48238': 24,
  // Troy / Rochester / Auburn Hills (18–28 mi)
  '48083': 22, '48084': 22, '48085': 24, '48098': 22, '48099': 22,
  '48326': 20, '48327': 16, '48328': 18, '48329': 18, '48342': 22, '48341': 22, '48340': 24,
  // Waterford / Pontiac
  '48343': 22, '48346': 22, '48347': 22, '48348': 26,
  // Canton / Plymouth / Northville area
  '48187': 12, '48188': 14, '48186': 20, '48184': 22, '48185': 18, '48192': 30, '48193': 32,
  // Brighton / Howell / South Lyon (12–25 mi)
  '48116': 14, '48114': 22, '48843': 26, '48855': 30,
  // Farther southeast — Dearborn, Warren (25–35)
  '48124': 28, '48126': 30, '48127': 24, '48128': 26,
  '48088': 32, '48089': 34, '48091': 32, '48092': 30, '48093': 32,
  // Sterling Heights / Utica
  '48310': 30, '48311': 30, '48312': 32, '48313': 34, '48314': 32, '48315': 36, '48316': 30, '48317': 32,
};

export type ZipLookup =
  | { known: true; miles: number }
  | { known: false };

export function getMilesForZip(zip: string): ZipLookup {
  const clean = (zip || '').trim().slice(0, 5);
  if (!/^\d{5}$/.test(clean)) return { known: false };
  const miles = RAW[clean];
  if (typeof miles !== 'number') return { known: false };
  return { known: true, miles };
}
