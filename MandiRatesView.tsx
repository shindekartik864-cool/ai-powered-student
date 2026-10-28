import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  MapPin, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Language, translations } from '../translations';
import { APMC_RATES, MandiRate } from '../data/maharashtraData';

interface MandiRatesViewProps {
  language: Language;
}

export const MandiRatesView: React.FC<MandiRatesViewProps> = ({ language }) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  const filteredRates = APMC_RATES.filter((rate) => {
    const matchesSearch = 
      rate.commodityMr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.commodityEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.marketNameMr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict = selectedDistrict === 'all' || rate.district.includes(selectedDistrict);
    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.mandiRatesTitle}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.mandiRatesTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.mandiSubtitle}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="पीक किंवा बाजार समिती शोधा..."
              className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 w-52"
            />
          </div>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">सर्व जिल्हे (All)</option>
            <option value="नाशिक">नाशिक (Nashik)</option>
            <option value="अकोला">अकोला (Akola)</option>
            <option value="यवतमाळ">यवतमाळ (Yavatmal)</option>
            <option value="पुणे">पुणे (Pune)</option>
            <option value="लातूर">लातूर (Latur)</option>
            <option value="जळगाव">जळगाव (Jalgaon)</option>
          </select>
        </div>
      </div>

      {/* Mandi Rates Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRates.map((rate) => {
          const isAboveMsp = rate.modalPrice >= rate.mspPrice;
          return (
            <div
              key={rate.id}
              className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {rate.district}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {rate.marketNameMr}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">{rate.commodityMr}</p>
                </div>

                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                  rate.trend === 'up' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : rate.trend === 'down'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {rate.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{rate.changeAmount > 0 ? `+₹${rate.changeAmount}` : `₹${rate.changeAmount}`}</span>
                </span>
              </div>

              {/* Price Details */}
              <div className="p-3.5 rounded-xl bg-slate-50 space-y-2 border border-slate-100">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-semibold">{t.currentPrice}:</span>
                  <span className="text-2xl font-black text-slate-900">₹{rate.modalPrice}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>किमान - कमाल भाव:</span>
                  <span className="font-semibold text-slate-800">₹{rate.minPrice} - ₹{rate.maxPrice}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>दैनिक आवक:</span>
                  <span className="font-semibold text-slate-800">{rate.arrivalQty}</span>
                </div>
              </div>

              {/* MSP Comparison Status */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500">
                  {t.msp}: <strong>₹{rate.mspPrice}</strong>
                </span>
                <span className={`font-bold ${isAboveMsp ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isAboveMsp ? `+₹${rate.modalPrice - rate.mspPrice} (${t.aboveMsp})` : `-${rate.mspPrice - rate.modalPrice} (${t.belowMsp})`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* APMC Selling Advice Note */}
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-950 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p>
          <strong>शेतकरी बाजार टीप:</strong> महाराष्ट्र राज्य कृषी पणन मंडळ (MSAMB) व ई-नाम (e-NAM) मानकांनुसार कांदा व सोयाबीन मालाची प्रतवारी (Grading & Sorting) करूनच विक्रीस आणावी. दर्जेदार प्रतवारीमुळे प्रति क्विंटल ₹१५० ते ₹३०० अधिक दर मिळू शकतो.
        </p>
      </div>
    </div>
  );
};
