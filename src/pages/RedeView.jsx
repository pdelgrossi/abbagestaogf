import { useState, useMemo, useEffect } from 'react';
import OrgTree from '../components/tree/OrgTree';
import DetailPanel from '../components/tree/DetailPanel';
import { buildTreeForRede, buildTreeForAll, REDE_COLORS, getTotalParticipantesByRede, getGroupCountByRede } from '../utils/buildTree';
import { Users, GitBranch } from 'lucide-react';

const TODOS_COLOR = '#1A1614';

export default function RedeView({ data, rede, onUpdateGrupo }) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const isTodos = rede === 'TODOS';

  // Após data atualizar (via updateGrupo), sincroniza selectedGroup com os dados migrados
  useEffect(() => {
    if (!selectedGroup?._id) return;
    const fresh = data.find(g => g._id === selectedGroup._id);
    if (fresh) setSelectedGroup(prev => ({ ...fresh, _path: prev._path }));
  }, [data]);

  const handleUpdate = (original, updates) => {
    if (onUpdateGrupo) onUpdateGrupo(original, updates);
    // selectedGroup será atualizado pelo useEffect acima quando data mudar
  };
  const treeData = useMemo(
    () => isTodos ? buildTreeForAll(data) : buildTreeForRede(data, rede),
    [data, rede, isTodos]
  );
  const color = isTodos ? TODOS_COLOR : (REDE_COLORS[rede] || '#E8E2DB');
  const totalParticipants = getTotalParticipantesByRede(data, rede);
  const totalGroups = getGroupCountByRede(data, rede);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '4px', height: '40px', borderRadius: '2px', background: color, flexShrink: 0 }} />
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1A1614', margin: 0, letterSpacing: '-0.4px' }}>{isTodos ? 'Todos os Grupos' : rede}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '3px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#7A706A', fontWeight: '500' }}>
                <GitBranch size={12} /> {totalGroups} grupos
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#7A706A', fontWeight: '500' }}>
                <Users size={12} /> {totalParticipants} participantes
              </span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#A89E98', background: '#fff', border: '1px solid #E8E2DB', borderRadius: '8px', padding: '7px 14px', fontWeight: '500' }}>
          Clique num nó para detalhes · Clique no pai para expandir
        </div>
      </div>

      <div style={{ flex: 1, borderRadius: '14px', overflow: 'hidden', border: '1px solid #E8E2DB', display: 'flex', minHeight: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <OrgTree treeData={treeData} rede={rede} initialDepth={isTodos ? 1 : 2} onNodeClick={(d) => { if (!d?._isIntegrante && d?.tipo !== 'ROOT') setSelectedGroup(d); }} />
        {selectedGroup && <DetailPanel grupo={selectedGroup} onClose={() => setSelectedGroup(null)} onUpdate={handleUpdate} />}
      </div>
    </div>
  );
}
