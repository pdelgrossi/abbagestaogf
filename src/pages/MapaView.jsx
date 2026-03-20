import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { REDES } from '../utils/buildTree';
import { getGeoKey, getCachedCoord, geocodeGrupo } from '../utils/geocode';
import { Users, GitBranch } from 'lucide-react';
import { useRedeConfig } from '../hooks/useRedeConfig';

const LEAF_TYPES = ['PASTOREIO', 'JOVENS', 'CASAIS'];
const CURITIBA = [-25.4284, -49.2733];
const RATE_MS = 1150;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function applyJitter(coord, index, total) {
  if (total <= 1) return coord;
  const angle = (2 * Math.PI * index) / total;
  const r = 0.0007;
  return { lat: coord.lat + Math.sin(angle) * r, lng: coord.lng + Math.cos(angle) * r };
}

function makePopupHtml(g, getColor, getLabel) {
  const nome = g.grupoFamiliar || `GF ${g.rede} ${g.lider1 || ''}${g.lider2 ? ' e ' + g.lider2 : ''}`.trim();
  const end = [g.bairro, g.cidade].filter(Boolean).join(', ');
  const color = getColor(g.rede);
  const label = getLabel(g.rede);

  const limite = g.limitePessoas || 0;
  const vagas = limite > 0 ? limite - (g.participantes || 0) : null;
  const vagasBg = vagas > 0 ? '#DCFCE7' : '#FEE2E2';
  const vagasColor = vagas > 0 ? '#15803D' : '#B91C1C';
  const vagasLabel = vagas > 0 ? `${vagas} vagas disponíveis` : vagas === 0 ? 'Lotado' : `${Math.abs(vagas)} acima do limite`;

  return `
    <div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:190px;padding:2px 0">
      <div style="font-weight:700;font-size:13px;color:#1A1614;margin-bottom:6px;line-height:1.4">${nome}</div>
      <div style="display:flex;flex-direction:column;gap:3px;font-size:11px;color:#7A706A">
        ${end ? `<span>${end}</span>` : ''}
        ${g.dias ? `<span>${g.dias}${g.horario ? ' · ' + g.horario : ''}</span>` : ''}
        ${g.participantes > 0 ? `<span>${g.participantes} integrantes</span>` : ''}
      </div>
      <div style="display:flex;align-items:center;gap:6px;margin-top:8px;flex-wrap:wrap">
        <span style="background:${color}20;color:${color};font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;letter-spacing:0.3px">${label}</span>
        ${vagas !== null ? `<span style="background:${vagasBg};color:${vagasColor};font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px">${vagasLabel}</span>` : ''}
      </div>
    </div>`;
}

