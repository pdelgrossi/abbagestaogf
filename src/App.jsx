import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Overview from './pages/Overview';
import RedeView from './pages/RedeView';
import MapaView from './pages/MapaView';
import ImportModal from './components/import-export/ImportModal';
import { useGfData } from './hooks/useGfData';
import { useSearch } from './hooks/useSearch';
import { exportToXlsx } from './utils/exportXlsx';
import { generateTestData } from './utils/generateTestData';

export default function App() {
  const { data, updateData, updateGrupo, resetData } = useGfData();
  const { query, setQuery, results } = useSearch(data);
  const [view, setView] = useState('overview'); // 'overview' | 'mapa' | 'rede'
  const [activeRede, setActiveRede] = useState(null);
  const [showImport, setShowImport] = useState(false);

  const handleSelectResult = (grupo) => { setView('rede'); setActiveRede(grupo.rede); };
  const handleExport = (scope) => exportToXlsx(data, scope, activeRede);
  const handleImport = (newData) => updateData(newData);
  const handleReset = () => {
    if (window.confirm('Zerar todos os dados? Esta ação não pode ser desfeita.')) resetData();
  };
  const handleInjectTest = () => {
    if (window.confirm('Substituir todos os dados por um conjunto de teste randomizado?')) {
      updateData(generateTestData());
    }
  };
  const handleSelectRede = (rede) => { setActiveRede(rede); setView('rede'); };

  return (
    <div style={{ minHeight: '100vh', background: '#F2EEE9', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Sidebar
        data={data}
        activeRede={activeRede}
        activeView={view}
        onSelectRede={setActiveRede}
        onSelectView={setView}
        onImport={() => setShowImport(true)}
        onExport={handleExport}
        onReset={handleReset}
        onInjectTest={handleInjectTest}
      />

      <div style={{ marginLeft: '256px' }}>
        <Header query={query} setQuery={setQuery} results={results} onSelectResult={handleSelectResult} activeRede={view === 'rede' ? activeRede : null} />

        <main style={{ paddingTop: '56px' }}>
          <div style={{ padding: '24px' }}>
            {view === 'overview' && (
              <Overview data={data} onSelectRede={handleSelectRede} />
            )}
            {view === 'mapa' && (
              <div style={{ height: 'calc(100vh - 56px - 48px)' }}>
                <MapaView data={data} />
              </div>
            )}
            {view === 'rede' && activeRede && (
              <div style={{ height: 'calc(100vh - 56px - 48px)' }}>
                <RedeView data={data} rede={activeRede} key={activeRede} onUpdateGrupo={updateGrupo} />
              </div>
            )}
          </div>
        </main>
      </div>

      {showImport && <ImportModal onClose={() => setShowImport(false)} onConfirm={handleImport} />}
    </div>
  );
}
