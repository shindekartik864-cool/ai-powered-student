import React, { useState } from 'react';
import { 
  CalendarDays, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Sprout, 
  Droplets, 
  Clock, 
  TrendingUp, 
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Language, translations } from '../translations';
import { MAHARASHTRA_CROPS, MAHARASHTRA_DISTRICTS, SOIL_TYPES, CropInfo } from '../data/maharashtraData';

interface CropPlannerProps {
  language: Language;
  farmData: any;
  onNavigateToCalculator?: (cropId: string) => void;
}

export const CropPlanner: React.FC<CropPlannerProps> = ({
  language,
  farmData,
  onNavigateToCalculator,
}) => {
  const t = translations[language];

  const [selectedSeason, setSelectedSeason] = useState<'kharif' | 'rabi' | 'summer'>('kharif');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(farmData.district || 'नाशिक (Nashik)');
  const [selectedSoil, setSelectedSoil] = useState<string>(farmData.soilType || 'black_medium');
  const [selectedCropId, setSelectedCropId] = useState<string>('onion');

  const filteredCrops = MAHARASHTRA_CROPS.filter(crop => {
    if (selectedSeason === 'kharif') return crop.season === 'kharif' || crop.season === 'annual';
    if (selectedSeason === 'rabi') return crop.season === 'rabi' || crop.season === 'annual';
    return crop.season === 'summer' || crop.season === 'annual';
  });

  const activeCrop = MAHARASHTRA_CROPS.find(c => c.id === selectedCropId) || filteredCrops[0] || MAHARASHTRA_CROPS[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.cropPlannerTitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.cropPlannerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.cropPlannerSubtitle}
            </p>
          </div>

          {/* District & Soil Quick Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent focus:outline-none font-bold text-slate-800"
              >
                {MAHARASHTRA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <select
                value={selectedSoil}
                onChange={(e) => setSelectedSoil(e.target.value)}
                className="bg-transparent focus:outline-none font-bold text-slate-800"
              >
                {SOIL_TYPES.map((s) => (
                  <option key={s.id} value={s.id}>{s.nameMr}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Season Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setSelectedSeason('kharif')}
            className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              selectedSeason === 'kharif'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🌧️</span>
            <span>{t.seasonKharif}</span>
          </button>
          <button
            onClick={() => setSelectedSeason('rabi')}
            className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              selectedSeason === 'rabi'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🌾</span>
            <span>{t.seasonRabi}</span>
          </button>
          <button
            onClick={() => setSelectedSeason('summer')}
            className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              selectedSeason === 'summer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>☀️</span>
            <span>{t.seasonSummer}</span>
          </button>
        </div>
      </div>

      {/* Recommended Crops Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <span>{t.recommendedCrops}</span>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              {filteredCrops.length} पिके
            </span>
          </h3>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            हवामान व जमिनीच्या गुणवत्तेनुसार क्रमवारी
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCrops.map((crop) => {
            const isSelected = activeCrop.id === crop.id;
            return (
              <div
                key={crop.id}
                onClick={() => setSelectedCropId(crop.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200/80 bg-white hover:border-emerald-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{crop.nameMr}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{crop.nameEn}</p>
                  </div>
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    स्कोर {crop.profitScore}/१००
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {t.durationDays}:
                    </span>
                    <span className="font-bold text-slate-800">{crop.durationDays} दिवस</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" />
                      {t.waterReq}:
                    </span>
                    <span className="font-semibold text-slate-800">{crop.waterNeed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">अपेक्षित भाव:</span>
                    <span className="font-black text-emerald-700">₹{crop.defaultMandiPrice}/{crop.yieldUnit}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 truncate max-w-[150px]">
                    आंतरपीक: {crop.intercropPair.split(' ')[0]}
                  </span>
                  <span className={`font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {isSelected ? '✓ निवडले' : 'निवडा'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Crop Lifecycle Timeline & Nutrient Milestones */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-slate-900">
                🌱 {activeCrop.nameMr} - {t.cropCalendar}
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {t.aiBadge}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              महात्मा फुले कृषी विद्यापीठ (MPKV) शिफारशीत वेळापत्रक
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <span>उत्पादन क्षमता: {activeCrop.expectedYieldPerAcre} {activeCrop.yieldUnit}/एकर</span>
          </div>
        </div>

        {/* 5-Stage Timeline */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
          {/* Stage 1 */}
          <div className="relative group">
            <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              १
            </div>
            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
              <div className="flex items-center justify-between">
                <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {t.stage1}
                </h5>
                <span className="text-[10px] font-bold bg-slate-200/80 px-2 py-0.5 rounded text-slate-700">दिवस ० - १५</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                <strong>मशागत व बीजप्रक्रिया:</strong> ट्रायकोडर्मा ५ ग्रॅम प्रति किलो बियाण्यांस चोळावे. बेसल डोस म्हणून एकरी १ बॅग DAP + १ बॅग पोटॅश + १० किलो गंधक (Sulphur) द्यावे.
              </p>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="relative group">
            <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              २
            </div>
            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
              <div className="flex items-center justify-between">
                <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {t.stage2}
                </h5>
                <span className="text-[10px] font-bold bg-slate-200/80 px-2 py-0.5 rounded text-slate-700">दिवस २० - ३०</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                <strong>तण नियंत्रण व शाकीय वाढ:</strong> पहिली खुरपणी करावी. शाकीय वाढीसाठी १९:१९:१९ विद्राव्य खताची (५ ग्रॅम प्रति लिटर पाणी) फवारणी करावी किंवा ठिबकद्वारे द्यावे.
              </p>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="relative group">
            <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              ३
            </div>
            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
              <div className="flex items-center justify-between">
                <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {t.stage3}
                </h5>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">दिवस ४० - ५५ (महत्त्वाचा टप्पा)</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                <strong>फुलधारणा व कीड संरक्षण:</strong> निंबोळी अर्क ५% किंवा योग्य कीटकनाशकाची फवारणी. फुलगळ रोखण्यासाठी बोरॉन (१ ग्रॅम/लिटर) व १२:६१:०० ची फवारणी उपयुक्त ठरते.
              </p>
            </div>
          </div>

          {/* Stage 4 */}
          <div className="relative group">
            <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              ४
            </div>
            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
              <div className="flex items-center justify-between">
                <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {t.stage4}
                </h5>
                <span className="text-[10px] font-bold bg-slate-200/80 px-2 py-0.5 rounded text-slate-700">दिवस ६० - ८०</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                <strong>फळे/शेंगा विकास:</strong> ००:५२:३४ किंवा ००:००:५० पोटॅशची फवारणी. यामुळे दाणे/फळे टपोरी, वजनदार व चमकदार होतात. पाण्याची कमतरता भासू देऊ नये.
              </p>
            </div>
          </div>

          {/* Stage 5 */}
          <div className="relative group">
            <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              ५
            </div>
            <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-200">
              <div className="flex items-center justify-between">
                <h5 className="font-extrabold text-emerald-900 text-xs sm:text-sm">
                  {t.stage5}
                </h5>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">दिवस ९० - १२०</span>
              </div>
              <p className="text-xs text-emerald-950 mt-1">
                <strong>काढणी व प्रतवारी:</strong> काढणीपूर्वी १०-१५ दिवस सिंचन बंद करावे. काढणीनंतर सावलीत सुकवून प्रतवारी (Grading) करावी, जेणेकरून बाजारात प्रति क्विंटल ₹२००-४०० अधिक भाव मिळतो.
              </p>
            </div>
          </div>
        </div>

        {/* Intercropping Advantage Card */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-950">
            <strong>महाराष्ट्र कृषी विद्यापीठ शिफारस (आंतरपीक): </strong>
            {activeCrop.nameMr} पिकासोबत <strong>{activeCrop.intercropPair}</strong> घेतल्यास जमिनीची सुपीकता वाढते आणि एकाच हंगामात दुहेरी आर्थिक उत्पन्न मिळते!
          </div>
        </div>
      </div>
    </div>
  );
};
