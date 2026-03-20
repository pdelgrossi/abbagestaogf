import { TIPO_STYLES, REDE_COLORS, getLideresArray } from '../../utils/buildTree';

export const NODE_WIDTH = 220;
export const NODE_HEIGHT = 112;

const LEAF_TYPES = ['PASTOREIO', 'JOVENS', 'CASAIS'];

const TIPO_LABEL = {
  'ROOT':              'Todos',
  'REDE':              'Rede',
  'SUPERVISÃO GERAL':  'Supervisão Geral',
  'COORDENAÇÃO GERAL': 'Coord. Geral',
  'COORDENAÇÃO':       'Coordenação',
  'PASTOREIO':         'Grupo',
  'JOVENS':            'Grupo',
  'CASAIS':            'Grupo',
  'INTEGRANTE':        'Integrante',
};

const CHILD_LABEL = {
  'ROOT':              'redes',
  'REDE':              'supervisões',
  'SUPERVISÃO GERAL':  'coord. gerais',
  'COORDENAÇÃO GERAL': 'coordenações',
  'COORDENAÇÃO':       'grupos',
  'PASTOREIO':         'integrantes',
  'JOVENS':            'integrantes',
  'CASAIS':            'integrantes',
};

function truncate(str, max) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

function UserIcon({ color = '#A89E98' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, marginTop: '1px' }}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MemberCard({ nodeDatum, onNodeClick }) {
  const style = TIPO_STYLES['INTEGRANTE'];
  const data = nodeDatum.data || {};

  return (
    <g onClick={() => onNodeClick && onNodeClick(nodeDatum)}>
      <foreignObject x={-NODE_WIDTH / 2} y={-28} width={NODE_WIDTH} height={56} style={{ overflow: 'visible', background: '#F9F7F5' }}>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            background: '#F9F7F5',
            border: '1px solid #E8E2DB',
            borderLeft: `3px solid ${style.bg}`,
            borderRadius: '8px',
            padding: '7px 11px',
            cursor: 'default',
            width: `${NODE_WIDTH}px`,
            height: '56px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '3px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}
        >
          <p style={{ margin: 0, color: '#1A1614', fontSize: '11px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {truncate(nodeDatum.name, 30)}
          </p>
        </div>
      </foreignObject>
    </g>
  );
}

function NameRow({ name, color }) {
  if (!name) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
      <UserIcon color={color} />
      <span style={{
        color: '#1A1614',
        fontSize: '11px',
        fontWeight: '700',
        lineHeight: '1.3',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
      }}>
        {truncate(name, 26)}
      </span>
    </div>
  );
}

export default function NodeCard({ nodeDatum, onNodeClick }) {
  const tipo = nodeDatum.attributes?.tipo || '';

  if (tipo === 'INTEGRANTE') {
    return <MemberCard nodeDatum={nodeDatum} onNodeClick={onNodeClick} />;
  }

  const redeAttr = nodeDatum.attributes?.rede || '';
  const style = tipo === 'REDE'
    ? { bg: REDE_COLORS[redeAttr] || '#94a3b8', label: redeAttr }
    : (TIPO_STYLES[tipo] || TIPO_STYLES['PASTOREIO']);
  const participantes = nodeDatum.attributes?.participantes || 0;
  const data = nodeDatum.data || {};
  const isLeaf = LEAF_TYPES.includes(tipo);

  const collapsed = nodeDatum.__rd3t?.collapsed === true;
  const childCount = nodeDatum.children?.length || 0;
  const hasChildren = childCount > 0;

  // Obtém array de líderes/coordenadores para exibição (até 2 no card)
  const allLideres = getLideresArray(data);
  const displayLideres = allLideres.slice(0, 2);
  const extraCount = allLideres.length - displayLideres.length;
  const nomeUnico = allLideres.length === 0 ? (nodeDatum.name || '') : '';


  const limite = isLeaf ? (data.limitePessoas || 0) : 0;
  const vagas = limite > 0 ? limite - participantes : null;

  const bgColor = collapsed && hasChildren ? '#F2EDE8' : '#FFFFFF';
  const borderColor = collapsed && hasChildren ? style.bg : '#E8E2DB';
  const iconColor = style.bg;

  return (
    <g onClick={() => onNodeClick && onNodeClick(nodeDatum)}>
      <foreignObject
        x={-NODE_WIDTH / 2}
        y={-NODE_HEIGHT / 2}
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        style={{ overflow: 'visible', background: bgColor }}
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            background: bgColor,
            border: `1px solid ${borderColor}`,
            borderLeft: `3px solid ${style.bg}`,
            borderRadius: '10px',
            padding: '8px 11px 7px',
            cursor: 'pointer',
            width: `${NODE_WIDTH}px`,
            height: `${NODE_HEIGHT}px`,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: collapsed && hasChildren
              ? '0 2px 8px rgba(0,0,0,0.12)'
              : '0 1px 4px rgba(0,0,0,0.06)',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
          }}
        >
          {/* Badge de tipo */}
          <span style={{
            background: '#F2EDE8',
            color: style.bg,
            fontSize: '8px',
            fontWeight: '700',
            padding: '2px 6px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            alignSelf: 'flex-start',
          }}>
            {TIPO_LABEL[tipo] || style.label}
          </span>

          {/* Nomes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', margin: '4px 0 0' }}>
            {nomeUnico
              ? <NameRow name={nomeUnico} color={iconColor} />
              : displayLideres.map((nome, i) => (
                  <NameRow key={i} name={nome} color={iconColor} />
                ))
            }
            {extraCount > 0 && (
              <span style={{ fontSize: '9px', color: '#A89E98', fontWeight: '600', marginLeft: '15px' }}>
                +{extraCount} mais
              </span>
            )}
          </div>


          {/* Linha final: integrantes + vagas + expandido/colapsado */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            {isLeaf ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {participantes > 0 && (
                  <span style={{ background: '#F2EEE9', color: '#7A706A', fontSize: '9px', fontWeight: '600', padding: '2px 7px', borderRadius: '4px' }}>
                    {participantes} integrantes
                  </span>
                )}
                {vagas !== null && (
                  <span style={{
                    background: vagas > 0 ? '#DCFCE7' : '#FEE2E2',
                    color: vagas > 0 ? '#15803D' : '#B91C1C',
                    fontSize: '9px', fontWeight: '700', padding: '2px 7px', borderRadius: '4px', whiteSpace: 'nowrap',
                  }}>
                    {vagas > 0 ? `${vagas} vagas` : vagas === 0 ? 'Lotado' : `+${Math.abs(vagas)} acima`}
                  </span>
                )}
              </div>
            ) : (
              <span />
            )}

            {hasChildren && (
              collapsed ? (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '3px',
                  background: style.bg, color: '#fff',
                  fontSize: '9px', fontWeight: '700', padding: '2px 7px', borderRadius: '4px', letterSpacing: '0.2px',
                }}>
                  {childCount} {CHILD_LABEL[tipo] || 'filhos'} ▶
                </span>
              ) : (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '3px',
                  background: '#F2EEE9', color: '#A89E98',
                  fontSize: '9px', fontWeight: '600', padding: '2px 7px', borderRadius: '4px',
                }}>
                  {childCount} {CHILD_LABEL[tipo] || 'filhos'} ▾
                </span>
              )
            )}
          </div>
        </div>
      </foreignObject>
    </g>
  );
}
