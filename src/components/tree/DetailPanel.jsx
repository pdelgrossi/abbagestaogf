import { useState } from 'react';
import { X, Mail, MapPin, Calendar, Users, Clock, Pencil, Check, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { TIPO_STYLES, REDE_COLORS, getGrupoNome } from '../../utils/buildTree';

const LEAF_TYPES = ['PASTOREIO', 'JOVENS', 'CASAIS'];

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  background: '#F2EEE9',
  border: '1px solid #E8E2DB',
  borderRadius: '8px',
  padding: '7px 10px',
  fontSize: '13px',
  color: '#1A1614',
  outline: 'none',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  fontWeight: '500',
  transition: 'border-color 0.15s',
};

const numInputStyle = { ...inputStyle, width: '100%' };

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ fontSize: '10px', fontWeight: '700', color: '#A89E98', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '8px' }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {children}
      </div>
    </div>
  );
}

function EditField({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: '11px', color: '#A89E98', fontWeight: '500', marginBottom: '3px' }}>{label}</div>
      {children}
    </div>
  );
}

function ViewField({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0', borderBottom: '1px solid #F2EEE9' }}>
      <Icon size={13} color="#A89E98" style={{ marginTop: '2px', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '11px', color: '#A89E98', marginBottom: '2px', fontWeight: '500' }}>{label}</div>
        <div style={{ fontSize: '13px', color: '#1A1614', fontWeight: '500', wordBreak: 'break-word' }}>{value}</div>
      </div>
    </div>
  );
}

