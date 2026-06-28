import { NextRequest, NextResponse } from "next/server";

type GeocodeResult = {
  query: string;
  lat: number | null;
  lon: number | null;
  displayName?: string;
};

const geocodeCache = new Map<string, GeocodeResult>();

async function geocodeQuery(query: string): Promise<GeocodeResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { query, lat: null, lon: null };
  }

  const cached = geocodeCache.get(trimmed);
  if (cached) return cached;

  const endpoint = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(trimmed)}`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "User-Agent": "GovFlowAI/1.0 (office-locator)",
      Accept: "application/json",
    },
    cache: "force-cache",
  });

  if (!response.ok) {
    const failed = { query: trimmed, lat: null, lon: null };
    geocodeCache.set(trimmed, failed);
    return failed;
  }

  const payload = (await response.json().catch(() => [])) as Array<{
    lat?: string;
    lon?: string;
    display_name?: string;
  }>;

  const item = payload[0];
  const lat = item?.lat ? Number(item.lat) : null;
  const lon = item?.lon ? Number(item.lon) : null;
  const result: GeocodeResult = {
    query: trimmed,
    lat: Number.isFinite(lat) ? lat : null,
    lon: Number.isFinite(lon) ? lon : null,
    displayName: item?.display_name,
  };

  geocodeCache.set(trimmed, result);
  return result;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { queries?: string[] };
  const queries = Array.isArray(body.queries) ? body.queries.slice(0, 40) : [];

  if (!queries.length) {
    return NextResponse.json({ error: "Provide at least one geocoding query." }, { status: 400 });
  }

  const results: GeocodeResult[] = [];
  for (const query of queries) {
    const result = await geocodeQuery(query);
    results.push(result);
  }

  return NextResponse.json({ results });
}
