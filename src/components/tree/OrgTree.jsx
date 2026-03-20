import { useState, useRef, useCallback, useEffect } from 'react';
import Tree from 'react-d3-tree';
import NodeCard, { NODE_WIDTH, NODE_HEIGHT } from './NodeCard';
import { TIPO_STYLES } from '../../utils/buildTree';
import { ChevronRight, Home } from 'lucide-react';

export default function OrgTree({ treeData, rede, onNodeClick, initialDepth = 2 }) {
  const containerRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 80, y: 300 });
  const [zoom, setZoom] = useState(0.75);
  const [breadcrumb, setBreadcrumb] = useState([]);

  useEffect(() => {
    if (containerRef.current) {
      const { height } = containerRef.current.getBoundingClientRect();
      setTranslate({ x: 80, y: height / 2 });
    }
    setBreadcrumb([]);
  }, [treeData]);

  const renderNode = useCallback(({ nodeDatum, toggleNode }) => (
    <NodeCard
      nodeDatum={nodeDatum}
      onNodeClick={(nd) => {
        if (nd.children?.length > 0) toggleNode();
        if (nd.data?._path) setBreadcrumb(nd.data._path);
        if (onNodeClick) onNodeClick(nd.data);
      }}
    />
  ), [onNodeClick]);

  if (!treeData) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A89E98', fontSize: '14px' }}>
      Nenhum dado disponível para esta rede.
    </div>
  );

  return (
    <div ref={containerRef} style={{ flex: 1, position: 'relative', background: '#FAF8F6', overflow: 'hidden' }}>
      {/* Dot grid — pointerEvents none para não bloquear interações com a árvore */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.6, pointerEvents: 'none' }}>
        <defs>
          <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#D4CEC9" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div style={{
          position: 'absolute', top: '12px', left: '12px', right: '120px',
          zIndex: 5, display: 'flex', alignItems: 'center', gap: '4px',
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)',
          border: '1px solid #E8E2DB', borderRadius: '10px',
          padding: '6px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => setBreadcrumb([])}
            title="Limpar seleção"
            style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#A89E98', padding: 0 }}
          >
            <Home size={12} />
          </button>
          {breadcrumb.map((item, i) => {
            const style = TIPO_STYLES[item.tipo] || {};
            const isLast = i === breadcrumb.length - 1;
            return (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ChevronRight size={11} color="#D4CEC9" />
                <span style={{
                  fontSize: '11px', fontWeight: isLast ? '700' : '500',
                  color: isLast ? (style.bg || '#1A1614') : '#7A706A',
                  maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {item.name}
                </span>
              </span>
            );
          })}
        </div>
      )}

      <Tree
        data={treeData}
        orientation="horizontal"
        renderCustomNodeElement={renderNode}
        translate={translate}
        zoom={zoom}
        nodeSize={{ x: NODE_WIDTH + 60, y: NODE_HEIGHT + 36 }}
        separation={{ siblings: 1.2, nonSiblings: 1.4 }}
        pathFunc="step"
        onUpdate={({ zoom: z, translate: t }) => {
          if (z !== undefined) setZoom(z);
          if (t !== undefined) setTranslate(t);
        }}
        svgProps={{ style: { background: 'transparent' } }}
        initialDepth={initialDepth}
        zoomable
        draggable
      />

      {/* Controls */}
      <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => { setZoom(0.75); if (containerRef.current) { const {height} = containerRef.current.getBoundingClientRect(); setTranslate({x: 80, y: height/2}); }}}
          style={{ background: '#fff', border: '1px solid #E8E2DB', color: '#7A706A', fontSize: '12px', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '600', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          Resetar Zoom
        </button>
        <div style={{ background: '#fff', border: '1px solid #E8E2DB', borderRadius: '8px', padding: '5px 14px', fontSize: '12px', color: '#A89E98', textAlign: 'center', fontWeight: '600', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          {Math.round(zoom * 100)}%
        </div>
      </div>

      <style>{`.rd3t-link { stroke: #D4CEC9 !important; stroke-width: 1.5 !important; }`}</style>
    </div>
  );
}