/* ── Editor dinâmico de campos numerados (lider1/lider2, coordenador1/coordenador2, etc.) ── */
function NumberedNamesEditor({ sectionTitle, fieldLabel, prefix, draft, setDraft }) {
  // Coleta campos existentes do draft
  const fields = [];
  for (let i = 1; i <= 10; i++) {
    if (draft[`${prefix}${i}`] !== undefined) {
      fields.push(i);
    } else {
      break;
    }
  }
  // Garante ao menos 1 campo visível
  if (fields.length === 0) fields.push(1);

  const maxIndex = fields[fields.length - 1];

  const addField = () => {
    const nextIdx = maxIndex + 1;
    setDraft(d => ({ ...d, [`${prefix}${nextIdx}`]: '' }));
  };

  const removeField = (indexToRemove) => {
    setDraft(d => {
      const newD = { ...d };
      // Desloca campos seguintes para baixo
      let i = indexToRemove;
      while (newD[`${prefix}${i + 1}`] !== undefined) {
        newD[`${prefix}${i}`] = newD[`${prefix}${i + 1}`];
        i++;
      }
      delete newD[`${prefix}${i}`];
      return newD;
    });
  };

  const updateField = (idx, value) => {
    setDraft(d => ({ ...d, [`${prefix}${idx}`]: value }));
  };

  return (
    <Section title={sectionTitle}>
      {fields.map((idx) => (
        <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <EditField label={`${fieldLabel} ${idx}`}>
              <input
                style={inputStyle}
                value={draft[`${prefix}${idx}`] ?? ''}
                onChange={e => updateField(idx, e.target.value)}
                placeholder="Nome"
                onFocus={e => { e.target.style.borderColor = '#C8102E'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#E8E2DB'; e.target.style.background = '#F2EEE9'; }}
              />
            </EditField>
          </div>
          {fields.length > 1 && (
            <button
              onClick={() => removeField(idx)}
              title="Remover"
              style={{
                background: '#F2EEE9', border: '1px solid #E8E2DB', borderRadius: '8px',
                width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#A89E98', flexShrink: 0, marginBottom: '0',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#B91C1C'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F2EEE9'; e.currentTarget.style.color = '#A89E98'; }}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addField}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
          padding: '6px', background: '#F2EEE9', color: '#7A706A',
          border: '1px dashed #C8C2BB', borderRadius: '8px',
          fontSize: '11px', fontWeight: '600', cursor: 'pointer',
          fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#FFF0F0'; e.currentTarget.style.color = '#C8102E'; e.currentTarget.style.borderColor = '#FFDDE0'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#F2EEE9'; e.currentTarget.style.color = '#7A706A'; e.currentTarget.style.borderColor = '#C8C2BB'; }}
      >
        <Plus size={11} /> Adicionar {fieldLabel.toLowerCase()}
      </button>
    </Section>
  );
}

/* ── Integrantes — view ─────────────────────────────────────────────────── */
function IntegrantesView({ integrantes }) {
  if (integrantes.length === 0) return null;
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ fontSize: '10px', fontWeight: '700', color: '#A89E98', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '8px' }}>
        Integrantes ({integrantes.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {integrantes.map((m, i) => (
          <div key={m.id || i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: '#F9F7F5', borderRadius: '8px', border: '1px solid #E8E2DB' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#E8E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={12} color="#A89E98" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1614', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.nome}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Integrantes — edit ─────────────────────────────────────────────────── */
function IntegrantesEdit({ draft, setDraft }) {
  const [novoNome, setNovoNome] = useState('');
  const integrantes = draft.integrantes || [];

  const adicionar = () => {
    const nome = novoNome.trim();
    if (!nome) return;
    const novo = { id: `m_${Date.now()}`, nome };
    setDraft(d => ({ ...d, integrantes: [...(d.integrantes || []), novo] }));
    setNovoNome('');
  };

  const remover = (id) => {
    setDraft(d => ({ ...d, integrantes: (d.integrantes || []).filter(m => m.id !== id) }));
  };

  return (
    <div style={{ marginTop: '8px', borderTop: '1px solid #F2EEE9', paddingTop: '16px' }}>
      <div style={{ fontSize: '10px', fontWeight: '700', color: '#A89E98', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '10px' }}>
        Integrantes ({integrantes.length})
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' }}>
        {integrantes.map((m, i) => (
          <div key={m.id || i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px', background: '#F9F7F5', borderRadius: '7px', border: '1px solid #E8E2DB' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1614', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.nome}</div>
            </div>
            <button
              onClick={() => remover(m.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89E98', padding: '2px', display: 'flex', alignItems: 'center', flexShrink: 0 }}
              title="Remover"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <input
          style={{ ...inputStyle, fontSize: '12px' }}
          placeholder="Nome do integrante"
          value={novoNome}
          onChange={e => setNovoNome(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && adicionar()}
          onFocus={e => { e.target.style.borderColor = '#C8102E'; e.target.style.background = '#fff'; }}
          onBlur={e => { e.target.style.borderColor = '#E8E2DB'; e.target.style.background = '#F2EEE9'; }}
        />
        <button
          onClick={adicionar}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '7px', background: novoNome.trim() ? '#C8102E' : '#E8E2DB', color: novoNome.trim() ? '#fff' : '#A89E98', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: novoNome.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all 0.15s' }}
          disabled={!novoNome.trim()}
        >
          <Plus size={12} /> Adicionar integrante
        </button>
      </div>
    </div>
  );
}

/* ── Helpers para campos numerados no view mode ─────────────────────────── */
function numberedViewFields(grupo, prefix, labelBase, Icon) {
  const fields = [];
  for (let i = 1; i <= 10; i++) {
    const val = grupo[`${prefix}${i}`];
    if (!val) break;
    fields.push(<ViewField key={`${prefix}${i}`} icon={Icon} label={`${labelBase} ${i}`} value={val} />);
  }
  return fields;
}

export default function DetailPanel({ grupo, onClose, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});

  if (!grupo) return null;

  const tipo = TIPO_STYLES[grupo.tipo] || TIPO_STYLES['PASTOREIO'];
  const redeColor = REDE_COLORS[grupo.rede] || '#E8E2DB';
  const isLeaf = LEAF_TYPES.includes(grupo.tipo);

  const address = [grupo.logradouro, grupo.numero, grupo.complemento, grupo.bairro, grupo.cidade, grupo.estado].filter(Boolean).join(', ');

  const startEdit = () => {
    const d = { ...grupo, integrantes: grupo.integrantes || [] };
    // Garante ao menos o campo 1 para edição
    if (isLeaf && d.lider1 === undefined) d.lider1 = '';
    if (!isLeaf && d.coordenador1 === undefined) d.coordenador1 = '';
    if (!isLeaf && d.coordenadorGeral1 === undefined) d.coordenadorGeral1 = '';
    setDraft(d);
    setEditing(true);
  };
  const cancelEdit = () => { setEditing(false); setDraft({}); };
  const saveEdit = () => {
    if (onUpdate) onUpdate(grupo, draft);
    setEditing(false);
    setDraft({});
  };

  // Título ao vivo: recalcula o nome canônico enquanto o usuário edita
  const liveTitle = editing ? getGrupoNome(draft) : null;

  const set = key => e => setDraft(d => ({ ...d, [key]: e.target.value }));
  const setNum = key => e => setDraft(d => ({ ...d, [key]: Number(e.target.value) || 0 }));

  const inp = (key, placeholder = '') => (
    <input
      style={inputStyle}
      value={draft[key] ?? ''}
      onChange={set(key)}
      placeholder={placeholder}
      onFocus={e => { e.target.style.borderColor = '#C8102E'; e.target.style.background = '#fff'; }}
      onBlur={e => { e.target.style.borderColor = '#E8E2DB'; e.target.style.background = '#F2EEE9'; }}
    />
  );

  const num = (key, placeholder = '0') => (
    <input
      type="number"
      min="0"
      style={numInputStyle}
      value={draft[key] ?? ''}
      onChange={setNum(key)}
      placeholder={placeholder}
      onFocus={e => { e.target.style.borderColor = '#C8102E'; e.target.style.background = '#fff'; }}
      onBlur={e => { e.target.style.borderColor = '#E8E2DB'; e.target.style.background = '#F2EEE9'; }}
    />
  );

  return (
    <div style={{
      position: 'fixed', right: 0, top: 0, height: '100vh', width: '300px',
      background: '#FFFFFF', borderLeft: '1px solid #E8E2DB',
      display: 'flex', flexDirection: 'column', zIndex: 20,
      boxShadow: '-4px 0 24px rgba(0,0,0,0.06)',
    }}>
      <div style={{ height: '3px', background: redeColor, flexShrink: 0 }} />

      {/* Header */}
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #F2EEE9', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', marginBottom: '8px', color: tipo.bg, background: tipo.bg + '18', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {tipo.label}
            </span>
            <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#1A1614', margin: 0, lineHeight: 1.3, wordBreak: 'break-word' }}>
              {liveTitle || grupo.grupoFamiliar || grupo.coordenador}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: redeColor }} />
              <span style={{ fontSize: '12px', color: '#A89E98', fontWeight: '500' }}>{grupo.rede}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#F2EEE9', border: 'none', borderRadius: '8px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: '#7A706A' }}>
            <X size={15} />
          </button>
        </div>

        {/* Edit / Save / Cancel */}
        {onUpdate && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
            {editing ? (
              <>
                <button onClick={saveEdit} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '7px', background: '#C8102E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <Check size={12} /> Salvar
                </button>
                <button onClick={cancelEdit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '7px 12px', background: '#F2EEE9', color: '#7A706A', border: '1px solid #E8E2DB', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <RotateCcw size={11} />
                </button>
              </>
            ) : (
              <button onClick={startEdit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '7px 14px', background: '#F2EEE9', color: '#7A706A', border: '1px solid #E8E2DB', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all 0.15s', width: '100%' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FFF0F0'; e.currentTarget.style.color = '#C8102E'; e.currentTarget.style.borderColor = '#FFDDE0'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F2EEE9'; e.currentTarget.style.color = '#7A706A'; e.currentTarget.style.borderColor = '#E8E2DB'; }}
              >
                <Pencil size={12} /> Editar grupo
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats bar — view only */}
      {!editing && (grupo.participantes > 0 || grupo.visitantes > 0 || grupo.mediaIdade > 0) && (
        <div style={{ display: 'flex', borderBottom: '1px solid #F2EEE9', flexShrink: 0 }}>
          {grupo.participantes > 0 && (
            <div style={{ flex: 1, padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#1A1614', letterSpacing: '-1px' }}>{grupo.participantes}</div>
              <div style={{ fontSize: '11px', color: '#A89E98', fontWeight: '500', marginTop: '2px' }}>Participantes</div>
            </div>
          )}
          {grupo.visitantes > 0 && (
            <div style={{ flex: 1, padding: '14px', textAlign: 'center', borderLeft: '1px solid #F2EEE9' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#1A1614', letterSpacing: '-1px' }}>{grupo.visitantes}</div>
              <div style={{ fontSize: '11px', color: '#A89E98', fontWeight: '500', marginTop: '2px' }}>Visitantes</div>
            </div>
          )}
          {grupo.mediaIdade > 0 && (
            <div style={{ flex: 1, padding: '14px', textAlign: 'center', borderLeft: '1px solid #F2EEE9' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#1A1614', letterSpacing: '-1px' }}>{grupo.mediaIdade}</div>
              <div style={{ fontSize: '11px', color: '#A89E98', fontWeight: '500', marginTop: '2px' }}>Média idade</div>
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: editing ? '16px 20px 24px' : '4px 20px 20px' }}>
        {editing ? (
          /* ── EDIT MODE ───────────────────────────────────────────────────── */
          <>
            {isLeaf && (
              <Section title="Estatísticas">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <EditField label="Participantes">{num('participantes')}</EditField>
                  <EditField label="Visitantes">{num('visitantes')}</EditField>
                  <EditField label="Média Idade">{num('mediaIdade')}</EditField>
                </div>
              </Section>
            )}

            {isLeaf && (
              <NumberedNamesEditor
                sectionTitle="Líderes"
                fieldLabel="Líder"
                prefix="lider"
                draft={draft}
                setDraft={setDraft}
              />
            )}


            {!isLeaf && (
              <NumberedNamesEditor
                sectionTitle="Casal / Equipe Coordenadora"
                fieldLabel="Coordenador"
                prefix="coordenador"
                draft={draft}
                setDraft={setDraft}
              />
            )}

            {!isLeaf && (
              <NumberedNamesEditor
                sectionTitle="Coord. Geral (referência pai)"
                fieldLabel="Coord. Geral"
                prefix="coordenadorGeral"
                draft={draft}
                setDraft={setDraft}
              />
            )}

            <Section title="Contato">
              <EditField label="E-mail">{inp('email', 'email@exemplo.com')}</EditField>
            </Section>

            {isLeaf && (
              <Section title="Encontro">
                <EditField label="Dias">{inp('dias', 'Ex: Terça, Sexta')}</EditField>
                <EditField label="Horário">{inp('horario', 'Ex: 20:00')}</EditField>
              </Section>
            )}

            <Section title="Local">
              <EditField label="Logradouro">{inp('logradouro', 'Rua...')}</EditField>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                <EditField label="Bairro">{inp('bairro')}</EditField>
                <EditField label="Nº">{inp('numero')}</EditField>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <EditField label="Cidade">{inp('cidade')}</EditField>
                <EditField label="Estado">{inp('estado')}</EditField>
              </div>
              <EditField label="Área/Região">{inp('areaRegiao')}</EditField>
            </Section>

            {isLeaf && (
              <Section title="Outros">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <EditField label="Limite de pessoas">{num('limitePessoas')}</EditField>
                </div>
              </Section>
            )}

            {isLeaf && <IntegrantesEdit draft={draft} setDraft={setDraft} />}
          </>
        ) : (
          /* ── VIEW MODE ───────────────────────────────────────────────────── */
          <>
            {isLeaf && numberedViewFields(grupo, 'lider', 'Líder', Users)}
            {!isLeaf && numberedViewFields(grupo, 'coordenador', 'Coordenador', Users)}
            {!isLeaf && numberedViewFields(grupo, 'coordenadorGeral', 'Coord. Geral', Users)}
            <ViewField icon={Mail} label="E-mail" value={grupo.email} />
            <ViewField icon={Clock} label="Dias do encontro" value={grupo.dias} />
            <ViewField icon={Clock} label="Horário" value={grupo.horario} />
            <ViewField icon={MapPin} label="Endereço" value={address} />
            <ViewField icon={MapPin} label="Área/Região" value={grupo.areaRegiao} />
            <ViewField icon={Users} label="Limite de pessoas" value={grupo.limitePessoas > 0 ? String(grupo.limitePessoas) : null} />
            <ViewField icon={Calendar} label="Criado em" value={grupo.criadoEm} />
            {isLeaf && <IntegrantesView integrantes={grupo.integrantes || []} />}
          </>
        )}
      </div>
    </div>
  );
}
