import { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { REDE_COLORS } from '../../utils/buildTree';

export default function Header({ query, setQuery, results, onSelectResult, activeRede }) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header style={{
      height: '56px',
      background: '#FFFFFF',
      borderBottom: '1px solid #E8E2DB',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: '16px',
      position: 'fixed',
      top: 0,
      left: '256px',
      right: 0,
      zIndex: 10,
    }}>
      <div style={{ flex: 1, position: 'relative', maxWidth: '440px' }}>
        <Search size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#A89E98' }} />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='Buscar grupos, líderes, coordenadores...'
          style={{
            width: '100%',
            background: '#F2EEE9',
            border: '1px solid #E8E2DB',
            borderRadius: '24px',
            padding: '8px 36px 8px 38px',
            fontSize: '13px',
            color: '#1A1614',
            outline: 'none',
            transition: 'all 0.15s',
            fontFamily: 'inherit',
          }}
          onFocus={e => { setFocused(true); e.target.style.borderColor = '#C8102E'; e.target.style.background = '#fff'; }}
          onBlur={e => { e.target.style.borderColor = '#E8E2DB'; e.target.style.background = '#F2EEE9'; }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#A89E98', display: 'flex' }}>
            <X size={13} />
          </button>
        )}

        {focused && results.length > 0 && (
          <div ref={dropdownRef} style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#FFFFFF',
            border: '1px solid #E8E2DB',
            borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            overflow: 'hidden',
            zIndex: 50,
          }}>
            <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {results.map(g => (
                <button key={g.id} onClick={() => { onSelectResult(g); setFocused(false); setQuery(''); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left', borderBottom: '1px solid #F2EEE9',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAF8F6'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: REDE_COLORS[g.rede], flexShrink: 0, marginTop: '5px' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1614', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {g.lider || g.coordenador || g.grupoFamiliar}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <span style={{ fontSize: '11px', color: '#A89E98' }}>{g.rede}</span>
                      {g.coordenadorGeral && <><ChevronRight size={9} color="#C8C2BC" /><span style={{ fontSize: '11px', color: '#A89E98', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.coordenadorGeral}</span></>}
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', color: '#C8C2BC', fontWeight: '500', flexShrink: 0, marginTop: '2px', background: '#F2EEE9', padding: '2px 8px', borderRadius: '10px' }}>{g.tipo}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {activeRede && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: REDE_COLORS[activeRede] }} />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1A1614' }}>{activeRede}</span>
        </div>
      )}
    </header>
  );
}
