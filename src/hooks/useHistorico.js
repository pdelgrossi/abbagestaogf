import { useState, useCallback } from 'react';

const STORAGE_KEY = 'gf_abba_historico';
const LEAF_TYPES = ['PASTOREIO', 'JOVENS', 'CASAIS'];

function load() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function save(historico) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(historico)); } catch {}
}

export function useHistorico(data) {
  const [historico, setHistorico] = useState(load);

  const registrarMes = useCallback((mes) => {
    const folhas = data.filter(g => LEAF_TYPES.includes(g.tipo));
    const porRede = {};
    folhas.forEach(g => {
      porRede[g.rede] = (porRede[g.rede] || 0) + (g.participantes || 0);
    });
    const total = Object.values(porRede).reduce((s, v) => s + v, 0);
    const entry = { mes, total, porRede };

    setHistorico(prev => {
      const next = [...prev.filter(e => e.mes !== mes), entry]
        .sort((a, b) => a.mes.localeCompare(b.mes));
      save(next);
      return next;
    });
  }, [data]);

  const removerMes = useCallback((mes) => {
    setHistorico(prev => {
      const next = prev.filter(e => e.mes !== mes);
      save(next);
      return next;
    });
  }, []);

  return { historico, registrarMes, removerMes };
}
