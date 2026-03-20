import { useState, useCallback } from 'react';
import { REDE_COLORS } from '../utils/buildTree';

const STORAGE_KEY = 'gf_rede_config';

function loadConfig() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {};
}

export function useRedeConfig() {
  const [config, setConfig] = useState(loadConfig);

  const getColor = useCallback(
    (rede) => config[rede]?.color || REDE_COLORS[rede] || '#94a3b8',
    [config]
  );

  const getLabel = useCallback(
    (rede) => config[rede]?.label || rede,
    [config]
  );

  const updateRede = useCallback((rede, updates) => {
    setConfig(prev => {
      const next = { ...prev, [rede]: { ...prev[rede], ...updates } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { getColor, getLabel, updateRede };
}
