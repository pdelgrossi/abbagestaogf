import { Users, Network, TrendingUp, BarChart2 } from 'lucide-react';

const card = () => ({
  background: '#FFFFFF',
  border: '1px solid #E8E2DB',
  borderRadius: '14px',
  padding: '20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
});

const iconBox = (bg) => ({
  width: '40px', height: '40px',
  background: bg,
  borderRadius: '10px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
});

export default function StatsCards({ data }) {
  const leafTypes = ['PASTOREIO', 'JOVENS', 'CASAIS'];
  const groups = data.filter(g => leafTypes.includes(g.tipo));
  const totalGroups = groups.length;
  const totalParticipants = groups.reduce((s, g) => s + (g.participantes || 0), 0);
  const totalRedes = [...new Set(data.map(g => g.rede))].length;
  const avgParticipants = totalGroups > 0 ? Math.round(totalParticipants / totalGroups) : 0;

  const cards = [
    { label: 'Total de Grupos', value: totalGroups, Icon: BarChart2, iconBg: '#FFF0F0', iconColor: '#C8102E' },
    { label: 'Participantes', value: totalParticipants.toLocaleString('pt-BR'), Icon: Users, iconBg: '#F0F7FF', iconColor: '#2563EB' },
    { label: 'Redes Ativas', value: totalRedes, Icon: Network, iconBg: '#F3F0FF', iconColor: '#7C3AED' },
    { label: 'Média por Grupo', value: avgParticipants, Icon: TrendingUp, iconBg: '#F0FDF4', iconColor: '#16A34A' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
      {cards.map(({ label, value, Icon, iconBg, iconColor }) => (
        <div key={label} style={card()}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '500', color: '#A89E98', marginBottom: '6px' }}>{label}</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#1A1614', letterSpacing: '-1px' }}>{value}</div>
            </div>
            <div style={iconBox(iconBg)}>
              <Icon size={18} color={iconColor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
