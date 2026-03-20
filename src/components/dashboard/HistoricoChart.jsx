import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { REDES, REDE_COLORS } from '../../utils/buildTree';
import { TrendingUp, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const MONTH_LABELS = {
  '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr',
  '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago',
  '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez',
};

function formatMes(mes) {
  const [year, month] = mes.split('-');
  return `${MONTH_LABELS[month]}/${year.slice(2)}`;
}

function getCurrentMonth() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E8E2DB',
      borderRadius: '10px',
      padding: '10px 14px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      fontSize: '12px',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
    }}>
      <div style={{ fontWeight: '700', color: '#1A1614', marginBottom: '6px' }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: p.color, marginBottom: '2px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ color: '#7A706A' }}>{p.name}:</span>
          <span style={{ fontWeight: '600', color: '#1A1614' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function HistoricoChart({ historico, registrarMes, removerMes }) {
  const [mesInput, setMesInput] = useState(getCurrentMonth);
  const [porRede, setPorRede] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const chartData = historico.map(e => ({
    mes: formatMes(e.mes),
    mesRaw: e.mes,
    Total: e.total,
    ...e.porRede,
  }));

  const redesPresentes = historico.length
    ? [...new Set(historico.flatMap(e => Object.keys(e.porRede || {})))]
    : [];

  const isEmpty = historico.length === 0;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E8E2DB',
      borderRadius: '16px',
      padding: '20px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={15} color="#C8102E" />
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1A1614' }}>Histórico de Participantes</span>
          </div>
          <p style={{ fontSize: '12px', color: '#A89E98', margin: '3px 0 0', fontWeight: '500' }}>
            Evolução mensal dos grupos ativos
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Toggle por rede */}
          {!isEmpty && (
            <button
              onClick={() => setPorRede(v => !v)}
              title={porRede ? 'Ver total' : 'Ver por rede'}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '12px', fontWeight: '500', color: porRede ? '#C8102E' : '#A89E98',
                background: porRede ? '#FFF0F0' : '#F2EEE9',
                border: `1px solid ${porRede ? '#FFDDE0' : '#E8E2DB'}`,
                borderRadius: '8px', padding: '5px 10px', cursor: 'pointer',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                transition: 'all 0.15s',
              }}
            >
              {porRede ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
              Por rede
            </button>
          )}

          {/* Add month button */}
          <button
            onClick={() => setShowAdd(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '12px', fontWeight: '600', color: '#fff',
              background: '#C8102E', border: 'none',
              borderRadius: '8px', padding: '5px 12px', cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Plus size={12} />
            Registrar mês
          </button>
        </div>
      </div>

      {/* Add month panel */}
      {showAdd && (
        <div style={{
          background: '#FAF8F6', border: '1px solid #E8E2DB',
          borderRadius: '10px', padding: '12px 16px', marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#7A706A' }}>
            Capturar snapshot de:
          </span>
          <input
            type="month"
            value={mesInput}
            onChange={e => setMesInput(e.target.value)}
            style={{
              background: '#fff', border: '1px solid #E8E2DB',
              borderRadius: '8px', padding: '5px 10px',
              fontSize: '13px', color: '#1A1614',
              outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif',
              cursor: 'pointer',
            }}
          />
          <button
            onClick={() => { if (mesInput) { registrarMes(mesInput); setShowAdd(false); } }}
            style={{
              fontSize: '12px', fontWeight: '600', color: '#fff',
              background: '#1A1614', border: 'none',
              borderRadius: '8px', padding: '6px 14px', cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            Salvar
          </button>
          <button
            onClick={() => setShowAdd(false)}
            style={{
              fontSize: '12px', color: '#A89E98',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Empty state */}
      {isEmpty ? (
        <div style={{
          height: '200px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}>
          <TrendingUp size={28} color="#E8E2DB" />
          <p style={{ fontSize: '13px', color: '#C8C2BC', fontWeight: '500', margin: 0, textAlign: 'center' }}>
            Nenhum dado ainda.<br />Clique em "Registrar mês" para começar o histórico.
          </p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2EEE9" vertical={false} />
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 11, fill: '#A89E98', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#A89E98', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                axisLine={false} tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              {porRede ? (
                redesPresentes.map(rede => (
                  <Line
                    key={rede}
                    type="monotone"
                    dataKey={rede}
                    name={rede}
                    stroke={REDE_COLORS[rede] || '#A89E98'}
                    strokeWidth={2}
                    dot={{ r: 3, fill: REDE_COLORS[rede] || '#A89E98', strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey="Total"
                  name="Total"
                  stroke="#C8102E"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#C8102E', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#C8102E' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>

          {/* Month list */}
          <div style={{ marginTop: '14px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {historico.map(e => (
              <div key={e.mes} style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: '#F2EEE9', borderRadius: '6px', padding: '3px 8px',
                fontSize: '11px', fontWeight: '500', color: '#7A706A',
              }}>
                <span>{formatMes(e.mes)}</span>
                <span style={{ color: '#1A1614', fontWeight: '700' }}>{e.total}</span>
                <button
                  onClick={() => removerMes(e.mes)}
                  title="Remover"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8C2BC', display: 'flex', padding: '0 0 0 2px', lineHeight: 1 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C8102E'}
                  onMouseLeave={e => e.currentTarget.style.color = '#C8C2BC'}
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
