import { useState, useRef, useCallback } from 'react';
import { Upload, X, AlertCircle, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { parseXlsx } from '../../utils/importXlsx';

export default function ImportModal({ onClose, onConfirm }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = useCallback(async (f) => {
    if (!f) return;
    if (!['.xlsx', '.xls'].some(ext => f.name.toLowerCase().endsWith(ext))) {
      setError('Formato inválido. Use .xlsx ou .xls'); return;
    }
    setFile(f); setLoading(true); setError(null);
    try { const res = await parseXlsx(f); setResult(res); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,22,20,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', border: '1px solid #E8E2DB', borderRadius: '20px', width: '100%', maxWidth: '560px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.12)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #F2EEE9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: '#FFF0F0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={16} color="#C8102E" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#1A1614' }}>Importar Planilha</div>
              <div style={{ fontSize: '12px', color: '#A89E98', fontWeight: '500' }}>Arquivos .xlsx ou .xls</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#F2EEE9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7A706A' }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!result && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? '#C8102E' : '#E8E2DB'}`,
                borderRadius: '14px',
                padding: '40px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragging ? '#FFF0F0' : '#FAF8F6',
                transition: 'all 0.15s',
              }}
            >
              <FileSpreadsheet size={32} color="#D4CEC9" style={{ marginBottom: '12px' }} />
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1A1614', marginBottom: '4px' }}>Arraste e solte ou clique para selecionar</div>
              <div style={{ fontSize: '12px', color: '#A89E98' }}>Suporta .xlsx e .xls</div>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ width: '32px', height: '32px', border: '2px solid #C8102E', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
              <div style={{ fontSize: '13px', color: '#A89E98' }}>Processando arquivo...</div>
            </div>
          )}

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FFF0F0', border: '1px solid #FFCDD2', borderRadius: '10px', padding: '12px 16px' }}>
              <AlertCircle size={15} color="#C8102E" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: '#C8102E', fontWeight: '500' }}>{error}</span>
            </div>
          )}

          {result && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle size={20} color="#16A34A" />
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#16A34A', letterSpacing: '-1px' }}>{result.valid.length}</div>
                    <div style={{ fontSize: '11px', color: '#4ADE80', fontWeight: '500' }}>Linhas válidas</div>
                  </div>
                </div>
                <div style={{ background: result.errors.length > 0 ? '#FFF0F0' : '#FAF8F6', border: `1px solid ${result.errors.length > 0 ? '#FFCDD2' : '#E8E2DB'}`, borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <AlertCircle size={20} color={result.errors.length > 0 ? '#C8102E' : '#C8C2BC'} />
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: result.errors.length > 0 ? '#C8102E' : '#A89E98', letterSpacing: '-1px' }}>{result.errors.length}</div>
                    <div style={{ fontSize: '11px', color: '#A89E98', fontWeight: '500' }}>Com erro</div>
                  </div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {result.errors.map(e => (
                    <div key={e.line} style={{ display: 'flex', gap: '8px', fontSize: '12px', background: '#FAF8F6', borderRadius: '8px', padding: '8px 12px' }}>
                      <span style={{ color: '#C8102E', fontWeight: '700' }}>Linha {e.line}:</span>
                      <span style={{ color: '#7A706A' }}>{e.errors.join(', ')}</span>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#A89E98', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>Pré-visualização</div>
                <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #E8E2DB' }}>
                  <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#FAF8F6' }}>
                        {['Grupo Familiar','Tipo','Rede','Líder','Participantes'].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#7A706A', fontWeight: '600', whiteSpace: 'nowrap', borderBottom: '1px solid #E8E2DB' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.valid.slice(0, 8).map((g, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #F2EEE9' }}>
                          <td style={{ padding: '8px 12px', color: '#1A1614', fontWeight: '500', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.grupoFamiliar}</td>
                          <td style={{ padding: '8px 12px', color: '#7A706A', whiteSpace: 'nowrap' }}>{g.tipo}</td>
                          <td style={{ padding: '8px 12px', color: '#7A706A', whiteSpace: 'nowrap' }}>{g.rede}</td>
                          <td style={{ padding: '8px 12px', color: '#1A1614', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.lider}</td>
                          <td style={{ padding: '8px 12px', color: '#7A706A', textAlign: 'center' }}>{g.participantes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px 24px', borderTop: '1px solid #F2EEE9' }}>
          <button onClick={() => { setResult(null); setFile(null); setError(null); }}
            style={{ padding: '9px 18px', fontSize: '13px', fontWeight: '600', color: '#7A706A', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', fontFamily: 'inherit' }}>
            {result ? 'Escolher outro' : 'Cancelar'}
          </button>
          {!result && (
            <button onClick={onClose} style={{ padding: '9px 18px', fontSize: '13px', fontWeight: '600', color: '#1A1614', background: '#F2EEE9', border: 'none', cursor: 'pointer', borderRadius: '8px', fontFamily: 'inherit' }}>
              Fechar
            </button>
          )}
          {result?.valid.length > 0 && (
            <button onClick={() => { onConfirm(result.valid); onClose(); }}
              style={{ padding: '9px 20px', fontSize: '13px', fontWeight: '700', color: '#fff', background: '#C8102E', border: 'none', cursor: 'pointer', borderRadius: '8px', fontFamily: 'inherit' }}>
              Confirmar importação ({result.valid.length})
            </button>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
