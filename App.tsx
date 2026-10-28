import React, { useState } from 'react';
import { Language, translations } from './translations';
import { DEMO_FARM_DATA } from './data/maharashtraData';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ProfitCalculator } from './components/ProfitCalculator';
import { CropPlanner } from './components/CropPlanner';
import { IrrigationPlanner } from './components/IrrigationPlanner';
import { AiChatbot } from './components/AiChatbot';
import { MandiRatesView } from './components/MandiRatesView';
import { GovSchemesView } from './components/GovSchemesView';
import { Sprout, Heart, ShieldAlert, Sparkles, Phone, Award } from 'lucide-react';
import { stopSpeaking } from './utils/speech';

export default function App() {
  const [language, setLanguage] = useState<Language>('mr');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [farmData, setFarmData] = useState<any>(DEMO_FARM_DATA);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const t = translations[language];

  // Try Demo Farm action
  const handleLoadDemo = () => {
    setFarmData({ ...DEMO_FARM_DATA });
    setIsDemoActive(true);
    // Switch to dashboard to show populated demo farm
    setCurrentTab('dashboard');
  };

  const handleTriggerSpeech = (_text: string) => {
    setIsSpeaking(true);
  };

  const handleStopSpeech = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        onLoadDemo={handleLoadDemo}
        isDemoActive={isDemoActive}
        isSpeaking={isSpeaking}
        onStopSpeech={handleStopSpeech}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <Dashboard
            language={language}
            onNavigate={setCurrentTab}
            farmData={farmData}
            onTriggerSpeech={handleTriggerSpeech}
          />
        )}

        {currentTab === 'profit-calc' && (
          <ProfitCalculator
            language={language}
            farmData={farmData}
            setFarmData={setFarmData}
            onTriggerSpeech={handleTriggerSpeech}
          />
        )}

        {currentTab === 'crop-planner' && (
          <CropPlanner
            language={language}
            farmData={farmData}
            onNavigateToCalculator={(cropId) => {
              setFarmData((prev: any) => ({ ...prev, activeCropId: cropId }));
              setCurrentTab('profit-calc');
            }}
          />
        )}

        {currentTab === 'irrigation' && (
          <IrrigationPlanner
            language={language}
            farmData={farmData}
            setFarmData={setFarmData}
          />
        )}

        {currentTab === 'ai-chat' && (
          <AiChatbot
            language={language}
            farmData={farmData}
            onTriggerSpeech={handleTriggerSpeech}
          />
        )}

        {currentTab === 'mandi' && (
          <MandiRatesView language={language} />
        )}

        {currentTab === 'schemes' && (
          <GovSchemesView language={language} />
        )}
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-emerald-100 mt-16 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="text-lg font-black text-slate-900 tracking-tight">
                  ग्रामसाथी <span className="text-emerald-600">AI</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  महाराष्ट्र
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                महाराष्ट्रातील बळीराजासाठी आधुनिक तंत्रज्ञानावर आधारित स्मार्ट कृषी सल्लागार. नफा गणक, जलमित्र व थेट कृषी मार्गदर्शन.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
              <button onClick={() => setCurrentTab('dashboard')} className="hover:text-emerald-600">
                {t.navDashboard}
              </button>
              <button onClick={() => setCurrentTab('profit-calc')} className="hover:text-emerald-600">
                {t.navProfitCalc}
              </button>
              <button onClick={() => setCurrentTab('crop-planner')} className="hover:text-emerald-600">
                {t.navCropPlanner}
              </button>
              <button onClick={() => setCurrentTab('irrigation')} className="hover:text-emerald-600">
                {t.navIrrigation}
              </button>
              <button onClick={() => setCurrentTab('ai-chat')} className="hover:text-emerald-600">
                {t.navAiChat}
              </button>
              <button onClick={() => setCurrentTab('mandi')} className="hover:text-emerald-600">
                {t.navMandi}
              </button>
            </div>
          </div>

          {/* AI Advisory & Hackathon Disclaimer */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong>{t.aiBadge}:</strong> {t.aiAdvisoryNote}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span>Made with care for Maharashtra Farmers</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
