import { useState } from 'react';
import { Users, Upload, Download, RotateCcw, FileDown, FlaskConical, BarChart2, MapPin, Layers, Pencil, X, Check } from 'lucide-react';
import { REDES, getTotalParticipantesByRede, getGroupCountByRede } from '../../utils/buildTree';
import { downloadTemplate } from '../../utils/exportXlsx';
import { useRedeConfig } from '../../hooks/useRedeConfig';

const COLOR_PALETTE = [
  '#ef4444', '#dc2626', '#b91c1c', '#7f1d1d',
  '#f97316', '#ea580c', '#c2410c', '#9a3412',
  '#f59e0b', '#d97706', '#b45309', '#92400e',
  '#84cc16', '#65a30d', '#4d7c0f', '#3f6212',
  '#22c55e', '#16a34a', '#15803d', '#166534',
  '#14b8a6', '#0d9488', '#0f766e', '#115e59',
  '#06b6d4', '#0891b2', '#0e7490', '#155e75',
  '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af',
  '#6366f1', '#4f46e5', '#4338ca', '#3730a3',
  '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6',
  '#ec4899', '#db2777', '#be185d', '#9d174d',
  '#f43f5e', '#e11d48', '#be123c', '#9f1239',
  '#64748b', '#475569', '#334155', '#1e293b',
  '#a16207', '#78350f', '#1f2937', '#0f172a',
];

function RedeEditModal({ rede, initialColor, initialLabel, onSave, onClose }) {
  const [color, setColor] = useState(initialColor);
  const [label, setLabel] = useState(initialLabel);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.25)',
        backdropFilter: 'blur(2px)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '22px 24px',
        width: '320px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        border: '1px solid #E8E2DB', display: 'flex', flexDirection: 'column',
        gap: '16px', fontFamily: 'Plus Jakarta Sans, sans-serif',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '14px', fontWeight: '800', color: '#1A1614' }}>Editar rede</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89E98', padding: 0, display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        {/* Preview */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: '#FAF8F6', borderRadius: '10px', padding: '10px 14px',
          border: '1px solid #E8E2DB',
        }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: color, flexShrink: 0 }} />
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#1A1614' }}>{label || rede}</span>
        </div>

        {/* Nome */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: '700', color: '#7A706A', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Nome
          </label>
          <input
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder={rede}
            style={{
              width: '100%', boxSizing: 'border-box',
              border: '1px solid #E8E2DB', borderRadius: '8px',
              padding: '8px 10px', fontSize: '13px', fontWeight: '600',
              color: '#1A1614', fontFamily: 'Plus Jakarta Sans, sans-serif', outline: 'none',
            }}
          />
        </div>

        {/* Paleta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '11px', fontWeight: '700', color: '#7A706A', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Cor
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '6px' }}>
            {COLOR_PALETTE.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                title={c}
                style={{
                  width: '28px', height: '28px', borderRadius: '6px', background: c,
                  border: color === c ? '3px solid #1A1614' : '2px solid transparent',
                  cursor: 'pointer', padding: 0, boxSizing: 'border-box',
                  outline: color === c ? '2px solid #fff' : 'none',
                  outlineOffset: '-4px',
                }}
              />
            ))}
          </div>
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
              background: '#F2EEE9', color: '#7A706A', border: 'none', cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(color, label)}
            style={{
              padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700',
              background: color, color: '#fff', border: 'none', cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
          >
            <Check size={13} /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ data, activeRede, activeView, onSelectRede, onSelectView, onImport, onExport, onReset, onInjectTest }) {
  const { getColor, getLabel, updateRede } = useRedeConfig();
  const [editingRede, setEditingRede] = useState(null);

  return (
    <aside style={{
      width: '256px',
      background: '#FFFFFF',
      borderRight: '1px solid #E8E2DB',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      left: 0, top: 0, zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #E8E2DB' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', background: '#C8102E',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Users size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '16px', color: '#1A1614', letterSpacing: '-0.3px' }}>GF Abba</div>
            <div style={{ fontSize: '11px', color: '#A89E98', fontWeight: '500' }}>Grupos Familiares</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        <NavItem
          icon={<BarChart2 size={15} />}
          label="Visão Geral"
          badge={data.filter(g => ['PASTOREIO','JOVENS','CASAIS'].includes(g.tipo)).length}
          active={activeView === 'overview'}
          onClick={() => onSelectView('overview')}
        />
        <NavItem
          icon={<MapPin size={15} />}
          label="Mapa"
          active={activeView === 'mapa'}
          onClick={() => onSelectView('mapa')}
        />

        <SectionLabel>Redes</SectionLabel>

        <NavItem
          icon={<Layers size={14} />}
          label="Todos"
          badge={data.filter(g => ['PASTOREIO','JOVENS','CASAIS'].includes(g.tipo)).reduce((s, g) => s + (g.participantes || 0), 0) || undefined}
          active={activeView === 'rede' && activeRede === 'TODOS'}
          onClick={() => { onSelectView('rede'); onSelectRede('TODOS'); }}
          bold
        />

        {REDES.map(rede => {
          const participants = getTotalParticipantesByRede(data, rede);
          if (getGroupCountByRede(data, rede) === 0) return null;
          const active = activeView === 'rede' && activeRede === rede;
          const color = getColor(rede);
          const label = getLabel(rede);
          return (
            <div key={rede} style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '2px' }}>
              <NavItem
                dot={color}
                label={label}
                badge={participants || undefined}
                active={active}
                onClick={() => { onSelectView('rede'); onSelectRede(rede); }}
                noMargin
              />
              <button
                onClick={() => setEditingRede(rede)}
                title={`Editar rede ${label}`}
                style={{
                  flexShrink: 0, background: 'none', border: 'none',
                  cursor: 'pointer', color: '#C8C2BC', padding: '6px 5px',
                  borderRadius: '6px', display: 'flex', alignItems: 'center',
                  transition: 'color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.background = '#FAF8F6'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#C8C2BC'; e.currentTarget.style.background = 'none'; }}
              >
                <Pencil size={11} />
              </button>
            </div>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div style={{ padding: '12px', borderTop: '1px solid #E8E2DB' }}>
        <ActionBtn icon={<Upload size={14} />} label="Importar XLSX" onClick={onImport} />
        <ActionBtn icon={<Download size={14} />} label="Exportar XLSX" onClick={() => onExport('all')} />
        <ActionBtn icon={<FileDown size={14} />} label="Baixar modelo" onClick={downloadTemplate} />
        <ActionBtn icon={<FlaskConical size={14} />} label="Injetar dados de teste" onClick={onInjectTest} />
        <ActionBtn icon={<RotateCcw size={13} />} label="Zerar dados" onClick={onReset} muted />
      </div>

      {/* Edit modal */}
      {editingRede && (
        <RedeEditModal
          rede={editingRede}
          initialColor={getColor(editingRede)}
          initialLabel={getLabel(editingRede)}
          onSave={(color, label) => {
            updateRede(editingRede, { color, label });
            setEditingRede(null);
          }}
          onClose={() => setEditingRede(null)}
        />
      )}
    </aside>
  );
}

