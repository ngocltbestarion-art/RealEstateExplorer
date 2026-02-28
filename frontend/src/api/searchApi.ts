const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export async function searchAddress(query: string) {
  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(
    query
  )}&format=json&addressdetails=1&limit=5`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  if (!res.ok) {
    throw new Error('Search failed');
  }
  return res.json();
}

