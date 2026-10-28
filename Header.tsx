import React, { useState } from 'react';
import { 
  Sprout, 
  LayoutDashboard, 
  Calculator, 
  CalendarDays, 
  Droplets, 
  Bot, 
  TrendingUp, 
  FileText, 
  Languages, 
  Sparkles, 
  Menu, 
  X,
  Volume2,
  VolumeX,
  CheckCircle2
} from 'lucide-react';
import { Language, translations } from '../translations';
import { stopSpeaking } from '../utils/speech';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onLoadDemo: () => void;
  isDemoActive: boolean;
  isSpeaking: boolean;
  onStopSpeech: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  onLoadDemo,
  isDemoActive,
  isSpeaking,
  onStopSpeech,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoBannerVisible, setDemoBannerVisible] = useState(false);
  const t = translations[language];

  const handleDemoClick = () => {
    onLoadDemo();
    setDemoBannerVisible(true);
    setTimeout(() => setDemoBannerVisible(false), 4000);
  };

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'profit-calc', label: t.navProfitCalc, icon: Calculator },
    { id: 'crop-planner', label: t.navCropPlanner, icon: CalendarDays },
    { id: 'irrigation', label: t.navIrrigation, icon: Droplets },
    { id: 'ai-chat', label: t.navAiChat, icon: Bot, isAi: true },
    { id: 'mandi', label: t.navMandi, icon: TrendingUp },
    { id: 'schemes', label: t.navSchemes, icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top utility alert bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/40 text-emerald-100 border border-emerald-400/30">
              {t.aiBadge}
            </span>
            <span className="hidden sm:inline">🌱 {t.appTagline} • महाराष्ट्र कृषी विद्यापीठे (MPKV/PDKV) मानके</span>
            <span className="sm:hidden">🌱 ग्रामसाथी AI महाराष्ट्र</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isSpeaking && (
              <button 
                onClick={() => { stopSpeaking(); onStopSpeech(); }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-[11px] hover:bg-amber-400 transition animate-pulse"
                title="Stop Audio Readout"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>आवाज थांबवा</span>
              </button>
            )}
            
            <div className="flex items-center bg-emerald-900/60 rounded-md p-0.5 border border-emerald-600/40">
              <Languages className="w-3.5 h-3.5 ml-1.5 text-emerald-200" />
              <button
                onClick={() => setLanguage('mr')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  language === 'mr' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-100 hover:text-white'
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  language === 'hi' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-100 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  language === 'en' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-100 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  ग्रामसाथी <span className="text-emerald-600">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm">
                  MH
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Smart Maharashtra Farming Assistant
              </p>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-200/80'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.isAi && (
                    <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action buttons (Try Demo & Mobile toggle) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDemoClick}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-xs transition transform active:scale-95 ${
                isDemoActive 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 ring-2 ring-emerald-500/20'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>{t.tryDemo}</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Demo loaded notification banner */}
      {demoBannerVisible && (
        <div className="bg-emerald-50 border-y border-emerald-200 py-2 px-4 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm text-emerald-900 font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.demoLoaded} (४.५ एकर - कांदा व सोयाबीन, ठिबक सिंचन)</span>
            </div>
            <button 
              onClick={() => setDemoBannerVisible(false)}
              className="text-emerald-700 hover:text-emerald-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.isAi && (
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
