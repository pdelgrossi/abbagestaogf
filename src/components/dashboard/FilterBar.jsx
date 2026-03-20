import { Filter, X, Download } from 'lucide-react';

const selectStyle = {
  background: '#F2EEE9',
  border: '1px solid #E8E2DB',
  borderRadius: '8px',
  padding: '7px 12px',
  fontSize: '13px',
  color: '#1A1614',
  outline: 'none',
  cursor: 'pointer',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  fontWeight: '500',
};

export default function FilterBar({ data, filters, setFilters, onExportFiltered }) {
  const uniq = (fn) => [...new Set(data.map(fn).filter(Boolean))].sort();
  const cidades  = uniq(g => g.cidade);
  const bairros  = uniq(g => g.bairro);
  const dias     = uniq(g => g.dias);
  const horarios = uniq(g => g.horario);
  const idadeFaixas = ['Jovens (15-25)', 'Adultos (26-40)', 'Adultos+ (41-55)', 'Sênior (56+)'];
  const hasFilters = filters.cidade || filters.bairro || filters.dia || filters.horario || filters.faixaIdade;

  const Select = ({ value, onChange, placeholder, options }) => (
    <select value={value} onChange={e => onChange(e.target.value)} style={selectStyle}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div style={{ background: '#fff', border: '1px solid #E8E2DB', borderRadius: '14px', padding: '14px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#A89E98' }}>
        <Filter size={14} />
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#A89E98', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filtros</span>
      </div>

      <Select value={filters.cidade} onChange={v => setFilters(f => ({ ...f, cidade: v, bairro: '' }))} placeholder="Todas as cidades" options={cidades} />
      <Select value={filters.bairro} onChange={v => setFilters(f => ({ ...f, bairro: v }))} placeholder="Todos os bairros" options={filters.cidade ? uniq(g => g.cidade === filters.cidade ? g.bairro : null) : bairros} />
      <Select value={filters.dia} onChange={v => setFilters(f => ({ ...f, dia: v }))} placeholder="Todos os dias" options={dias} />
      {horarios.length > 0 && <Select value={filters.horario} onChange={v => setFilters(f => ({ ...f, horario: v }))} placeholder="Todos os horários" options={horarios} />}
      <Select value={filters.faixaIdade} onChange={v => setFilters(f => ({ ...f, faixaIdade: v }))} placeholder="Todas as idades" options={idadeFaixas} />

      {hasFilters && (
        <>
          <button onClick={() => setFilters({ cidade: '', bairro: '', dia: '', horario: '', faixaIdade: '' })}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#C8102E', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontFamily: 'inherit' }}>
            <X size={13} />
            Limpar
          </button>
          {onExportFiltered && (
            <button onClick={onExportFiltered}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '12px', fontWeight: '600', color: '#fff',
                background: '#C8102E', border: 'none', borderRadius: '8px',
                padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit',
                marginLeft: '4px', transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Download size={12} />
              Exportar filtrados
            </button>
          )}
        </>
      )}
    </div>
  );
}