export default function MapaView({ data }) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const { getColor, getLabel } = useRedeConfig();

  const leafGroups = data.filter(g =>
    LEAF_TYPES.includes(g.tipo) && (g.bairro || g.cidade || g.logradouro)
  );

  const [coords, setCoords] = useState({});
  const [geocoding, setGeocoding] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [activeRedes, setActiveRedes] = useState(() => new Set(REDES));
  const abortRef = useRef(false);

  // ── Init Leaflet map once ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const map = L.map(mapDivRef.current, { center: CURITIBA, zoom: 12 });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
  }, []);

  // ── Geocoding ──────────────────────────────────────────────────────────────
  useEffect(() => {
    abortRef.current = false;

    const initial = {};
    leafGroups.forEach(g => {
      const cached = getCachedCoord(g);
      if (cached !== undefined) initial[getGeoKey(g)] = cached;
    });
    setCoords(initial);

    const seen = new Set();
    const uncached = leafGroups.filter(g => {
      const key = getGeoKey(g);
      if (seen.has(key) || getCachedCoord(g) !== undefined) return false;
      seen.add(key);
      return true;
    });

    if (uncached.length === 0) return;

    setGeocoding(true);
    setProgress({ done: 0, total: uncached.length });

    (async () => {
      for (let i = 0; i < uncached.length; i++) {
        if (abortRef.current) break;
        if (i > 0) await sleep(RATE_MS);
        if (abortRef.current) break;

        const g = uncached[i];
        const coord = await geocodeGrupo(g);
        setCoords(prev => ({ ...prev, [getGeoKey(g)]: coord }));
        setProgress({ done: i + 1, total: uncached.length });
      }
      if (!abortRef.current) setGeocoding(false);
    })();

    return () => { abortRef.current = true; };
  }, []);

  // ── Sync markers with coords + activeRedes + colors ────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current = [];

    const byKey = {};
    leafGroups.forEach(g => {
      const key = getGeoKey(g);
      const coord = coords[key];
      if (!coord) return;
      if (!byKey[key]) byKey[key] = { coord, groups: [] };
      byKey[key].groups.push(g);
    });

    Object.values(byKey).forEach(({ coord, groups }) => {
      groups.forEach((g, i) => {
        if (!activeRedes.has(g.rede)) return;
        const pos = applyJitter(coord, i, groups.length);
        const color = getColor(g.rede);

        const marker = L.circleMarker([pos.lat, pos.lng], {
          radius: 8,
          fillColor: color,
          color: '#fff',
          weight: 2,
          fillOpacity: 0.85,
        })
          .bindPopup(makePopupHtml(g, getColor, getLabel), { maxWidth: 260 })
          .addTo(map);

        markersRef.current.push({ key: getGeoKey(g), rede: g.rede, marker });
      });
    });
  }, [coords, activeRedes, getColor, getLabel]);

  const geocodedCount = Object.values(coords).filter(Boolean).length;
  const redesPresentes = REDES.filter(r => leafGroups.some(g => g.rede === r));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1A1614', margin: 0, letterSpacing: '-0.4px' }}>
            Mapa de Grupos
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '3px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#7A706A', fontWeight: '500' }}>
              <GitBranch size={12} /> {leafGroups.length} grupos
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#7A706A', fontWeight: '500' }}>
              <Users size={12} /> {geocodedCount} no mapa
            </span>
          </div>
        </div>

        {geocoding && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#fff', border: '1px solid #E8E2DB',
            borderRadius: '10px', padding: '8px 14px',
            fontSize: '12px', color: '#7A706A', fontWeight: '500',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C8102E', animation: 'pulse 1s infinite' }} />
            <span>Geocodificando {progress.done}/{progress.total}</span>
            <div style={{ width: '60px', height: '4px', background: '#F2EEE9', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%`,
                height: '100%', background: '#C8102E', borderRadius: '2px', transition: 'width 0.3s',
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Map + overlay wrapper */}
      <div style={{ flex: 1, position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1px solid #E8E2DB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />

        {/* Rede filter overlay */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px', zIndex: 1000,
          background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(8px)',
          border: '1px solid #E8E2DB', borderRadius: '12px',
          padding: '10px 12px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
          display: 'flex', flexDirection: 'column', gap: '5px', minWidth: '180px',
        }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#A89E98', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '2px' }}>
            Redes
          </div>
          <button
            onClick={() => setActiveRedes(new Set(REDES))}
            style={{ fontSize: '10px', color: '#C8102E', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '0 0 4px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '600', borderBottom: '1px solid #F2EEE9' }}
          >
            Mostrar todas
          </button>

          {redesPresentes.map(rede => {
            const active = activeRedes.has(rede);
            const total = leafGroups.filter(g => g.rede === rede).length;
            const shown = markersRef.current.filter(m => m.rede === rede).length;
            const color = getColor(rede);
            const label = getLabel(rede);
            return (
              <button
                key={rede}
                onClick={() => setActiveRedes(prev => {
                  const next = new Set(prev);
                  next.has(rede) ? next.delete(rede) : next.add(rede);
                  return next;
                })}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  background: active ? color + '14' : 'transparent',
                  border: `1px solid ${active ? color + '50' : '#E8E2DB'}`,
                  borderRadius: '6px', padding: '4px 8px', cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all 0.15s',
                  opacity: active ? 1 : 0.45,
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#1A1614', flex: 1, textAlign: 'left', whiteSpace: 'nowrap' }}>{label}</span>
                <span style={{ fontSize: '10px', color: '#A89E98' }}>{shown}/{total}</span>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .leaflet-popup-content-wrapper { border-radius:10px!important; box-shadow:0 4px 20px rgba(0,0,0,0.12)!important; border:1px solid #E8E2DB!important; }
        .leaflet-popup-tip { background:#fff!important; }
        .leaflet-popup-content { margin:12px 14px!important; }
      `}</style>
    </div>
  );
}
