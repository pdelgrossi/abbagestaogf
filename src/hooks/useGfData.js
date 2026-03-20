import { useState, useCallback } from 'react';
import { normalizeDataBairros } from '../utils/importXlsx';
import { getGrupoNome } from '../utils/buildTree';
import { clearGeoCache } from '../utils/geocode';

const STORAGE_KEY = 'gf_abba_data';

// Divide "João e Laura Buso" → { homem: "João", mulher: "Laura Buso" }
function splitCasal(str) {
  if (!str) return { homem: '', mulher: '' };
  const idx = str.indexOf(' e ');
  if (idx === -1) return { homem: str.trim(), mulher: '' };
  return { homem: str.slice(0, idx).trim(), mulher: str.slice(idx + 3).trim() };
}

// Lê campos numerados (prefix1, prefix2, ...) como array de strings não-vazias
function getNumberedValues(obj, prefix) {
  const arr = [];
  for (let i = 1; i <= 10; i++) {
    const val = obj[`${prefix}${i}`];
    if (val === undefined || val === null) break;
    if (String(val).trim()) arr.push(String(val).trim());
  }
  return arr;
}

let _idCounter = 0;

function migrateRecord(g) {
  let record = { ...g };

  if (!record._id) {
    record._id = `gf_${Date.now()}_${++_idCounter}`;
  }

  if (!Array.isArray(record.integrantes)) {
    record.integrantes = [];
  }

  // MIGRATION: liderHomem/liderMulher → lider1/lider2
  if (record.lider1 === undefined) {
    if (record.liderHomem) record.lider1 = record.liderHomem;
    if (record.liderMulher) record.lider2 = record.liderMulher;
  }

  // MIGRATION: coordenadorHomem/coordenadorMulher → coordenador1/coordenador2
  if (record.coordenador1 === undefined) {
    if (record.coordenadorHomem) {
      record.coordenador1 = record.coordenadorHomem;
      if (record.coordenadorMulher) record.coordenador2 = record.coordenadorMulher;
    } else if (record.coordenador) {
      const { homem, mulher } = splitCasal(record.coordenador);
      if (homem) record.coordenador1 = homem;
      if (mulher) record.coordenador2 = mulher;
    }
  }

  // MIGRATION: coordenadorGeralHomem/coordenadorGeralMulher → coordenadorGeral1/coordenadorGeral2
  if (record.coordenadorGeral1 === undefined) {
    if (record.coordenadorGeralHomem) {
      record.coordenadorGeral1 = record.coordenadorGeralHomem;
      if (record.coordenadorGeralMulher) record.coordenadorGeral2 = record.coordenadorGeralMulher;
    } else if (record.coordenadorGeral) {
      const { homem, mulher } = splitCasal(record.coordenadorGeral);
      if (homem) record.coordenadorGeral1 = homem;
      if (mulher) record.coordenadorGeral2 = mulher;
    }
  }

  // Reconstrói campos composite usados pelo matching de hierarquia
  const coordVals = getNumberedValues(record, 'coordenador');
  record.coordenador = coordVals.join(' e ');

  const coordGeralVals = getNumberedValues(record, 'coordenadorGeral');
  record.coordenadorGeral = coordGeralVals.join(' e ');

  record.grupoFamiliar = getGrupoNome(record);

  return record;
}

function migrateData(data) {
  return normalizeDataBairros(data.map(migrateRecord));
}

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return migrateData(JSON.parse(stored));
  } catch {}
  return [];
}

export function useGfData() {
  const [data, setData] = useState(loadData);

  const updateData = useCallback((newData) => {
    clearGeoCache();
    const migrated = migrateData(newData);
    setData(migrated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    } catch {}
  }, []);

  const updateGrupo = useCallback((original, updates) => {
    setData(prev => {
      const next = prev.map(g =>
        g._id === original._id ? migrateRecord({ ...g, ...updates }) : g
      );
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const resetData = useCallback(() => {
    clearGeoCache();
    localStorage.removeItem(STORAGE_KEY);
    setData([]);
  }, []);

  return { data, updateData, updateGrupo, resetData };
}
