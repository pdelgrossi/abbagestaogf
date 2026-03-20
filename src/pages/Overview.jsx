import { useState } from 'react';
import StatsCards from '../components/dashboard/StatsCards';
import ParticipantesChart from '../components/dashboard/BarChart';
import FilterBar from '../components/dashboard/FilterBar';
import HistoricoChart from '../components/dashboard/HistoricoChart';
import { REDES, REDE_COLORS, getTotalParticipantesByRede, getGroupCountByRede } from '../utils/buildTree';
import { useHistorico } from '../hooks/useHistorico';
import { exportToXlsx } from '../utils/exportXlsx';
import { Users, ChevronRight } from 'lucide-react';

export default function Overview({ data, onSelectRede }) {
  const [filters, setFilters] = useState({ cidade: '', bairro: '', dia: '', horario: '', faixaIdade: '' });
  const { historico, registrarMes, removerMes } = useHistorico(data);
  const leafTypes = ['PASTOREIO', 'JOVENS', 'CASAIS'];

  const filteredData = data.filter(g => {
    if (!leafTypes.includes(g.tipo)) return false;
    if (filters.cidade && g.cidade !== filters.cidade) return false;
    if (filters.bairro && g.bairro !== filters.bairro) return false;
    if (filters.dia && g.dias !== filters.dia) return false;
    if (filters.horario && g.horario !== filters.horario) return false;
    if (filters.faixaIdade) {
      const age = g.mediaIdade || 0;
      if (filters.faixaIdade === 'Jovens (15-25)' && (age < 15 || age > 25)) return false;
      if (filters.faixaIdade === 'Adultos (26-40)' && (age < 26 || age > 40)) return false;
      if (filters.faixaIdade === 'Adultos+ (41-55)' && (age < 41 || age > 55)) return false;
      if (filters.faixaIdade === 'Sênior (56+)' && age < 56) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1614', margin: 0, letterSpacing: '-0.5px' }}>Visão Geral</h2>
        <p style={{ fontSize: '13px', color: '#A89E98', margin: '4px 0 0', fontWeight: '500' }}>Igreja Comunhão Cristã Abba — Curitiba, PR</p>
      </div>

      <StatsCards data={filteredData} />

      {/* FilterBar recebe data completo para popular as opções dos selects */}
      <FilterBar
        data={data.filter(g => leafTypes.includes(g.tipo))}
        filters={filters}
        setFilters={setFilters}
        onExportFiltered={() => exportToXlsx(data, 'filtered', null, filteredData)}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        <ParticipantesChart data={filteredData} />

        {/* Rede cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignContent: 'start' }}>
          {REDES.map(rede => {
            const color = REDE_COLORS[rede];
            const groups = getGroupCountByRede(filteredData, rede);
            const participants = getTotalParticipantesByRede(filteredData, rede);
            // coordGeral vem do dataset completo (não está em filteredData pois não é folha)
            const coordGeral = data.find(g => g.rede === rede && (g.tipo === 'SUPERVISÃO GERAL' || g.tipo === 'COORDENAÇÃO GERAL'));
            if (groups === 0) return null;
            return (
              <button key={rede} onClick={() => onSelectRede(rede)}
                style={{
                  background: '#fff',
                  border: '1px solid #E8E2DB',
                  borderTop: `3px solid ${color}`,
                  borderRadius: '12px',
                  padding: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'all 0.15s',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#1A1614' }}>{rede}</span>
                  <ChevronRight size={13} color="#C8C2BC" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#7A706A' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={11} /> {participants}</span>
                  <span>{groups} grupos</span>
                </div>
                {coordGeral && (
                  <div style={{ fontSize: '11px', color: '#A89E98', marginTop: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>
                    {coordGeral.coordenador}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <HistoricoChart
        historico={historico}
        registrarMes={registrarMes}
        removerMes={removerMes}
      />
    </div>
  );
}
