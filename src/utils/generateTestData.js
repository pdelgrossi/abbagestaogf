// Gerador de dados de teste randomizados

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const range = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ── Pools de dados ──────────────────────────────────────────────────────────

const NOMES_M = [
  'João', 'Pedro', 'Lucas', 'André', 'Felipe', 'Marcos', 'Carlos', 'Roberto', 'Paulo',
  'Rafael', 'Daniel', 'Guilherme', 'Eduardo', 'Fernando', 'Rodrigo', 'Thiago', 'Bruno',
  'Leandro', 'Sérgio', 'Nilton', 'Vitor', 'Miguel', 'Cláudio', 'Isaías', 'Robson',
  'Gilberto', 'Alexandre', 'Fábio', 'Renato', 'Caio', 'Henrique', 'Mateus', 'Tiago',
  'Marcelo', 'Wesley', 'Augusto', 'Leonardo', 'Gustavo', 'Evandro', 'Josué', 'Cleiton',
  'Vinícius', 'Samuel', 'Elias', 'Ezequiel', 'Jonathan', 'Nathan', 'Davi', 'Gabriel',
];

const NOMES_F = [
  'Maria', 'Ana', 'Laura', 'Fernanda', 'Sandra', 'Patrícia', 'Silvia', 'Bianca',
  'Amanda', 'Marta', 'Sara', 'Júlia', 'Camila', 'Renata', 'Cristiane', 'Rita',
  'Juliana', 'Helga', 'Beatriz', 'Cláudia', 'Rosana', 'Nicole', 'Letícia', 'Luíza',
  'Susan', 'Elizia', 'Terezinha', 'Lourdes', 'Sônia', 'Kátia', 'Ivete', 'Aline',
  'Vitória', 'Mariana', 'Isabela', 'Priscila', 'Thaís', 'Viviane', 'Daniela', 'Mônica',
  'Simone', 'Andreia', 'Eliane', 'Solange', 'Débora', 'Rebeca', 'Ester', 'Rute', 'Naomi',
];

const SOBRENOMES = [
  'Silva', 'Santos', 'Oliveira', 'Costa', 'Souza', 'Lima', 'Pereira', 'Ferreira',
  'Alves', 'Rocha', 'Carvalho', 'Nunes', 'Pires', 'Ramos', 'Mendes', 'Torres',
  'Lopes', 'Borges', 'Braga', 'Cardoso', 'Moura', 'Pinto', 'Campos', 'Gomes',
  'Rios', 'Castro', 'Melo', 'Dias', 'Cruz', 'Vieira', 'Monteiro', 'Barbosa',
  'Macedo', 'Correia', 'Nascimento', 'Araújo', 'Martins', 'Rodrigues', 'Gonçalves',
  'Freitas', 'Ribeiro', 'Cunha', 'Teixeira', 'Fonseca', 'Andrade', 'Coelho', 'Rezende',
  'Buso', 'Jung', 'Suplano', 'Locatelli', 'Schiller',
];

const RUAS = [
  'Rua das Flores', 'Rua XV de Novembro', 'Av. Iguaçu', 'Rua Nilo Peçanha',
  'Rua Padre Agostinho', 'Av. República Argentina', 'Rua Marechal Deodoro',
  'Rua Emiliano Perneta', 'Av. Getúlio Vargas', 'Rua Mateus Leme',
  'Rua Carlos de Carvalho', 'Av. Sete de Setembro', 'Rua Tobias de Macedo',
  'Rua Eduardo Sprada', 'Rua João Bettega', 'Av. Winston Churchill',
  'Rua Alfredo Bufren', 'Rua Engenheiros Rebouças', 'Rua Coronel Dulcídio',
  'Rua Comendador Araújo', 'Av. Iguatemi', 'Rua Salgado Filho',
  'Rua Brigadeiro Franco', 'Rua João Negrão', 'Av. Batel',
];

const BAIRROS_CWB = [
  'Centro', 'Água Verde', 'Batel', 'Boqueirão', 'Bacacheri', 'Boa Vista',
  'Portão', 'Cajuru', 'Santa Cândida', 'Sítio Cercado', 'Tingui', 'Champagnat',
  'Rebouças', 'Xaxim', 'Tatuquara', 'Alto da Glória', 'Ahú', 'Mercês',
  'Campo Comprido', 'Hauer', 'Uberaba', 'Atuba', 'Pinheirinho', 'Novo Mundo',
  'Barreirinha', 'Bigorrilho', 'Seminário', 'Cabral', 'Pilarzinho', 'Santa Felicidade',
  'Umbará', 'Cidade Industrial', 'Capão Raso', 'Fazendinha', 'Capão da Imbuia',
];

