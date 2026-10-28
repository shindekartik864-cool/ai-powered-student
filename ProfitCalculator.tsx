import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Printer, 
  RotateCcw, 
  CheckCircle, 
  Volume2, 
  Lightbulb, 
  PieChart, 
  Sliders,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Language, translations } from '../translations';
import { MAHARASHTRA_CROPS, CropInfo } from '../data/maharashtraData';
import { speakText } from '../utils/speech';

interface ProfitCalculatorProps {
  language: Language;
  farmData: any;
  setFarmData: React.Dispatch<React.SetStateAction<any>>;
  onTriggerSpeech: (text: string) => void;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({
  language,
  farmData,
  setFarmData,
  onTriggerSpeech,
}) => {
  const t = translations[language];

  const [selectedCropId, setSelectedCropId] = useState<string>(farmData.activeCropId || 'onion');
  const [acres, setAcres] = useState<number>(farmData.cropAcres || 2.5);
  const [expectedYield, setExpectedYield] = useState<number>(farmData.expectedYield || 90);
  const [sellingPrice, setSellingPrice] = useState<number>(farmData.expectedPrice || 1950);
  const [selectedPreset, setSelectedPreset] = useState<'standard' | 'lowCost' | 'highYield'>('standard');

  const selectedCrop = MAHARASHTRA_CROPS.find(c => c.id === selectedCropId) || MAHARASHTRA_CROPS[0];

  // Itemized costs per acre
  const [costs, setCosts] = useState({
    landPrep: farmData.costs?.landPrep || selectedCrop.defaultCosts.landPrep,
    seeds: farmData.costs?.seeds || selectedCrop.defaultCosts.seeds,
    fertilizer: farmData.costs?.fertilizer || selectedCrop.defaultCosts.fertilizer,
    pesticide: farmData.costs?.pesticide || selectedCrop.defaultCosts.pesticide,
    labour: farmData.costs?.labour || selectedCrop.defaultCosts.labour,
    irrigation: farmData.costs?.irrigation || selectedCrop.defaultCosts.irrigation,
    machinery: farmData.costs?.machinery || selectedCrop.defaultCosts.machinery,
    transport: farmData.costs?.transport || selectedCrop.defaultCosts.transport,
  });

  // AI Advice state
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Handle crop switch
  const handleCropChange = (cropId: string) => {
    setSelectedCropId(cropId);
    const crop = MAHARASHTRA_CROPS.find(c => c.id === cropId);
    if (crop) {
      setExpectedYield(crop.expectedYieldPerAcre);
      setSellingPrice(crop.defaultMandiPrice);
      setCosts({ ...crop.defaultCosts });
      setAiAdvice(null);
    }
  };

  // Preset switch
  const applyPreset = (preset: 'standard' | 'lowCost' | 'highYield') => {
    setSelectedPreset(preset);
    const base = selectedCrop.defaultCosts;
    if (preset === 'lowCost') {
      setCosts({
        landPrep: Math.round(base.landPrep * 0.8),
        seeds: Math.round(base.seeds * 0.9),
        fertilizer: Math.round(base.fertilizer * 0.6), // organic / cow dung
        pesticide: Math.round(base.pesticide * 0.5), // neem oil / biopesticides
        labour: Math.round(base.labour * 0.85),
        irrigation: Math.round(base.irrigation * 0.8),
        machinery: Math.round(base.machinery * 0.8),
        transport: base.transport,
      });
      setExpectedYield(Math.round(selectedCrop.expectedYieldPerAcre * 0.88));
    } else if (preset === 'highYield') {
      setCosts({
        landPrep: Math.round(base.landPrep * 1.2),
        seeds: Math.round(base.seeds * 1.25),
        fertilizer: Math.round(base.fertilizer * 1.35),
        pesticide: Math.round(base.pesticide * 1.3),
        labour: Math.round(base.labour * 1.2),
        irrigation: Math.round(base.irrigation * 1.1),
        machinery: Math.round(base.machinery * 1.2),
        transport: Math.round(base.transport * 1.2),
      });
      setExpectedYield(Math.round(selectedCrop.expectedYieldPerAcre * 1.25));
    } else {
      setCosts({ ...base });
      setExpectedYield(selectedCrop.expectedYieldPerAcre);
    }
  };

  // Calculations
  const costPerAcre = Object.values(costs).reduce((a, b) => a + Number(b), 0);
  const totalCost = Math.round(costPerAcre * acres);
  const totalProduction = Math.round(expectedYield * acres);
  const grossRevenue = Math.round(totalProduction * sellingPrice);
  const netProfit = grossRevenue - totalCost;
  const profitPerAcre = Math.round(netProfit / (acres || 1));
  const roi = totalCost > 0 ? ((netProfit / totalCost) * 100).toFixed(1) : '0';
  const breakEvenPrice = totalProduction > 0 ? Math.round(totalCost / totalProduction) : 0;

  // Percentage breakdown of costs
  const costItems = [
    { label: t.labourCost, value: costs.labour, color: 'bg-emerald-600' },
    { label: t.fertilizerCost, value: costs.fertilizer, color: 'bg-green-500' },
    { label: t.pesticideCost, value: costs.pesticide, color: 'bg-teal-500' },
    { label: t.seedCost, value: costs.seeds, color: 'bg-lime-500' },
    { label: t.landPrepCost, value: costs.landPrep, color: 'bg-amber-500' },
    { label: t.irrigationCost, value: costs.irrigation, color: 'bg-blue-500' },
    { label: t.machineryCost, value: costs.machinery, color: 'bg-slate-500' },
    { label: t.transportCost, value: costs.transport, color: 'bg-orange-500' },
  ];

  // Fetch AI profit optimization advice from backend
  const handleFetchAiAdvice = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/profit-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: selectedCrop.nameMr,
          acres,
          soilType: farmData.soilType,
          irrigation: farmData.irrigationMethod,
          totalCost,
          expectedRevenue: grossRevenue,
          expectedYield,
          mandiPrice: sellingPrice,
          district: farmData.district,
          language,
        }),
      });
      const data = await res.json();
      setAiAdvice(data.advice || 'सल्ला उपलब्ध नाही.');
    } catch (err) {
      console.error('Profit advice error:', err);
      setAiAdvice(
        language === 'mr'
          ? '💡 **AI नफा वाढीचा सल्ला:** विद्राव्य खतांचा (19:19:19 आणि 00:52:34) ठिबकद्वारे वापर करा. तूर आंतरपीक घेतल्यास निव्वळ नफ्यात २०% वाढ होऊ शकते.'
          : '💡 **AI Profit Optimization:** Use drip fertigation with water-soluble NPK. Intercropping with pulses can yield 20% higher net margins.'
      );
    } finally {
      setLoadingAi(false);
    }
  };

  const handleReadAiAdvice = () => {
    if (!aiAdvice) return;
    const cleanText = `${aiAdvice} ${t.aiAdvisoryNote}`;
    onTriggerSpeech(cleanText);
    speakText(cleanText, language);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.calcTitle}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.calcTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.calcSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            title="Print report"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{t.printSummary}</span>
          </button>
          <button
            onClick={() => handleCropChange(selectedCropId)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition"
            title="Reset to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.reset}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inputs & Cost Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Crop & Land Selection */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">1</span>
              <span>{t.selectCrop} व क्षेत्र निवड</span>
            </h3>

            {/* Crop Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MAHARASHTRA_CROPS.map((crop) => (
                <button
                  key={crop.id}
                  onClick={() => handleCropChange(crop.id)}
                  className={`p-2.5 rounded-xl text-left border text-xs font-bold transition ${
                    selectedCropId === crop.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'border-slate-200 hover:border-emerald-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="truncate">{crop.nameMr.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-500 font-normal truncate">{crop.nameEn}</div>
                </button>
              ))}
            </div>

            {/* Farm Area Slider & Input */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.enterAcres}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.5"
                    max="50"
                    step="0.5"
                    value={acres}
                    onChange={(e) => setAcres(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                    {t.acres}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.expectedYield}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={expectedYield}
                    onChange={(e) => setExpectedYield(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                    {selectedCrop.yieldUnit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.expectedPrice}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Math.max(100, parseFloat(e.target.value) || 100))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                    ₹/{selectedCrop.yieldUnit}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Price Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="text-slate-500 font-medium">जलद किंमत:</span>
              <button
                type="button"
                onClick={() => setSellingPrice(selectedCrop.defaultMandiPrice)}
                className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-semibold"
              >
                APMC बाजारभाव: ₹{selectedCrop.defaultMandiPrice}
              </button>
              <button
                type="button"
                onClick={() => setSellingPrice(selectedCrop.mspPrice)}
                className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 font-semibold"
              >
                शासकीय हमीभाव (MSP): ₹{selectedCrop.mspPrice}
              </button>
            </div>
          </div>

          {/* Budget Presets & Itemized Expenses */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">2</span>
                <span>{t.costBreakdown}</span>
              </h3>

              {/* Presets */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => applyPreset('lowCost')}
                  className={`px-2 py-1 rounded-md transition ${selectedPreset === 'lowCost' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'}`}
                >
                  सेंद्रिय / कमी खर्च
                </button>
                <button
                  onClick={() => applyPreset('standard')}
                  className={`px-2 py-1 rounded-md transition ${selectedPreset === 'standard' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'}`}
                >
                  मानक (Standard)
                </button>
                <button
                  onClick={() => applyPreset('highYield')}
                  className={`px-2 py-1 rounded-md transition ${selectedPreset === 'highYield' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'}`}
                >
                  उच्च उत्पादन
                </button>
              </div>
            </div>

            {/* Inputs Grid for all 8 cost parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'labour', label: t.labourCost },
                { key: 'fertilizer', label: t.fertilizerCost },
                { key: 'pesticide', label: t.pesticideCost },
                { key: 'seeds', label: t.seedCost },
                { key: 'landPrep', label: t.landPrepCost },
                { key: 'irrigation', label: t.irrigationCost },
                { key: 'machinery', label: t.machineryCost },
                { key: 'transport', label: t.transportCost },
              ].map((item) => (
                <div key={item.key} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{item.label}</span>
                    <span className="font-bold text-slate-900">₹{costs[item.key as keyof typeof costs]}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="45000"
                    step="200"
                    value={costs[item.key as keyof typeof costs]}
                    onChange={(e) => setCosts({ ...costs, [item.key]: Number(e.target.value) })}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/80 font-bold text-xs sm:text-sm text-slate-800">
              <span>{t.totalPerAcre}:</span>
              <span className="text-emerald-800 text-base">₹{costPerAcre.toLocaleString('en-IN')} / {t.acres}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Results, ROI, AI Advisor (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Profit Card */}
          <div className={`rounded-2xl p-6 shadow-md border-2 transition ${
            netProfit >= 0 
              ? 'bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-800 text-white border-emerald-600'
              : 'bg-gradient-to-br from-rose-800 to-red-700 text-white border-rose-500'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-200">
                {t.netProfit} ({acres} {t.acres})
              </span>
              <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs">
                ROI: {roi}%
              </span>
            </div>

            <div className="mt-3">
              <div className="text-3xl sm:text-4xl font-black tracking-tight">
                {netProfit >= 0 ? `+₹${netProfit.toLocaleString('en-IN')}` : `-₹${Math.abs(netProfit).toLocaleString('en-IN')}`}
              </div>
              <p className="text-emerald-100 text-xs font-semibold mt-1">
                {t.profitPerAcre}: ₹{profitPerAcre.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-emerald-200/80 block">{t.totalRevenue}</span>
                <span className="font-extrabold text-base">₹{grossRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-emerald-200/80 block">{t.totalOverallCost}</span>
                <span className="font-extrabold text-base">₹{totalCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-xl bg-black/20 text-xs flex items-center justify-between">
              <span className="text-emerald-100">{t.breakEven}:</span>
              <span className="font-bold text-amber-300">₹{breakEvenPrice} / {selectedCrop.yieldUnit}</span>
            </div>
          </div>

          {/* Visual Cost Breakdown */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <span>खर्चाचे वर्गीकरण (Expense Distribution)</span>
            </h4>

            {/* Stacked Progress Bar */}
            <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-slate-100">
              {costItems.map((item, idx) => {
                const pct = costPerAcre > 0 ? (item.value / costPerAcre) * 100 : 0;
                return (
                  <div
                    key={idx}
                    style={{ width: `${pct}%` }}
                    className={`${item.color} h-full transition-all`}
                    title={`${item.label}: ${pct.toFixed(0)}%`}
                  />
                );
              })}
            </div>

            {/* Mini Legend */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-600">
              {costItems.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                  <span className="truncate">{item.label.split(' ')[0]}: ₹{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Profit Booster Advisor Card */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-emerald-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    {t.aiAdviceHeader}
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                    {t.aiBadge} • महाराष्ट्र कृषी शिफारशी
                  </span>
                </div>
              </div>

              {aiAdvice && (
                <button
                  onClick={handleReadAiAdvice}
                  className="p-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition"
                  title="Listen to advice"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {aiAdvice ? (
              <div className="p-3.5 rounded-xl bg-white/90 border border-emerald-200/80 text-xs text-slate-800 leading-relaxed space-y-2">
                <div className="whitespace-pre-line font-medium">
                  {aiAdvice}
                </div>
                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 italic">
                  {t.aiAdvisoryNote}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600">
                आपल्या {selectedCrop.nameMr.split(' ')[0]} पिकाचा निव्वळ नफा १५% ते ३०% वाढवण्यासाठी कृषी विद्यापीठ आधारित सानुकूल AI सल्ले मिळवा.
              </p>
            )}

            <button
              onClick={handleFetchAiAdvice}
              disabled={loadingAi}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs sm:text-sm shadow-md active:scale-98 transition flex items-center justify-center gap-2"
            >
              {loadingAi ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>AI विश्लेषण तयार होत आहे...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t.aiProfitAdvisorBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
