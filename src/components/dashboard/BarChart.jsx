import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { REDES, REDE_COLORS, getTotalParticipantesByRede, getGroupCountByRede } from '../../utils/buildTree';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #E8E2DB', borderRadius: '10px', padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '13px' }}>
      <div style={{ fontWeight: '700', color: '#1A1614', marginBottom: '4px' }}>{payload[0].payload.rede}</div>
      <div style={{ color: '#7A706A' }}>Participantes: <strong style={{ color: '#1A1614' }}>{payload[0].value}</strong></div>
      <div style={{ color: '#7A706A' }}>Grupos: <strong style={{ color: '#1A1614' }}>{payload[0].payload.grupos}</strong></div>
    </div>
  );
};

export default function ParticipantesChart({ data }) {
  const chartData = REDES.map(rede => ({
    rede,
    redeShort: rede.length > 14 ? rede.slice(0, 12) + '\u2026' : rede,
    participantes: getTotalParticipantesByRede(data, rede),
    grupos: getGroupCountByRede(data, rede),
    color: REDE_COLORS[rede],
  })).filter(d => d.participantes > 0);

  return (
    <div style={{ background: '#fff', border: '1px solid #E8E2DB', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: '14px', fontWeight: '700', color: '#1A1614', marginBottom: '16px' }}>Participantes por Rede</div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 20, top: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F2EEE9" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#A89E98', fontSize: 11, fontFamily: 'Plus Jakarta Sans' }} axisLine={false} tickLine={false} />
          <YAxis dataKey="redeShort" type="category" tick={{ fill: '#7A706A', fontSize: 11, fontFamily: 'Plus Jakarta Sans' }} axisLine={false} tickLine={false} width={96} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200,16,46,0.04)' }} />
          <Bar dataKey="participantes" radius={[0, 6, 6, 0]}>
            {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
