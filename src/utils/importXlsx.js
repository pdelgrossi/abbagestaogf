import * as XLSX from 'xlsx';
import { getGrupoNome } from './buildTree';

// Normaliza texto para Title Case: "XAXIM" e "xaxim" → "Xaxim"
export function normalizeTexto(value) {
  if (!value || typeof value !== 'string') return value ?? '';
  return value
    .trim()
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
}

// Mantém alias para compatibilidade
export const normalizeBairro = normalizeTexto;

// Aplica normalizações de bairro, cidade e garante campo horario em todos os registros
export function normalizeDataBairros(data) {
  return data.map(g => ({
    ...g,
    bairro:  normalizeTexto(g.bairro),
    cidade:  normalizeTexto(g.cidade),
    horario: g.horario ?? '',
  }));
}

const REQUIRED_COLUMNS = ['Tipo', 'Rede'];

const COLUMN_MAP = {
  'Tipo': 'tipo',
  'Rede': 'rede',
  // Formato numerado (novo)
  'Líder 1': 'lider1',
  'Líder 2': 'lider2',
  'Líder 3': 'lider3',
  'Líder 4': 'lider4',
  'Líder 5': 'lider5',
  'Coordenador 1': 'coordenador1',
  'Coordenador 2': 'coordenador2',
  'Coordenador 3': 'coordenador3',
  'Coordenador 4': 'coordenador4',
  'Coordenador 5': 'coordenador5',
  'Coord. Geral 1': 'coordenadorGeral1',
  'Coord. Geral 2': 'coordenadorGeral2',
  'Coord. Geral 3': 'coordenadorGeral3',
  'Coord. Geral 4': 'coordenadorGeral4',
  'Coord. Geral 5': 'coordenadorGeral5',
  // Formato antigo (compatibilidade retroativa)
  'Líder Homem': 'lider1',
  'Líder Mulher': 'lider2',
  'Coordenador Homem': 'coordenador1',
  'Coordenadora Mulher': 'coordenador2',
  'Coord. Geral Homem': 'coordenadorGeral1',
  'Coord. Geral Mulher': 'coordenadorGeral2',
  // Outros campos
  'E-mail': 'email',
  'CEP': 'cep',
  'Logradouro': 'logradouro',
  'Número': 'numero',
  'Complemento': 'complemento',
  'Bairro': 'bairro',
  'Cidade': 'cidade',
  'Estado': 'estado',
  'Participantes': 'participantes',
  'Visitantes': 'visitantes',
  'Dias': 'dias',
  'Horário': 'horario',
  'Média de Idade': 'mediaIdade',
  'Ovelhinhas': 'ovelhinhas',
  'Área/Região': 'areaRegiao',
  'Limite de Pessoas': 'limitePessoas',
  'Criado em': 'criadoEm',
};

export async function parseXlsx(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

        // Check required columns
        if (rows.length > 0) {
          const cols = Object.keys(rows[0]);
          const missing = REQUIRED_COLUMNS.filter(c => !cols.includes(c));
          if (missing.length > 0) {
            return reject(new Error(`Colunas obrigatórias ausentes: ${missing.join(', ')}`));
          }
        }

        const valid = [];
        const errors = [];

        rows.forEach((row, idx) => {
          const lineNum = idx + 2;
          const rowErrors = [];
          REQUIRED_COLUMNS.forEach(col => {
            if (!row[col]) rowErrors.push(`${col} vazio`);
          });

          const mapped = {};
          Object.entries(COLUMN_MAP).forEach(([excelCol, jsKey]) => {
            mapped[jsKey] = row[excelCol] ?? '';
          });

          // Normalize texto
          mapped.bairro  = normalizeTexto(mapped.bairro);
          mapped.cidade  = normalizeTexto(mapped.cidade);
          mapped.horario = mapped.horario?.trim() ?? '';

          // Trim campos numerados de líderes e coordenadores
          for (let i = 1; i <= 5; i++) {
            if (mapped[`lider${i}`] !== undefined) mapped[`lider${i}`] = String(mapped[`lider${i}`]).trim();
            if (mapped[`coordenador${i}`] !== undefined) mapped[`coordenador${i}`] = String(mapped[`coordenador${i}`]).trim();
            if (mapped[`coordenadorGeral${i}`] !== undefined) mapped[`coordenadorGeral${i}`] = String(mapped[`coordenadorGeral${i}`]).trim();
          }

          // Reconstrói campos composite usados pelo matching da hierarquia
          const cParts = [1,2,3,4,5].map(i => mapped[`coordenador${i}`]).filter(Boolean);
          mapped.coordenador = cParts.join(' e ');
          const cgParts = [1,2,3,4,5].map(i => mapped[`coordenadorGeral${i}`]).filter(Boolean);
          mapped.coordenadorGeral = cgParts.join(' e ');

          // Auto-gera grupoFamiliar canônico
          mapped.grupoFamiliar = getGrupoNome(mapped);

          // Convert numeric fields
          mapped.participantes = Number(mapped.participantes) || 0;
          mapped.visitantes = Number(mapped.visitantes) || 0;
          mapped.mediaIdade = Number(mapped.mediaIdade) || 0;
          mapped.limitePessoas = Number(mapped.limitePessoas) || 0;

          // Preserve or generate id
          mapped.id = row.id || `imported_${lineNum}_${Date.now()}`;

          if (rowErrors.length > 0) {
            errors.push({ line: lineNum, errors: rowErrors, row: mapped });
          } else {
            valid.push(mapped);
          }
        });

        resolve({ valid, errors, preview: rows.slice(0, 10) });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
