import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { RealTimePredictor } from './components/RealTimePredictor';
import { ModelBenchmarking } from './components/ModelBenchmarking';
import { ConfusionRocStudio } from './components/ConfusionRocStudio';
import { ShapExplainability } from './components/ShapExplainability';
import { LeadExplorer } from './components/LeadExplorer';
import { CapstoneDefenseView } from './components/CapstoneDefenseView';
import { SAMPLE_LEADS } from './data/leadsDataset';
import { TabType, Lead, SimulationInput } from './types';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [leadsList, setLeadsList] = useState<Lead[]>(SAMPLE_LEADS);
  const [selectedLeadForSim, setSelectedLeadForSim] = useState<SimulationInput | null>(null);

  const handleAddLeadToPipeline = (newLead: Lead) => {
    setLeadsList((prev) => [newLead, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickSim={() => setActiveTab('predictor')}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            <ErrorBoundary fallbackTitle="Analytical Module Exception">
              {activeTab === 'overview' && (
                <ExecutiveOverview
                  onNavigateToPredictor={() => setActiveTab('predictor')}
                  onNavigateToModels={() => setActiveTab('models')}
                  onNavigateToDefense={() => setActiveTab('defense')}
                />
              )}

              {activeTab === 'predictor' && (
                <RealTimePredictor
                  onAddLeadToPipeline={handleAddLeadToPipeline}
                  initialLead={selectedLeadForSim}
                />
              )}

              {activeTab === 'models' && <ModelBenchmarking />}

              {activeTab === 'confusion-roc' && <ConfusionRocStudio />}

              {activeTab === 'shap' && <ShapExplainability />}

              {activeTab === 'leads' && (
                <LeadExplorer
                  leads={leadsList}
                  onSelectLeadForSim={(simInput) => {
                    setSelectedLeadForSim(simInput);
                    setActiveTab('predictor');
                  }}
                />
              )}

              {activeTab === 'defense' && <CapstoneDefenseView />}
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Global Interactive Authentication Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary fallbackTitle="Application Workspace Error">
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  );
}
