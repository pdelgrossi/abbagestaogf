import { useState, useMemo } from 'react';

// Campos estáticos + campos numerados (lider1-5, coordenador1-5, coordenadorGeral1-5)
const STATIC_FIELDS = ['grupoFamiliar', 'coordenadorGeral', 'coordenador'];
const NUMBERED_PREFIXES = ['lider', 'coordenador', 'coordenadorGeral'];
const MAX_NUMBERED = 5;
function matchesQuery(g, q) {
  if (STATIC_FIELDS.some(f => (g[f] || '').toLowerCase().includes(q))) return true;
  for (const prefix of NUMBERED_PREFIXES) {
    for (let i = 1; i <= MAX_NUMBERED; i++) {
      if ((g[`${prefix}${i}`] || '').toLowerCase().includes(q)) return true;
    }
  }
  return false;
}

export function useSearch(data) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    return data
      .filter(g => matchesQuery(g, q))
      .slice(0, 20);
  }, [data, query]);

  return { query, setQuery, results };
}
