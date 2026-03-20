import * as XLSX from 'xlsx';

const EXPORT_COLUMNS = [
  { key: 'grupoFamiliar', label: 'Grupo Familiar' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'rede', label: 'Rede' },
  { key: 'coordenadorGeral1', label: 'Coord. Geral 1' },
  { key: 'coordenadorGeral2', label: 'Coord. Geral 2' },
  { key: 'coordenadorGeral3', label: 'Coord. Geral 3' },
  { key: 'coordenador1', label: 'Coordenador 1' },
  { key: 'coordenador2', label: 'Coordenador 2' },
  { key: 'coordenador3', label: 'Coordenador 3' },
  { key: 'lider1', label: 'Líder 1' },
  { key: 'lider2', label: 'Líder 2' },
  { key: 'lider3', label: 'Líder 3' },
  { key: 'email', label: 'E-mail' },
  { key: 'cep', label: 'CEP' },
  { key: 'logradouro', label: 'Logradouro' },
  { key: 'numero', label: 'Número' },
  { key: 'complemento', label: 'Complemento' },
  { key: 'bairro', label: 'Bairro' },
  { key: 'cidade', label: 'Cidade' },
  { key: 'estado', label: 'Estado' },
  { key: 'participantes', label: 'Participantes' },
  { key: 'visitantes', label: 'Visitantes' },
  { key: 'dias', label: 'Dias' },
  { key: 'horario', label: 'Horário' },
  { key: 'mediaIdade', label: 'Média de Idade' },
  { key: 'ovelhinhas', label: 'Ovelhinhas' },
  { key: 'areaRegiao', label: 'Área/Região' },
  { key: 'limitePessoas', label: 'Limite de Pessoas' },
  { key: 'criadoEm', label: 'Criado em' },
];

export function downloadTemplate() {
  const exampleRow = EXPORT_COLUMNS.reduce((row, col) => {
    const examples = {
      'Grupo Familiar': 'GF Exemplo',
      'Tipo': 'PASTOREIO',
      'Rede': 'CASAIS',
      'Coord. Geral 1': 'João Silva',
      'Coord. Geral 2': 'Maria Silva',
      'Coord. Geral 3': '',
      'Coordenador 1': 'Pedro Santos',
      'Coordenador 2': 'Ana Santos',
      'Coordenador 3': '',
      'Apascentador': '',
      'Líder 1': 'Pedro Silva',
      'Líder 2': 'Paula Silva',
      'Líder 3': '',
      'E-mail': 'lider@email.com',
      'CEP': '80000-000',
      'Logradouro': 'Rua Exemplo',
      'Número': '100',
      'Complemento': 'Apto 1',
      'Bairro': 'Centro',
      'Cidade': 'Curitiba',
      'Estado': 'PR',
      'Participantes': 10,
      'Visitantes': 2,
      'Dias': 'Terça',
      'Horário': '20:00',
      'Média de Idade': 30,
      'Ovelhinhas': 'NAO',
      'Área/Região': 'Centro',
      'Limite de Pessoas': 20,
      'Criado em': '2024-01-01',
    };
    row[col.label] = examples[col.label] ?? '';
    return row;
  }, {});

  const ws = XLSX.utils.json_to_sheet([exampleRow]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Grupos Familiares');
  XLSX.writeFile(wb, 'GF_Abba_Modelo.xlsx');
}

export function exportToXlsx(data, scope = 'all', rede = null, filtered = null) {
  let exportData = data;
  if (scope === 'rede' && rede) exportData = data.filter(g => g.rede === rede);
  if (scope === 'filtered' && filtered) exportData = filtered;

  const rows = exportData.map(g =>
    EXPORT_COLUMNS.reduce((row, col) => {
      row[col.label] = g[col.key] ?? '';
      return row;
    }, {})
  );

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Grupos Familiares');

  const fileName = scope === 'rede' ? `GF_Abba_${rede}.xlsx` : 'GF_Abba_Completo.xlsx';
  XLSX.writeFile(wb, fileName);
}
