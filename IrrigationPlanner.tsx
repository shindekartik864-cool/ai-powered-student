import React, { useState } from 'react';
import { 
  Droplets, 
  Zap, 
  Clock, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  Waves,
  Sun,
  Moon
} from 'lucide-react';
import { Language, translations } from '../translations';
import { MAHARASHTRA_CROPS } from '../data/maharashtraData';

interface IrrigationPlannerProps {
  language: Language;
  farmData: any;
  setFarmData: React.Dispatch<React.SetStateAction<any>>;
}

export const IrrigationPlanner: React.FC<IrrigationPlannerProps> = ({
  language,
  farmData,
  setFarmData,
}) => {
  const t = translations[language];

  const [waterSource, setWaterSource] = useState<'well' | 'borewell' | 'farmPond' | 'canal'>(farmData.irrigationSource || 'well');
  const [irrigationMethod, setIrrigationMethod] = useState<'drip' | 'sprinkler' | 'flood'>(farmData.irrigationMethod || 'drip');
  const [waterLevelPct, setWaterLevelPct] = useState<number>(farmData.waterLevelPct || 78);
  const [selectedCropId, setSelectedCropId] = useState<string>(farmData.activeCropId || 'onion');
  const [pumpHp, setPumpHp] = useState<number>(5); // 5 HP pump is standard in Maharashtra
  const [acres, setAcres] = useState<number>(farmData.cropAcres || 2.5);

  const selectedCrop = MAHARASHTRA_CROPS.find(c => c.id === selectedCropId) || MAHARASHTRA_CROPS[0];

  // Water calculations (liters per day)
  // Onion needs ~25,000 to 35,000 liters/acre/day under drip in Maharashtra sunny climate
  const baseWaterFactor = selectedCrop.waterNeed.includes('High') ? 38000 : selectedCrop.waterNeed.includes('Medium') ? 28000 : 18000;
  const methodEfficiency = irrigationMethod === 'drip' ? 0.65 : irrigationMethod === 'sprinkler' ? 0.8 : 1.35; // Drip requires much less water
  const dailyWaterPerAcre = Math.round(baseWaterFactor * methodEfficiency);
  const totalDailyWater = Math.round(dailyWaterPerAcre * acres);

  // 5 HP pump delivers ~25,000 - 30,000 liters/hour at typical Maharashtra borewell/well head
  const pumpFlowRatePerHour = pumpHp * 5500;
  const recommendedPumpHours = (totalDailyWater / pumpFlowRatePerHour).toFixed(1);
  const pumpMinutes = Math.round((parseFloat(recommendedPumpHours) * 60));
  const displayHours = Math.floor(pumpMinutes / 60);
  const displayMins = pumpMinutes % 60;

  // Water savings vs flood irrigation
  const floodWater = baseWaterFactor * 1.35 * acres;
  const waterSavedLiters = Math.round(floodWater - totalDailyWater);
  const waterSavedPct = Math.round(((floodWater - totalDailyWater) / floodWater) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
              <Droplets className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.irrigationTitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.irrigationTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.irrigationSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.aiBadge} • सूक्ष्म सिंचन गणना</span>
            </span>
          </div>
        </div>
      </div>

      {/* MSEDCL 3-Phase Agricultural Power Tracker Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-8 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-extrabold backdrop-blur-xs">
              <Zap className="w-3.5 h-3.5 text-yellow-200" />
              <span>{t.msedclTitle}</span>
            </div>
            <h3 className="text-xl font-black tracking-tight">
              {t.currentPowerStatus}
            </h3>
            <p className="text-amber-100 text-xs sm:text-sm font-medium">
              {t.shiftDay} (चालू शिफ्ट शिल्लक: ४ तास १५ मिनिटे)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="p-3 rounded-xl bg-black/20 backdrop-blur-xs text-xs space-y-1 border border-white/20">
              <div className="flex items-center gap-1.5 text-yellow-200 font-bold">
                <Sun className="w-4 h-4" />
                <span>या आठवड्यात (चालू):</span>
              </div>
              <p className="text-white font-medium">दिवसा: ०७:०० AM - ०३:०० PM</p>
            </div>

            <div className="p-3 rounded-xl bg-black/20 backdrop-blur-xs text-xs space-y-1 border border-white/20">
              <div className="flex items-center gap-1.5 text-amber-200 font-bold">
                <Moon className="w-4 h-4" />
                <span>पुढील आठवडा (आलटून-पालटून):</span>
              </div>
              <p className="text-white font-medium">रात्री: १०:०० PM - ०६:०० AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Water Source & System Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Water Source & Storage Level */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</span>
              <span>{t.waterSource} व साठा स्तर</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'well', label: t.well, icon: Waves },
                { id: 'borewell', label: t.borewell, icon: Droplets },
                { id: 'farmPond', label: t.farmPond, icon: Waves },
                { id: 'canal', label: t.canal, icon: Droplets },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = waterSource === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setWaterSource(item.id as any)}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Water Level Gauge Slider */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>{t.waterLevel}:</span>
                <span className="text-blue-700 font-black text-sm">{waterLevelPct}% उपलब्ध (~४२ दिवस)</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={waterLevelPct}
                onChange={(e) => setWaterLevelPct(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                <span>१०% (टंचाई)</span>
                <span>५०% (मध्यम)</span>
                <span>१००% (पूर्ण साठा)</span>
              </div>
            </div>
          </div>

          {/* Irrigation System & Pump Parameters */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center text-xs">2</span>
              <span>{t.irrigationMethod} व मोटार क्षमता</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'drip', label: t.drip, badge: '४२% बचत' },
                { id: 'sprinkler', label: t.sprinkler, badge: '२५% बचत' },
                { id: 'flood', label: t.flood, badge: 'अधिक वापर' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setIrrigationMethod(m.id as any)}
                  className={`p-3 rounded-xl border text-xs font-bold transition text-left ${
                    irrigationMethod === m.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>{m.label}</div>
                  <span className="text-[10px] font-semibold text-slate-500 block mt-1">
                    {m.badge}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  पंप क्षमता (HP Motor)
                </label>
                <select
                  value={pumpHp}
                  onChange={(e) => setPumpHp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={3}>३ एच.पी (3 HP Pump)</option>
                  <option value={5}>५ एच.पी (5 HP Standard)</option>
                  <option value={7.5}>७.५ एच.पी (7.5 HP Heavy)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  सिंचन क्षेत्र (एकर)
                </label>
                <input
                  type="number"
                  min="0.5"
                  max="50"
                  step="0.5"
                  value={acres}
                  onChange={(e) => setAcres(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recommended Pump Run-Time & Savings (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Water Advice Card */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white p-6 shadow-md border-2 border-blue-600">
            <span className="text-xs uppercase font-extrabold tracking-wider text-blue-200">
              {t.pumpRunTime} ({acres} {t.acres} {selectedCrop.nameMr.split(' ')[0]})
            </span>

            <div className="mt-3">
              <div className="text-3xl sm:text-4xl font-black tracking-tight flex items-baseline gap-2">
                <span>{displayHours} तास {displayMins} मिनिटे</span>
              </div>
              <p className="text-blue-200 text-xs font-semibold mt-1">
                दैनंदिन पाण्याची गरज: {totalDailyWater.toLocaleString('en-IN')} {t.litersPerDay}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-white/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-blue-200">{t.dailyWaterReq}:</span>
                <span className="font-extrabold">{dailyWaterPerAcre.toLocaleString('en-IN')} लिटर/एकर</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-200">सिंचन वेळ (महावितरण वीज):</span>
                <span className="font-extrabold text-amber-300">सकाळी ०८:०० ते १०:४० (शिफारस)</span>
              </div>
            </div>

            {irrigationMethod === 'drip' && (
              <div className="mt-4 p-3 rounded-xl bg-white/10 backdrop-blur-xs text-xs flex items-center gap-2 border border-white/20">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  पाट पाण्याच्या तुलनेत <strong>{waterSavedLiters.toLocaleString('en-IN')} लिटर ({waterSavedPct}%)</strong> पाण्याची बचत!
                </span>
              </div>
            )}
          </div>

          {/* MahaDBT Drip Subsidy Info Card */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.dripSubsidyCard}</span>
              </h4>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                MahaDBT
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              महाराष्ट्र शासनाच्या महाडीबीटी पोर्टलद्वारे ठिबक व तुषार सिंचन संचासाठी <strong>७५% ते ८०% थेट अनुदान (डीबीटी)</strong> शेतकऱ्यांच्या बँक खात्यावर जमा केले जाते.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-700 space-y-1 font-medium">
              <div className="font-bold text-slate-900">आवश्यक कागदपत्रे:</div>
              <div>• डिजिटल ७/१२ व ८-अ उतारा</div>
              <div>• आधार लिंक बँक खाते व वीज बिल पावती</div>
              <div>• अधिकृत ठिबक कंपनीचे कोटेशन व बिल</div>
            </div>

            <a
              href="https://mahadbt.maharashtra.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <span>{t.applyGovLink}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
