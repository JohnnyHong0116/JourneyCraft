// src/services/locationiq.ts
// LocationIQ Autocomplete client (cities only)
export type CityHit = {
  id: string;
  name: string;           // city name
  state?: string;         // state/province (optional)
  country: string;        // country
  displayName: string;    // formatted for display
  shortDisplay: string;   // concise format: "City, State, Country" or "City, Country"
  lat: number;
  lon: number;
};

export type LQOptions = {
  apiKey: string;          // use process.env.EXPO_PUBLIC_LOCATIONIQ_KEY
  limit?: number;          // default 8
  language?: string;       // 'en'
  countrycodes?: string;   // 'us,gb' etc.
  tag?: string;            // 'place:city'
  dedupe?: 0 | 1;          // default 1
  debug?: boolean;
};

function toCityHit(item: any): CityHit | null {
  const name =
    item?.display_place ||
    item?.address?.city ||
    item?.address?.town ||
    item?.address?.village ||
    item?.address?.hamlet ||
    item?.address?.name ||
    '';
  const state = item?.address?.state || item?.address?.county || '';
  const country = item?.address?.country || '';
  const displayName = item?.display_name || (country ? `${name}, ${country}` : name);
  // Create concise display format: "City, State, Country" or "City, Country"
  let shortDisplay = name;
  if (state && country) {
    shortDisplay = `${name}, ${state}, ${country}`;
  } else if (state) {
    shortDisplay = `${name}, ${state}`;
  } else if (country) {
    shortDisplay = `${name}, ${country}`;
  }
  const lat = Number(item?.lat);
  const lon = Number(item?.lon);
  if (!name || Number.isNaN(lat) || Number.isNaN(lon)) return null;
  return {
    id: String(item?.place_id ?? item?.osm_id ?? displayName),
    name,
    state,
    country,
    displayName,
    shortDisplay,
    lat,
    lon,
  };
}

export async function searchCitiesLocationIQ(
  query: string,
  opts: LQOptions,
  signal?: AbortSignal
): Promise<CityHit[]> {
  const q = (query || '').trim();
  if (!q) return [];

  const limit = typeof opts.limit === 'number' ? opts.limit : 8;
  const dedupe = typeof opts.dedupe === 'number' ? opts.dedupe : 1;

  // Use regional host per docs: us1 or eu1
  const url = new URL('https://us1.locationiq.com/v1/autocomplete');
  url.searchParams.set('key', opts.apiKey);
  url.searchParams.set('q', q);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('dedupe', String(dedupe));
  if (opts.language) url.searchParams.set('accept-language', opts.language);
  if (opts.countrycodes) url.searchParams.set('countrycodes', opts.countrycodes);
  // Restrict to cities per docs (tag=place:city)
  url.searchParams.set('tag', opts.tag || 'place:city');

  let res: Response | null = null;
  try {
    res = await fetch(url.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    });
  } catch (err: any) {
    if (__DEV__ && opts.debug) console.warn('[locationiq] fetch failed:', err?.message || err);
    return [];
  }

  if (!res.ok) {
    if (__DEV__ && opts.debug) console.warn('[locationiq] non-ok status:', res.status);
    // 401 invalid/missing key; 403 unauthorized domain/IP; 429 rate-limit
    return [];
  }

  const data = await res.json().catch(() => null);
  if (!Array.isArray(data)) return [];

  const hits = data
    .filter((d: any) => (d?.class === 'place' && d?.type === 'city') || !d?.class)
    .map(toCityHit)
    .filter((x): x is CityHit => !!x);

  if (__DEV__ && opts.debug) console.log('[locationiq] hits:', hits.length);
  return hits;
}