const CIDADES_PR = [
  'Curitiba', 'Curitiba', 'Curitiba', 'Curitiba', 'Curitiba',
  'São José dos Pinhais', 'Pinhais', 'Colombo', 'Fazenda Rio Grande',
  'Araucária', 'Campo Largo', 'Almirante Tamandaré',
];

const CIDADES_ONLINE = ['São Paulo', 'Rio de Janeiro', 'Florianópolis', 'Porto Alegre', 'Belo Horizonte', 'Brasília', 'Goiânia'];
const CIDADES_DISTANCIA = ['Manaus', 'Belém', 'Recife', 'Maceió', 'Natal', 'João Pessoa', 'Fortaleza', 'Salvador'];

const ESTADOS = {
  'São Paulo': 'SP', 'Rio de Janeiro': 'RJ', 'Florianópolis': 'SC', 'Porto Alegre': 'RS',
  'Belo Horizonte': 'MG', 'Brasília': 'DF', 'Goiânia': 'GO', 'Manaus': 'AM',
  'Belém': 'PA', 'Recife': 'PE', 'Maceió': 'AL', 'Natal': 'RN',
  'João Pessoa': 'PB', 'Fortaleza': 'CE', 'Salvador': 'BA',
};

const DDDS = { 'São Paulo': '11', 'Rio de Janeiro': '21', 'Florianópolis': '48', 'Porto Alegre': '51', 'Belo Horizonte': '31', 'Brasília': '61', 'Goiânia': '62', 'Manaus': '92', 'Belém': '91', 'Recife': '81', 'Maceió': '82', 'Natal': '84', 'João Pessoa': '83', 'Fortaleza': '85', 'Salvador': '71' };

const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const HORARIOS = ['19:00', '19:30', '20:00', '20:30', '08:00', '09:00', '16:00', '17:00', '18:00'];
const DATAS = ['2019-03-01', '2019-09-01', '2020-01-15', '2020-05-01', '2020-08-01', '2021-01-10', '2021-05-01', '2021-10-01', '2022-01-15', '2022-08-01', '2023-01-15', '2023-06-01'];

// ── Gerador ─────────────────────────────────────────────────────────────────

