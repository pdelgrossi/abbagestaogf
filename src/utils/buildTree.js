export const REDE_COLORS = {
  'CASAIS': '#3b82f6',
  'AJ': '#f59e0b',
  'TEEN': '#22c55e',
  'MULHERES': '#ec4899',
  'HOMENS': '#6366f1',
  'INTEGRAÇÃO': '#06b6d4',
  'MASTER': '#8b5cf6',
  'KOINONIA': '#14b8a6',
  'GF ON-LINE': '#94a3b8',
  'GF À DISTANCIA': '#fb923c',
};

export const TIPO_STYLES = {
  'ROOT':              { bg: '#1A1614', label: 'Todos' },
  'REDE':              { bg: '#94a3b8', label: 'Rede' },
  'SUPERVISÃO GERAL':  { bg: '#7c3aed', label: 'Supervisão' },
  'COORDENAÇÃO GERAL': { bg: '#1d4ed8', label: 'Coord. Geral' },
  'COORDENAÇÃO':       { bg: '#0369a1', label: 'Coordenação' },
  'PASTOREIO':         { bg: '#065f46', label: 'Grupo' },
  'JOVENS':            { bg: '#92400e', label: 'Grupo' },
  'CASAIS':            { bg: '#065f46', label: 'Grupo' },
  'INTEGRANTE':        { bg: '#6b7280', label: 'Integrante' },
};

export const REDES = ['CASAIS', 'AJ', 'TEEN', 'MULHERES', 'HOMENS', 'INTEGRAÇÃO', 'MASTER', 'KOINONIA', 'GF ON-LINE', 'GF À DISTANCIA'];

