import React from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  CalendarDays, 
  Bot, 
  MapPin, 
  Sparkles, 
  ArrowUpRight, 
  Zap, 
  CheckCircle,
  Volume2
} from 'lucide-react';
import { Language, translations } from '../translations';
import { APMC_RATES, MAHARASHTRA_CROPS } from '../data/maharashtraData';
import { speakText } from '../utils/speech';

interface DashboardProps {
  language: Language;
  onNavigate: (tab: string) => void;
  farmData: any;
  onTriggerSpeech: (text: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  language,
  onNavigate,
  farmData,
  onTriggerSpeech,
}) => {
  const t = translations[language];

  // Calculated numbers based on farmData
  const activeCrop = MAHARASHTRA_CROPS.find(c => c.id === farmData.activeCropId) || MAHARASHTRA_CROPS[0];
  const secondaryCrop = MAHARASHTRA_CROPS.find(c => c.id === farmData.secondaryCropId) || MAHARASHTRA_CROPS[1];

  const primaryCost = Object.values(farmData.costs).reduce((acc: number, curr: any) => acc + Number(curr), 0) * farmData.cropAcres;
  const secondaryCost = Object.values(secondaryCrop.defaultCosts).reduce((acc: number, curr: any) => acc + Number(curr), 0) * farmData.secondaryCropAcres;
  const totalCost = Math.round(primaryCost + secondaryCost);

  const primaryRevenue = farmData.expectedYield * farmData.expectedPrice * farmData.cropAcres;
  const secondaryRevenue = secondaryCrop.expectedYieldPerAcre * secondaryCrop.defaultMandiPrice * farmData.secondaryCropAcres;
  const totalRevenue = Math.round(primaryRevenue + secondaryRevenue);
  const netProfit = totalRevenue - totalCost;
  const roiPct = totalCost > 0 ? ((netProfit / totalCost) * 100).toFixed(1) : '0';

  const handleReadSprayAdvisory = () => {
    const textToSpeak = `${t.sprayAdvisory} ${t.aiAdvisoryNote}`;
    onTriggerSpeech(textToSpeak);
    speakText(textToSpeak, language);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Farm Profile Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-800 text-white p-5 sm:p-8 shadow-lg">
        {/* Subtle decorative leaf pattern */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-2 right-4 text-emerald-300/30 text-7xl font-bold select-none pointer-events-none">
          MH
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-semibold border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.appTagline}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.greeting}
            </h1>
            <p className="text-emerald-100/90 text-sm max-w-xl">
              {t.farmOverview} - {t.activeFarmer} ({t.location})
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/20 text-xs font-medium backdrop-blur-xs border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                {farmData.taluka}, {farmData.district}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/20 text-xs font-medium backdrop-blur-xs border border-white/10">
                🌱 {farmData.totalAcres} {t.acres} ({farmData.cropAcres} {activeCrop.nameMr.split(' ')[0]} + {farmData.secondaryCropAcres} {secondaryCrop.nameMr.split(' ')[0]})
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/20 text-xs font-medium backdrop-blur-xs border border-white/10">
                💧 {t.irrigationType}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => onNavigate('profit-calc')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-sm shadow-md hover:bg-emerald-50 active:scale-98 transition"
            >
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>{t.navProfitCalc}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              onClick={() => onNavigate('ai-chat')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-sm border border-emerald-400/40 active:scale-98 transition shadow-sm"
            >
              <Bot className="w-4 h-4 text-emerald-200" />
              <span>{t.navAiChat}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Weather & Spraying Advisory Banner */}
      <div className="rounded-2xl bg-white border border-emerald-100 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
              <CloudSun className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  {t.weatherTitle} ({farmData.district})
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  हंगाम: खरीप / रब्बी
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-1 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1 font-bold text-slate-800 text-sm">
                  ३१°C / २१°C
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  {t.humidity}: ५८%
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-slate-400" />
                  {t.wind}: ११ किमी/तास
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  {t.rainProb}: १२% (निरभ्र आकाश)
                </span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                {t.sprayAdvisory}
              </p>
            </div>
            <button
              onClick={handleReadSprayAdvisory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0 transition"
              title="Read advisory aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t.listenAudio}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Expected Revenue */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs hover:border-emerald-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.kpiExpectedRevenue}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {farmData.cropAcres} {t.acres} {activeCrop.nameMr.split(' ')[0]} + {farmData.secondaryCropAcres} {t.acres} {secondaryCrop.nameMr.split(' ')[0]}
            </p>
          </div>
        </div>

        {/* Cultivation Cost */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs hover:border-amber-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.kpiTotalCost}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{totalCost.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              बियाणे, खते, मजुरी व सिंचन धरून
            </p>
          </div>
        </div>

        {/* Net Profit (Highlighted) */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100/60 border-2 border-emerald-400/80 p-5 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                {t.kpiNetProfit}
              </span>
              <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-1.5 py-0.2 rounded-full">
                {t.aiBadge}
              </span>
            </div>
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-md">
              ROI: +{roiPct}%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-900 tracking-tight">
              ₹{netProfit.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-emerald-800 font-semibold mt-1">
              प्रति एकर निव्वळ नफा: ₹{Math.round(netProfit / farmData.totalAcres).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Water Reserve & Power */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs hover:border-blue-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.kpiWaterReserve}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">४२ {t.kpiDays}</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                ७८% साठा
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>महावितरण: दिवसा वीज चालू आहे</span>
            </p>
          </div>
        </div>
      </div>

      {/* Regional Pest Warning Radar Alert */}
      <div className="rounded-xl bg-amber-50/80 border border-amber-300 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-sm">
                {t.pestAlertTitle}
              </span>
              <span className="text-[11px] font-semibold text-amber-800">
                नाशिक, जळगाव व छत्रपती संभाजीनगर पट्टा
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-950 mt-1 font-medium leading-relaxed">
              कांद्यावर थ्रिप्स आणि जांभळा करपा (Purple Blotch) रोगाचा प्रादुर्भाव वाढण्याची शक्यता. जैविक नियंत्रणासाठी ५% निंबोळी अर्क किंवा रासायनिक उपाय म्हणून डायफेनकोनॅझोल (१५ मिली/१५ लिटर पंप) फवारणीचा सल्ला.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('crop-planner')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap transition"
        >
          <span>{t.viewDetails}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* APMC Mandi Rates Live Snapshot */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>{t.mandiRatesTitle}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.mandiSubtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigate('mandi')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-center"
          >
            <span>सर्व बाजार समित्यांचे दर पहा</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {APMC_RATES.slice(0, 3).map((item) => {
            const isAboveMsp = item.modalPrice >= item.mspPrice;
            return (
              <div 
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-emerald-200 transition shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {item.marketNameMr}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    item.trend === 'up' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : item.trend === 'down'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{item.changeAmount > 0 ? `+₹${item.changeAmount}` : `₹${item.changeAmount}`}</span>
                  </span>
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xs text-slate-600 font-semibold">{item.commodityMr}</span>
                  <span className="text-lg font-black text-slate-900">₹{item.modalPrice}</span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    MSP: ₹{item.mspPrice}
                  </span>
                  <span className={`font-semibold ${isAboveMsp ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {isAboveMsp ? `+₹${item.modalPrice - item.mspPrice} ${t.aboveMsp}` : t.belowMsp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Navigation Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('profit-calc')}
          className="p-4 rounded-xl border border-emerald-200/80 bg-white hover:bg-emerald-50/50 text-left transition shadow-xs group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition">
            <Calculator className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">{t.navProfitCalc}</h4>
          <p className="text-xs text-slate-500 mt-1">
            कांदा, सोयाबीन, कापूस पिकाचा सविस्तर नफा-तोटा व ब्रेक-इव्हन भाव काढा.
          </p>
        </button>

        <button
          onClick={() => onNavigate('irrigation')}
          className="p-4 rounded-xl border border-emerald-200/80 bg-white hover:bg-emerald-50/50 text-left transition shadow-xs group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition">
            <Droplets className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">{t.navIrrigation}</h4>
          <p className="text-xs text-slate-500 mt-1">
            ठिबक सिंचन पाणी हिशोब व महावितरण थ्री-फेज वीज वेळापत्रक तपासा.
          </p>
        </button>

        <button
          onClick={() => onNavigate('ai-chat')}
          className="p-4 rounded-xl border border-emerald-200/80 bg-white hover:bg-emerald-50/50 text-left transition shadow-xs group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition">
            <Bot className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <span>{t.navAiChat}</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
              मराठी/हिंदी
            </span>
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            पिकावरील कीड, खत मात्रा किंवा रोग निदान थेट AI ला विचारा.
          </p>
        </button>
      </div>

      {/* Mandatory Disclaimer Footer */}
      <div className="rounded-xl bg-slate-100/80 border border-slate-200 p-3.5 text-slate-600 text-xs leading-relaxed flex items-center gap-2.5">
        <span className="text-slate-400 font-bold shrink-0">ℹ️</span>
        <p>{t.aiAdvisoryNote}</p>
      </div>
    </div>
  );
};
