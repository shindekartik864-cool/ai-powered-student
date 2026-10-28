import React from 'react';
import { 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle,
  Award
} from 'lucide-react';
import { Language, translations } from '../translations';
import { GOV_SCHEMES } from '../data/maharashtraData';

interface GovSchemesViewProps {
  language: Language;
}

export const GovSchemesView: React.FC<GovSchemesViewProps> = ({ language }) => {
  const t = translations[language];

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <FileText className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.schemesTitle}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t.schemesTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          महाराष्ट्र शासन व केंद्र शासनाच्या प्रमुख कृषी अनुदान व विमा योजनांची माहिती आणि थेट अर्ज लिंक
        </p>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {GOV_SCHEMES.map((scheme) => (
          <div
            key={scheme.id}
            className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                  महाराष्ट्र शासन
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {scheme.titleMr}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {scheme.titleEn}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs space-y-1">
                <span className="font-extrabold text-emerald-900 block">
                  अनुदान स्वरूप (Subsidy Amount):
                </span>
                <p className="text-emerald-800 font-medium">
                  {scheme.subsidyMr}
                </p>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">
                  पात्रता व आवश्यक कागदपत्रे:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {scheme.eligibilityMr}
                </p>
              </div>
            </div>

            <a
              href={scheme.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <span>{t.applyGovLink}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