// Junta array de nomes: [] → '', ['A'] → 'A', ['A','B'] → 'A e B', ['A','B','C'] → 'A, B e C'
function joinNames(arr) {
  if (!arr || arr.length === 0) return '';
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} e ${arr[1]}`;
  return `${arr.slice(0, -1).join(', ')} e ${arr[arr.length - 1]}`;
}

// Lê campos numerados (prefix1, prefix2, ...) e retorna como array
function getNumberedFields(obj, prefix) {
  const arr = [];
  for (let i = 1; i <= 10; i++) {
    const val = obj[`${prefix}${i}`];
    if (val === undefined || val === null) break;
    if (String(val).trim()) arr.push(String(val).trim());
  }
  return arr;
}

// Retorna array de nomes de líderes/coordenadores para exibição
export function getLideresArray(grupo) {
  const leafTypes = ['PASTOREIO', 'JOVENS', 'CASAIS'];
  if (leafTypes.includes(grupo.tipo)) {
    const lideres = getNumberedFields(grupo, 'lider');
    if (lideres.length > 0) return lideres;
    // Fallback legado: split do composite
    const source = grupo.lider || grupo.coordenador || '';
    if (!source) return [];
    const idx = source.indexOf(' e ');
    if (idx === -1) return [source.trim()].filter(Boolean);
    return [source.slice(0, idx).trim(), source.slice(idx + 3).trim()].filter(Boolean);
  }
  const coordenadores = getNumberedFields(grupo, 'coordenador');
  if (coordenadores.length > 0) return coordenadores;
  // Fallback legado
  const source = grupo.coordenador || '';
  if (!source) return [];
  const idx = source.indexOf(' e ');
  if (idx === -1) return [source.trim()].filter(Boolean);
  return [source.slice(0, idx).trim(), source.slice(idx + 3).trim()].filter(Boolean);
}

// Nome canônico do grupo
export function getGrupoNome(grupo) {
  const leafTypes = ['PASTOREIO', 'JOVENS', 'CASAIS'];
  const lideres = getLideresArray(grupo);

  if (leafTypes.includes(grupo.tipo)) {
    const rede = grupo.rede || '';
    if (lideres.length === 0) return grupo.grupoFamiliar || rede;
    return `GF ${rede} ${joinNames(lideres)}`;
  }

  if (lideres.length === 0) return grupo.grupoFamiliar || grupo.coordenador || grupo.rede || '';
  return joinNames(lideres);
}

export function buildTreeForRede(data, rede) {
  const grupos = data.filter(g => g.rede === rede);
  if (grupos.length === 0) return null;

  let raiz = grupos.find(g => g.tipo === 'SUPERVISÃO GERAL')
           ?? grupos.find(g => g.tipo === 'COORDENAÇÃO GERAL');

  if (!raiz) {
    // Virtual root
    raiz = {
      id: `virtual_${rede}`,
      grupoFamiliar: rede,
      tipo: 'COORDENAÇÃO GERAL',
      rede,
      coordenador: rede,
      coordenadorGeral: '',
      participantes: grupos.reduce((s, g) => s + (g.participantes || 0), 0),
    };
  }

  function buildNode(grupo, ancestors = []) {
    let children = [];
    const tipo = grupo.tipo;
    const displayName = getGrupoNome(grupo);
    const currentPath = [...ancestors, { name: displayName, tipo: grupo.tipo }];

    if (tipo === 'SUPERVISÃO GERAL') {
      children = grupos.filter(g =>
        g.tipo === 'COORDENAÇÃO GERAL' &&
        g.coordenadorGeral === grupo.coordenador
      );
    } else if (tipo === 'COORDENAÇÃO GERAL') {
      children = grupos.filter(g =>
        g.tipo === 'COORDENAÇÃO' &&
        g.coordenadorGeral === grupo.coordenador
      );
      if (children.length === 0) {
        children = grupos.filter(g =>
          (g.tipo === 'PASTOREIO' || g.tipo === 'JOVENS' || g.tipo === 'CASAIS') &&
          g.coordenador === grupo.coordenador
        );
      }
    } else if (tipo === 'COORDENAÇÃO') {
      children = grupos.filter(g =>
        (g.tipo === 'PASTOREIO' || g.tipo === 'JOVENS' || g.tipo === 'CASAIS') &&
        g.coordenador === grupo.coordenador
      );
    } else if (tipo === 'PASTOREIO' || tipo === 'JOVENS' || tipo === 'CASAIS') {
      const membros = grupo.integrantes || [];
      return {
        name: displayName,
        attributes: { tipo: grupo.tipo, participantes: grupo.participantes, rede: grupo.rede },
        data: { ...grupo, _path: currentPath },
        children: membros.map((m) => ({
          name: m.nome || 'Integrante',
          attributes: { tipo: 'INTEGRANTE', participantes: 0, rede: grupo.rede },
          data: { ...m, _isIntegrante: true, _parentId: grupo._id, _path: [...currentPath, { name: m.nome, tipo: 'INTEGRANTE' }] },
          children: [],
        })),
      };
    }

    return {
      name: displayName,
      attributes: {
        tipo: grupo.tipo,
        participantes: grupo.participantes,
        rede: grupo.rede,
      },
      data: { ...grupo, _path: currentPath },
      children: children.map(child => buildNode(child, currentPath)),
    };
  }

  return buildNode(raiz);
}

export function buildTreeForAll(data) {
  const redeNodes = REDES.map(rede => {
    const tree = buildTreeForRede(data, rede);
    if (!tree) return null;
    const participants = getTotalParticipantesByRede(data, rede);
    return {
      name: rede,
      attributes: { tipo: 'REDE', participantes: participants, rede },
      data: { tipo: 'REDE', rede, _path: [{ name: 'Todos os Grupos', tipo: 'ROOT' }, { name: rede, tipo: 'REDE' }] },
      children: [tree],
    };
  }).filter(Boolean);

  if (redeNodes.length === 0) return null;

  const totalParticipantes = data
    .filter(g => g.tipo === 'PASTOREIO' || g.tipo === 'JOVENS' || g.tipo === 'CASAIS')
    .reduce((sum, g) => sum + (g.participantes || 0), 0);

  return {
    name: 'Todos os Grupos',
    attributes: { tipo: 'ROOT', participantes: totalParticipantes, rede: 'TODOS' },
    data: { tipo: 'ROOT', rede: 'TODOS', _path: [{ name: 'Todos os Grupos', tipo: 'ROOT' }] },
    children: redeNodes,
  };
}

export function getTotalParticipantesByRede(data, rede) {
  if (rede === 'TODOS') {
    return data
      .filter(g => g.tipo === 'PASTOREIO' || g.tipo === 'JOVENS' || g.tipo === 'CASAIS')
      .reduce((sum, g) => sum + (g.participantes || 0), 0);
  }
  return data
    .filter(g => g.rede === rede && (g.tipo === 'PASTOREIO' || g.tipo === 'JOVENS' || g.tipo === 'CASAIS'))
    .reduce((sum, g) => sum + (g.participantes || 0), 0);
}

export function getGroupCountByRede(data, rede) {
  if (rede === 'TODOS') {
    return data.filter(g => g.tipo === 'PASTOREIO' || g.tipo === 'JOVENS' || g.tipo === 'CASAIS').length;
  }
  return data.filter(g => g.rede === rede && (g.tipo === 'PASTOREIO' || g.tipo === 'JOVENS' || g.tipo === 'CASAIS')).length;
}