export function generateTestData() {
  const used = new Set();

  // Gera um nome masculino único
  function nomeM() {
    let attempts = 0;
    while (attempts++ < 100) {
      const n = `${pick(NOMES_M)} ${pick(SOBRENOMES)}`;
      if (!used.has(n)) { used.add(n); return n; }
    }
    return `${pick(NOMES_M)} ${pick(SOBRENOMES)}`;
  }

  // Gera um nome feminino único
  function nomeF() {
    let attempts = 0;
    while (attempts++ < 100) {
      const n = `${pick(NOMES_F)} ${pick(SOBRENOMES)}`;
      if (!used.has(n)) { used.add(n); return n; }
    }
    return `${pick(NOMES_F)} ${pick(SOBRENOMES)}`;
  }

  // Gera um casal com mesmo sobrenome (coordenadores/líderes)
  function casal() {
    const sob = pick(SOBRENOMES);
    return { homem: `${pick(NOMES_M)} ${sob}`, mulher: `${pick(NOMES_F)} ${sob}` };
  }

  // Endereço local (Curitiba/Região)
  function addrLocal() {
    const cidade = pick(CIDADES_PR);
    return {
      logradouro: pick(RUAS),
      numero: String(range(10, 999)),
      bairro: pick(BAIRROS_CWB),
      cidade,
      estado: 'PR',
      cep: `8${range(1000, 9999)}-${range(100, 999)}`,
    };
  }

  // Endereço de outra cidade
  function addrCidade(cidade) {
    return {
      logradouro: pick(RUAS),
      numero: String(range(10, 999)),
      bairro: '',
      cidade,
      estado: ESTADOS[cidade] || 'BR',
      cep: `${range(10000, 99999)}-${range(100, 999)}`,
    };
  }

  // Registro base (hierarquia) — usa campos numerados
  function hier(tipo, rede, cg1, cg2, c1, c2, c3) {
    return {
      tipo, rede,
      coordenadorGeral1: cg1 || '', coordenadorGeral2: cg2 || '',
      coordenador1: c1 || '', coordenador2: c2 || '',
      ...(c3 ? { coordenador3: c3 } : {}),
      participantes: 0, visitantes: 0, mediaIdade: 0,
      dias: '', horario: '',
      ovelhinhas: 'NAO', areaRegiao: '', limitePessoas: 0,
      email: '',
      logradouro: '', numero: '', bairro: '', cidade: 'Curitiba', estado: 'PR', cep: '',
      criadoEm: pick(DATAS), integrantes: [],
    };
  }

  // Registro de grupo folha — usa campos numerados
  function grupo(tipo, rede, cg1, cg2, c1, c2, l1, l2, addrObj, ddd = '41') {
    const ovl = Math.random() > 0.65 ? 'SIM' : 'NAO';
    return {
      tipo, rede,
      coordenadorGeral1: cg1 || '', coordenadorGeral2: cg2 || '',
      coordenador1: c1 || '', coordenador2: c2 || '',
      lider1: l1 || '', lider2: l2 || '',
      participantes: range(6, 20), visitantes: range(0, 5),
      mediaIdade: range(18, 60),
      dias: pick(DIAS), horario: pick(HORARIOS),
      ovelhinhas: ovl, areaRegiao: addrObj.bairro || addrObj.cidade,
      limitePessoas: range(15, 30),
      email: '',
      criadoEm: pick(DATAS), integrantes: [],
      ...addrObj,
    };
  }

  const records = [];

  // ── CASAIS ────────────────────────────────────────────────────────────────
  const casaisSup = casal();
  records.push(hier('SUPERVISÃO GERAL', 'CASAIS', '', '', casaisSup.homem, casaisSup.mulher));
  for (let i = 0; i < 2; i++) {
    const cg = casal();
    records.push(hier('COORDENAÇÃO GERAL', 'CASAIS', casaisSup.homem, casaisSup.mulher, cg.homem, cg.mulher));
    for (let j = 0; j < range(2, 3); j++) {
      const c = casal();
      records.push(hier('COORDENAÇÃO', 'CASAIS', cg.homem, cg.mulher, c.homem, c.mulher));
      for (let k = 0; k < range(3, 5); k++) {
        const l = casal();
        records.push(grupo('PASTOREIO', 'CASAIS', cg.homem, cg.mulher, c.homem, c.mulher, l.homem, l.mulher, addrLocal()));
      }
    }
  }

  // ── AJ ───────────────────────────────────────────────────────────────────
  const ajSup = casal();
  records.push(hier('SUPERVISÃO GERAL', 'AJ', '', '', ajSup.homem, ajSup.mulher));
  for (let i = 0; i < 2; i++) {
    const cg = casal();
    records.push(hier('COORDENAÇÃO GERAL', 'AJ', ajSup.homem, ajSup.mulher, cg.homem, cg.mulher));
    for (let j = 0; j < 2; j++) {
      const c = casal();
      records.push(hier('COORDENAÇÃO', 'AJ', cg.homem, cg.mulher, c.homem, c.mulher));
      for (let k = 0; k < range(3, 4); k++) {
        const l = casal();
        records.push(grupo('JOVENS', 'AJ', cg.homem, cg.mulher, c.homem, c.mulher, l.homem, l.mulher, addrLocal()));
      }
    }
  }

  // ── TEEN ─────────────────────────────────────────────────────────────────
  const teenSup = casal();
  records.push(hier('SUPERVISÃO GERAL', 'TEEN', '', '', teenSup.homem, teenSup.mulher));
  for (let i = 0; i < 2; i++) {
    const cg = casal();
    records.push(hier('COORDENAÇÃO GERAL', 'TEEN', teenSup.homem, teenSup.mulher, cg.homem, cg.mulher));
    const c = casal();
    records.push(hier('COORDENAÇÃO', 'TEEN', cg.homem, cg.mulher, c.homem, c.mulher));
    for (let k = 0; k < range(2, 4); k++) {
      const l = casal();
      const r = addrLocal();
      records.push({ ...grupo('PASTOREIO', 'TEEN', cg.homem, cg.mulher, c.homem, c.mulher, l.homem, l.mulher, r), mediaIdade: range(13, 17) });
    }
  }

  // ── MULHERES ──────────────────────────────────────────────────────────────
  const mulhCg1 = `Pastora ${nomeF()}`;
  records.push(hier('COORDENAÇÃO GERAL', 'MULHERES', '', '', mulhCg1));
  for (let j = 0; j < range(2, 3); j++) {
    const c1 = nomeF();
    records.push(hier('COORDENAÇÃO', 'MULHERES', mulhCg1, '', c1));
    for (let k = 0; k < range(2, 4); k++) {
      const l = nomeF();
      records.push(grupo('PASTOREIO', 'MULHERES', mulhCg1, '', c1, '', l, '', addrLocal()));
    }
  }

  // ── HOMENS ───────────────────────────────────────────────────────────────
  const homCg1 = nomeM();
  records.push(hier('COORDENAÇÃO GERAL', 'HOMENS', '', '', homCg1));
  for (let j = 0; j < range(1, 2); j++) {
    const c1 = nomeM();
    records.push(hier('COORDENAÇÃO', 'HOMENS', homCg1, '', c1));
    for (let k = 0; k < range(2, 3); k++) {
      const l = nomeM();
      records.push({ ...grupo('PASTOREIO', 'HOMENS', homCg1, '', c1, '', l, '', addrLocal()), dias: 'Sábado', horario: pick(['08:00', '09:00']), ovelhinhas: 'NAO', mediaIdade: range(30, 60) });
    }
  }

  // ── INTEGRAÇÃO ───────────────────────────────────────────────────────────
  const intCg = casal();
  records.push(hier('COORDENAÇÃO GERAL', 'INTEGRAÇÃO', '', '', intCg.homem, intCg.mulher));
  for (let j = 0; j < 2; j++) {
    const c = casal();
    records.push(hier('COORDENAÇÃO', 'INTEGRAÇÃO', intCg.homem, intCg.mulher, c.homem, c.mulher));
    for (let k = 0; k < range(2, 4); k++) {
      const l = casal();
      records.push(grupo('PASTOREIO', 'INTEGRAÇÃO', intCg.homem, intCg.mulher, c.homem, c.mulher, l.homem, l.mulher, addrLocal()));
    }
  }

  // ── MASTER ───────────────────────────────────────────────────────────────
  const mastCg = casal();
  records.push(hier('COORDENAÇÃO GERAL', 'MASTER', '', '', mastCg.homem, mastCg.mulher));
  const mastC = casal();
  records.push(hier('COORDENAÇÃO', 'MASTER', mastCg.homem, mastCg.mulher, mastC.homem, mastC.mulher));
  for (let k = 0; k < range(2, 3); k++) {
    const l = casal();
    records.push({ ...grupo('PASTOREIO', 'MASTER', mastCg.homem, mastCg.mulher, mastC.homem, mastC.mulher, l.homem, l.mulher, addrLocal()), mediaIdade: range(55, 75) });
  }

  // ── KOINONIA ─────────────────────────────────────────────────────────────
  const koinCg = casal();
  records.push(hier('COORDENAÇÃO GERAL', 'KOINONIA', '', '', koinCg.homem, koinCg.mulher));
  const koinC = casal();
  records.push(hier('COORDENAÇÃO', 'KOINONIA', koinCg.homem, koinCg.mulher, koinC.homem, koinC.mulher));
  for (let k = 0; k < range(2, 4); k++) {
    const l = casal();
    records.push({ ...grupo('PASTOREIO', 'KOINONIA', koinCg.homem, koinCg.mulher, koinC.homem, koinC.mulher, l.homem, l.mulher, addrLocal()), mediaIdade: range(40, 65) });
  }

  // ── GF ON-LINE ───────────────────────────────────────────────────────────
  const onCg = casal();
  records.push(hier('COORDENAÇÃO GERAL', 'GF ON-LINE', '', '', onCg.homem, onCg.mulher));
  const onC = casal();
  records.push(hier('COORDENAÇÃO', 'GF ON-LINE', onCg.homem, onCg.mulher, onC.homem, onC.mulher));
  for (let k = 0; k < range(3, 5); k++) {
    const cidade = pick(CIDADES_ONLINE);
    const l = casal();
    records.push({ ...grupo('PASTOREIO', 'GF ON-LINE', onCg.homem, onCg.mulher, onC.homem, onC.mulher, l.homem, l.mulher, addrCidade(cidade), DDDS[cidade] || '41'), areaRegiao: 'Online', ovelhinhas: 'NAO', limitePessoas: range(30, 60) });
  }

  // ── GF À DISTANCIA ───────────────────────────────────────────────────────
  const distCg = casal();
  records.push(hier('COORDENAÇÃO GERAL', 'GF À DISTANCIA', '', '', distCg.homem, distCg.mulher));
  for (let k = 0; k < range(2, 4); k++) {
    const cidade = pick(CIDADES_DISTANCIA);
    const l = casal();
    records.push({ ...grupo('PASTOREIO', 'GF À DISTANCIA', distCg.homem, distCg.mulher, distCg.homem, distCg.mulher, l.homem, l.mulher, addrCidade(cidade), DDDS[cidade] || '41'), areaRegiao: 'Nacional' });
  }

  return records;
}