function NavItem({ icon, dot, label, badge, active, onClick, bold, noMargin }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, minWidth: 0,
        display: 'flex', alignItems: 'center', gap: '9px',
        padding: '8px 10px',
        borderRadius: '8px', border: 'none', cursor: 'pointer',
        textAlign: 'left',
        marginBottom: noMargin ? 0 : '2px',
        transition: 'all 0.15s',
        background: active ? '#FFF0F0' : 'transparent',
        borderLeft: active ? '3px solid #C8102E' : '3px solid transparent',
        paddingLeft: active ? '7px' : '10px',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#FAF8F6'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      {icon && <span style={{ color: active ? '#C8102E' : '#A89E98', flexShrink: 0, display: 'flex' }}>{icon}</span>}
      {dot && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: dot, flexShrink: 0 }} />}
      <span style={{
        flex: 1, fontSize: '13px',
        fontWeight: active ? '700' : bold ? '600' : '500',
        color: active ? '#C8102E' : '#1A1614',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{label}</span>
      {badge !== undefined && (
        <span style={{
          fontSize: '11px', fontWeight: '600',
          color: active ? '#C8102E' : '#A89E98',
          background: active ? '#FFDDE0' : '#F2EEE9',
          padding: '1px 7px', borderRadius: '20px', flexShrink: 0,
        }}>{badge}</span>
      )}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '10px', fontWeight: '700', color: '#A89E98',
      textTransform: 'uppercase', letterSpacing: '0.8px', padding: '12px 10px 6px',
    }}>{children}</div>
  );
}

function ActionBtn({ icon, label, onClick, muted }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '9px',
        padding: '7px 10px', borderRadius: '8px', border: 'none',
        background: 'transparent', cursor: 'pointer', marginBottom: '1px',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#FAF8F6'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ color: muted ? '#C8C2BC' : '#7A706A', display: 'flex', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: '13px', fontWeight: '500', color: muted ? '#C8C2BC' : '#7A706A' }}>{label}</span>
    </button>
  );
}
