const CACHE_KEY = 'gf_abba_geocache';
let _cache = null;

export function clearGeoCache() {
  _cache = {};
  try { localStorage.removeItem(CACHE_KEY); } catch {}
}

function getCache() {
  if (!_cache) {
    try { _cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); } catch { _cache = {}; }
  }
  return _cache;
}

function saveCache() {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(_cache)); } catch {}
}

// Unique key based on the address fields
export function getGeoKey(grupo) {
  return [
    grupo.logradouro || '',
    grupo.numero || '',
    grupo.bairro || '',
    grupo.cidade || '',
    grupo.estado || '',
  ].join('|').toLowerCase().trim();
}

// Returns the cached value (can be {lat,lng} or null), or undefined if not cached yet
export function getCachedCoord(grupo) {
  const key = getGeoKey(grupo);
  const cache = getCache();
  return key in cache ? cache[key] : undefined;
}

async function nominatimSearch(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=br`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json[0]) return { lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) };
  } catch {}
  return null;
}

export async function geocodeGrupo(grupo) {
  const cache = getCache();
  const key = getGeoKey(grupo);
  if (key in cache) return cache[key];

  let coord = null;

  // 1. Full address
  const fullParts = [grupo.logradouro, grupo.numero, grupo.bairro, grupo.cidade, grupo.estado].filter(Boolean);
  if (fullParts.length >= 2) {
    coord = await nominatimSearch(fullParts.join(', ') + ', Brasil');
  }

  // 2. Bairro + cidade
  if (!coord && grupo.bairro && grupo.cidade) {
    coord = await nominatimSearch(`${grupo.bairro}, ${grupo.cidade}, ${grupo.estado || 'PR'}, Brasil`);
  }

  // 3. Just cidade
  if (!coord && grupo.cidade) {
    coord = await nominatimSearch(`${grupo.cidade}, ${grupo.estado || 'PR'}, Brasil`);
  }

  // Store null to mark as "tried and failed" so we don't retry
  cache[key] = coord;
  saveCache();
  return coord;
}
