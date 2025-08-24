// src/services/cities.ts
import { Platform } from 'react-native';

export type CityHit = {
  id: string;
  name: string;
  country: string;
  displayName: string; // "City, Country"
  lat: number;
  lon: number;
};

function labelFromNominatim(item: any): { name: string; country: string; displayName: string } {
  const name = item?.name || item?.display_name?.split(',')[0]?.trim() || '';
  const country = item?.address?.country || item?.display_name?.split(',').pop()?.trim() || '';
  const displayName = country ? `${name}, ${country}` : name;
  return { name, country, displayName };
}

type SearchOpts = {
  /** Strongly recommended for Android; iOS RN may ignore it. */
  userAgent?: string;
  /** Use your real contact email on iOS if UA cannot be set. */
  email?: string;
  /** Preferred language for results. */
  acceptLanguage?: string;
  /** Optional referer string. */
  referer?: string;
  /** Max results (default 8). */
  max?: number;
  /** If true, logs helpful info in dev. */
  debug?: boolean;
};

const toHits = (arr: any[]): CityHit[] =>
  (arr || []).map((d: any) => {
    const { name, country, displayName } = labelFromNominatim(d);
    return {
      id: String(d.place_id ?? d.osm_id ?? displayName ?? Math.random()),
      name,
      country,
      displayName,
      lat: Number(d.lat),
      lon: Number(d.lon),
    } as CityHit;
  });

/** Primary: Nominatim (official) */
async function queryNominatim(q: string, signal?: AbortSignal, opts: SearchOpts = {}): Promise<CityHit[]> {
  const max = typeof opts.max === 'number' ? opts.max : 8;

  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', q);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', String(max));
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('featuretype', 'city');
  url.searchParams.set('dedupe', '1');
  // iOS RN often ignores UA → use `email` param as identification per policy
  if (Platform.OS === 'ios' && opts.email) url.searchParams.set('email', opts.email);

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Accept-Language': opts.acceptLanguage || 'en',
  };
  // On Android, UA usually works
  if (Platform.OS === 'android' && opts.userAgent) headers['User-Agent'] = opts.userAgent;
  if (opts.referer) headers['Referer'] = opts.referer;

  const res = await fetch(url.toString(), { method: 'GET', headers, signal }).catch((err) => {
    if (__DEV__ && opts.debug) console.warn('[cities] Nominatim fetch failed:', err?.message || err);
    return null as any;
  });

  if (!res || !res.ok) {
    if (__DEV__ && opts.debug) console.warn('[cities] Nominatim non-ok status:', res?.status);
    return [];
  }

  const data = await res.json().catch(() => null);
  if (!Array.isArray(data)) return [];
  // Filter to city/place and normalize
  const filtered = data.filter((d: any) => d?.type === 'city' || d?.class === 'place');
  return toHits(filtered);
}

/** Fallback: geocode.maps.co (Nominatim-backed mirror; tends to accept requests without UA) */
async function queryMapsCo(q: string, signal?: AbortSignal, opts: SearchOpts = {}): Promise<CityHit[]> {
  const max = typeof opts.max === 'number' ? opts.max : 8;
  const url = new URL('https://geocode.maps.co/search');
  url.searchParams.set('q', q);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', String(max));
  url.searchParams.set('addressdetails', '1');
  // not all mirrors support featuretype/dedupe consistently — we'll filter client-side

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    signal,
  }).catch((err) => {
    if (__DEV__ && opts.debug) console.warn('[cities] maps.co fetch failed:', err?.message || err);
    return null as any;
  });

  if (!res || !res.ok) {
    if (__DEV__ && opts.debug) console.warn('[cities] maps.co non-ok status:', res?.status);
    return [];
  }

  const data = await res.json().catch(() => null);
  if (!Array.isArray(data)) return [];
  const filtered = data.filter((d: any) => d?.type === 'city' || d?.class === 'place');
  return toHits(filtered);
}

/** Public API: try Nominatim first, then fallback */
export async function searchCities(
  query: string,
  signal?: AbortSignal,
  opts: SearchOpts = {}
): Promise<CityHit[]> {
  const q = (query || '').trim();
  if (q.length < 1) return [];

  // 1) Try Nominatim with the right identification mechanism per platform.
  const primary = await queryNominatim(q, signal, opts);
  if (primary.length > 0) return primary;

  // 2) Fallback provider
  const fallback = await queryMapsCo(q, signal, opts);
  return fallback;
}
